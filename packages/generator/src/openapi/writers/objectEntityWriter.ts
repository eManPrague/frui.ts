import { camelCase, uniq } from "lodash";
import type { Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import ObservableFormatter from "../formatters/observableFormatter";
import AliasEntity from "../models/aliasEntity";
import type EntityProperty from "../models/entityProperty";
import Enum from "../models/enum";
import type ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import type TypeReference from "../models/typeReference";
import type { IConfig, ValidationRuleConfig } from "../types";

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
    const entitiesToImport = definition.properties.filter(x => x.type.isImportRequired).map(x => x.type.getTypeName());

    if (baseClass) {
      entitiesToImport.push(baseClass.name);
    }

    const entityImports = uniq(entitiesToImport)
      .sort()
      .map(x => `import ${x} from "./${camelCase(x)}";`);

    const result = this.templates.objectEntityFile({
      imports: [...decoratorImports, ...entityImports],
      content: () => this.getEntityContent(definition, baseClass),
      entity: definition,
      baseClass,
    });

    return this.parentDirectory.createSourceFile(fileName, result, { overwrite: true });
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
          type: p.type.getTypeDeclaration() || "UNKNOWN",
          description: p.description,
          example: p.example,
          isObservable: p.tags?.get(ObservableFormatter.OBSERVABLE) as boolean,
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
    if (property.validations?.size) {
      const definitions: string[] = [];
      property.validations.forEach((params, key) => {
        const definition = this.getValidationDefinition(key, params);
        if (definition && !definitions.includes(definition)) {
          definitions.push(definition);
        }
      });

      return definitions;
    }

    return undefined;
  }

  private getValidationDefinition(restriction: Restriction, params: any) {
    const restrictionName = Restriction[restriction];
    const validationConfiguration =
      typeof this.config.validations === "object" ? this.config.validations.rules?.[restrictionName] : undefined;
    if (validationConfiguration === false) {
      return undefined;
    }

    const validationParams = JSON.stringify(params);
    if (!shouldWriteValidation(validationConfiguration, validationParams)) {
      return undefined;
    }

    const validationName = getValidationName(validationConfiguration) ?? restrictionName;
    return `${validationName}: ${validationParams}`;
  }
}

function hasValidation(entity: ObjectEntity) {
  return entity.properties.some(p => p.restrictions?.size);
}

function getValidationName(config?: ValidationRuleConfig) {
  if (typeof config === "string") {
    return config;
  }
  if (typeof config === "object") {
    return config.name;
  }
  return undefined;
}

const cachedRegexes = new Map<string, RegExp>();

function getCachedRegex(pattern: string) {
  const cached = cachedRegexes.get(pattern);
  if (cached) {
    return cached;
  }

  const regex = new RegExp(pattern);
  cachedRegexes.set(pattern, regex);
  return regex;
}

function shouldWriteValidation(config: ValidationRuleConfig | undefined, value: string) {
  if (typeof config === "object" && config.filter) {
    const regex = getCachedRegex(config.filter);
    return !!regex.exec(value);
  } else {
    return true;
  }
}
