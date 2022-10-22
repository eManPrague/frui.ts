import { camelCase, uniq } from "lodash";
import type { Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import ObservableFormatter from "../formatters/observableFormatter";
import AliasEntity from "../models/aliasEntity";
import type EntityProperty from "../models/entityProperty";
import Enum from "../models/enum";
import type ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import type { IConfig, ValidationRuleConfig } from "../types";

export default class ObjectEntityWriter {
  constructor(
    private parentDirectory: Directory,
    private config: Partial<IConfig>,
    private templates: Record<"objectEntityContent" | "objectEntityFile" | "entityImport", Handlebars.TemplateDelegate>
  ) {}

  write(definition: ObjectEntity, baseClasses?: ObjectEntity[]) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition, baseClasses) : this.createFile(fileName, definition, baseClasses);
  }

  private updateFile(file: SourceFile, definition: ObjectEntity, baseClasses: ObjectEntity[] | undefined) {
    const currentClass = file.getClass(definition.name);
    if (currentClass) {
      currentClass.removeText();
      currentClass.insertText(currentClass.getEnd() - 1, writer => {
        writer.newLineIfLastNot();
        writer.write(this.getEntityContent(definition, baseClasses));
      });

      const baseClass = baseClasses?.[0];
      if (baseClass) {
        currentClass.setExtends(baseClass.name);
      }

      return file;
    }

    const currentBuildFunction = file.getFunction(`build${definition.name}`);
    if (currentBuildFunction) {
      currentBuildFunction.removeText();
      currentBuildFunction.insertText(currentBuildFunction.getEnd() - 1, writer => {
        writer.newLineIfLastNot();
        writer.write(this.getEntityContent(definition, baseClasses));
      });
    }

    return file;
  }

  private createFile(fileName: string, definition: ObjectEntity, baseClasses: ObjectEntity[] | undefined) {
    const entitiesToImport = definition.properties.filter(x => x.type.isImportRequired).map(x => x.type.getTypeName());

    baseClasses?.forEach(x => entitiesToImport.push(x.name));

    const entityImports = uniq(entitiesToImport)
      .sort()
      .map(x =>
        this.templates.entityImport({
          entity: x,
          filePath: `./${camelCase(x)}`,
        })
      );

    const result = this.templates.objectEntityFile({
      imports: entityImports,
      content: () => this.getEntityContent(definition, baseClasses),
      entity: definition,
      baseClasses,
    });

    return this.parentDirectory.createSourceFile(fileName, result, { overwrite: true });
  }

  private getEntityContent(definition: ObjectEntity, baseClasses: ObjectEntity[] | undefined) {
    const context = {
      entity: definition,
      baseClasses,
      properties: definition.properties.map(p => {
        const nullable = p.restrictions?.get(Restriction.nullable);
        return {
          name: p.name,
          externalName: this.config.conversion !== false && p.externalName,
          type: p.type.getTypeDeclaration() || "UNKNOWN",
          typeName: p.type.getTypeName(),
          isArray: p.type.isArray,
          hasTypeImport: p.type.isImportRequired,
          description: p.description,
          example: p.example,
          isObservable: p.tags?.get(ObservableFormatter.OBSERVABLE) as boolean,
          conversions: this.config.conversion !== false && this.getPropertyTypeConversions(p),
          readonly: p.restrictions?.has(Restriction.readOnly),
          nullable,
          required: nullable !== true && p.restrictions?.has(Restriction.required),
          format: p.restrictions?.get(Restriction.format),
          validations: this.getPropertyValidations(p),
          rawValidations: this.getRawPropertyValidations(p),
        };
      }),
      validationEntity: this.config.validations !== false && hasValidation(definition) && {},
      useBaseClassValidation: !!baseClasses?.some(x => hasValidation(x)),
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

  private getRawPropertyValidations(property: EntityProperty) {
    if (property.validations) {
      const validations = Array.from(property.validations.entries())
        .filter(x => !!x[1])
        .map(x => [Restriction[x[0]], x[1]]);

      return Object.fromEntries(validations) as Record<string, unknown>;
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
