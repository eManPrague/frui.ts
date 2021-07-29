import camelCase from "lodash/camelCase";
import uniq from "lodash/uniq";
import path from "path";
import { Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import ObservableFormatter from "../formatters/observableFormatter";
import AliasEntity from "../models/aliasEntity";
import EntityProperty from "../models/entityProperty";
import Enum from "../models/enum";
import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import TypeReference from "../models/typeReference";
import { IConfig, ValidationConfig } from "../types";

export default class ObjectEntityWriter {
  constructor(
    private parentDirectory: Directory,
    private config: Partial<IConfig>,
    private templates: Record<"objectEntityContent" | "objectEntityFile", Handlebars.TemplateDelegate>
  ) {}

  write(definition: ObjectEntity, baseClass?: ObjectEntity) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition, baseClass) : this.createFile(fileName, definition, baseClass);
  }

  private updateFile(file: SourceFile, definition: ObjectEntity, baseClass: ObjectEntity | undefined) {
    const currentClass = file.getClass(definition.name);
    if (currentClass) {
      currentClass.removeText();
      currentClass.insertText(currentClass.getEnd() - 1, writer => {
        writer.newLineIfLastNot();
        writer.write(this.getEntityContent(definition, baseClass));
      });

      if (baseClass) {
        currentClass.setExtends(baseClass.name);
      }
    }

    return file;
  }

  private createFile(fileName: string, definition: ObjectEntity, baseClass: ObjectEntity | undefined) {
    const decoratorImports = this.getPropertyDecoratorsImports(definition.properties);
    const propertiesToImport = definition.properties.filter(x => x.type.isImportRequired);

    interface SplitImports {
      enumsToImport: Array<string>;
      entitiesToImport: Array<string>;
    }

    const { entitiesToImport, enumsToImport } = propertiesToImport.reduce(
      (accumulator: SplitImports, property) => {
        const typeName = property.type.getTypeName();
        if (typeName) {
          if (property.type.type instanceof Enum) {
            accumulator.enumsToImport.push(typeName);
          } else {
            accumulator.entitiesToImport.push(typeName);
          }
        }
        return accumulator;
      },
      { entitiesToImport: [], enumsToImport: [] }
    );

    if (baseClass) {
      entitiesToImport.push(baseClass.name);
    }

    const entityImports = uniq(entitiesToImport)
      .sort()
      .map((x: string) => `import ${x} from "./${camelCase(x)}";`);

    const pathToEnums = this.getPathToEnums();
    const enumsImports = uniq(enumsToImport)
      .sort()
      .map((x: string) => `import ${x} from "${pathToEnums}/${camelCase(x)}";`);

    const result = this.templates.objectEntityFile({
      imports: [...decoratorImports, ...entityImports, ...enumsImports],
      content: () => this.getEntityContent(definition, baseClass),
      entity: definition,
      baseClass,
    });

    return this.parentDirectory.createSourceFile(fileName, result, { overwrite: true });
  }

  getPathToEnums() {
    function convertPath(windowsPath: string) {
      return windowsPath
        .replace(/^\\\\\?\\/, "")
        .replace(/\\/g, "/")
        .replace(/\/\/+/g, "/");
    }

    if (this.config.enumsPath && this.config.entitiesPath) {
      const relativePath = convertPath(path.relative(this.config.entitiesPath, this.config.enumsPath));
      if (!relativePath.startsWith(".")) {
        return `./${relativePath}`;
      }
      return relativePath;
    }

    return ".";
  }

  getPropertyDecoratorsImports(properties: EntityProperty[]) {
    const result = new Set<string>();

    if (properties.some(p => p.tags?.get(ObservableFormatter.OBSERVABLE))) {
      result.add(`import { observable } from "mobx";`);
    }

    if (this.config.conversion !== false) {
      for (const property of properties) {
        for (const importStatement of this.getPropertyTypeConversionImports(property.type)) {
          result.add(importStatement);
        }
      }

      if (properties.some(p => p.externalName)) {
        result.add(`import { Expose } from "class-transformer";`);
      }
    }

    return result;
  }

  getPropertyTypeConversionImports(reference: TypeReference): string[] {
    if (reference.type instanceof AliasEntity) {
      return this.getPropertyTypeConversionImports(reference.type.referencedEntity);
    }

    const result: string[] = [];

    if (reference.type instanceof Enum) {
      return result;
    }

    if (typeof reference.type === "object") {
      result.push(`import { Type } from "class-transformer";`);
    }

    if (reference.type === "Date") {
      if (this.config.dates === "date-fns") {
        result.push(`import { Transform } from "class-transformer";`, `import formatISO from "date-fns/formatISO";`);
      } else {
        result.push(`import { Type } from "class-transformer";`);
      }
    }

    return result;
  }

  private getEntityContent(definition: ObjectEntity, baseClass: ObjectEntity | undefined) {
    const context = {
      entity: definition,
      baseClass,
      properties: definition.properties.map(p => {
        const nullable = p.restrictions?.get(Restriction.nullable);
        return {
          name: p.name,
          externalName: this.config.conversion !== false && p.externalName,
          type: p.type.getTypeDeclaration() ?? "UNKNOWN",
          description: p.description,
          example: p.example,
          isObservable: p.tags?.get(ObservableFormatter.OBSERVABLE),
          conversions: this.config.conversion !== false && this.getPropertyTypeConversions(p),
          readonly: p.restrictions?.has(Restriction.readOnly),
          nullable,
          required: nullable !== true && p.restrictions?.has(Restriction.required),
          validations: this.getPropertyValidations(p),
        };
      }),
      validationEntity: this.config.validation !== false && hasValidation(definition) && {},
      useBaseClassValidation: baseClass && hasValidation(baseClass),
    };
    return this.templates.objectEntityContent(context);
  }

  private *getPropertyTypeConversions(property: EntityProperty) {
    let type = property.type.type;

    if (type instanceof AliasEntity) {
      type = type.referencedEntity.type;
    }

    if (type instanceof Enum) {
      return;
    }

    if (typeof type === "object") {
      yield `@Type(() => ${property.type.getTypeName()})`;
    }

    if (type === "Date") {
      if (this.config.dates === "date-fns") {
        yield `@Transform(value => (value ? new Date(value) : undefined), { toClassOnly: true })`;

        const format = property.restrictions?.get(Restriction.format);
        if (format === "date") {
          yield `@Transform(value => (value ? formatISO(value, { representation: "date" }) : undefined), { toPlainOnly: true })`;
        } else {
          yield `@Transform(value => (value ? formatISO(value) : undefined), { toPlainOnly: true })`;
        }
      } else {
        yield `@Type(() => Date)`;
      }
    }
  }

  private getPropertyValidations(property: EntityProperty) {
    if (property.restrictions?.size) {
      const definitions: string[] = [];
      property.restrictions.forEach((params, key) => {
        const definition = this.getRestrictionDefinition(key, params);
        if (definition && !definitions.includes(definition)) {
          definitions.push(definition);
        }
      });

      return definitions;
    }

    return undefined;
  }

  private getRestrictionDefinition(restriction: Restriction, params: any) {
    const restrictionName = Restriction[restriction];
    const restrictionConfiguration = this.config.validations?.[restrictionName];
    if (restrictionConfiguration === false) {
      return undefined;
    }

    const validationParams = JSON.stringify(params);
    if (!shouldWriteValidation(restrictionConfiguration, validationParams)) {
      return undefined;
    }

    const validationName = getValidationName(restrictionConfiguration) ?? restrictionName;
    return `${validationName}: ${validationParams}`;
  }
}

function hasValidation(entity: ObjectEntity) {
  return entity.properties.some(p => p.restrictions?.size);
}

function getValidationName(config?: ValidationConfig) {
  if (typeof config === "string") {
    return config;
  }
  if (typeof config === "object") {
    return config.name;
  }
  return undefined;
}

function shouldWriteValidation(config: ValidationConfig | undefined, value: string) {
  if (typeof config === "object" && config.filter) {
    return !!value.match(config.filter);
  } else {
    return true;
  }
}
