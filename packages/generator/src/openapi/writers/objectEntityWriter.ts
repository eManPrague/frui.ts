import camelCase from "lodash/camelCase";
import uniq from "lodash/uniq";
import { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
import ObservableFormatter from "../formatters/observableFormatter";
import AliasEntity from "../models/aliasEntity";
import EntityProperty from "../models/entityProperty";
import Enum from "../models/enum";
import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import TypeReference from "../models/typeReference";
import { IConfig, IGeneratorParams, ValidationConfig } from "../types";

export default class ObjectEntityWriter {
  constructor(private parentDirectory: Directory, private params: IGeneratorParams, private config: Partial<IConfig>) {}

  write(definition: ObjectEntity, baseClass?: ObjectEntity) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition, baseClass) : this.createFile(fileName, definition, baseClass);
  }

  private updateFile(file: SourceFile, definition: ObjectEntity, baseClass?: ObjectEntity) {
    const currentClass = file.getClass(definition.name);
    if (currentClass) {
      currentClass.removeText();
      currentClass.insertText(currentClass.getEnd() - 1, writer =>
        writer.newLineIfLastNot().indent(() => this.writeEntityBody(writer, definition, baseClass))
      );

      if (baseClass) {
        currentClass.setExtends(baseClass.name);
      }
    }

    return file;
  }

  private createFile(fileName: string, definition: ObjectEntity, baseClass: ObjectEntity | undefined) {
    const decoratorImports = this.getPropertyDecoratorsImports(definition.properties);
    const requiredImports = definition.properties
      .filter(x => needsImport(x.type))
      .map(x => x.type.getTypeName())
      .filter(x => x) as string[];

    if (baseClass) {
      requiredImports.push(baseClass.name);
    }

    return this.parentDirectory.createSourceFile(
      fileName,
      writer => {
        decoratorImports.forEach(x => writer.writeLine(x));

        if (requiredImports.length) {
          uniq(requiredImports)
            .sort()
            .forEach(x => writer.writeLine(`import ${x} from "./${camelCase(x)}";`));
        }

        writer.conditionalBlankLine(writer.getLength() > 0);

        writer
          .writeLine(entityGeneratedHeader)
          .write("export default class ")
          .write(definition.name)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .conditionalWrite(!!baseClass, ` extends ${baseClass!.name}`)
          .block(() => this.writeEntityBody(writer, definition, baseClass))
          .newLineIfLastNot();
      },
      { overwrite: true }
    );
  }

  private writeEntityBody(writer: CodeBlockWriter, definition: ObjectEntity, baseClass: ObjectEntity | undefined) {
    definition.properties.forEach(p => this.writeEntityProperty(writer, p));

    if (this.params.generateValidation) {
      this.writeValidationEntity(writer, definition, baseClass);
    }
  }

  writeEntityProperty(writer: CodeBlockWriter, property: EntityProperty) {
    writer.conditionalBlankLine(!writer.isAtStartOfFirstLineOfBlock());
    this.writePropertyDoc(writer, property);
    this.writePropertyDecorators(writer, property);

    const readOnly = property.restrictions?.has(Restriction.readOnly);
    const nullable = property.restrictions?.get(Restriction.nullable);
    const required = nullable !== true && property.restrictions?.has(Restriction.required);

    writer
      .conditionalWrite(readOnly, "readonly ")
      .write(property.name)
      .write(required ? "!" : "?")
      .write(": ")
      .write(property.type.getTypeDeclaration() ?? "UNKNOWN")
      .write(";")
      .newLine();
  }

  writePropertyDoc(writer: CodeBlockWriter, property: EntityProperty) {
    if (property.description || property.example) {
      writer.writeLine("/**");
      if (property.description) {
        writer.write(" * ").write(property.description).newLine();
      }
      if (property.example) {
        writer.writeLine(" * @example").write(" * ").write(property.example).newLine();
      }

      writer.writeLine(" */");
    }
  }

  getPropertyDecoratorsImports(properties: EntityProperty[]) {
    const result = new Set<string>();

    if (properties.some(p => p.tags?.get(ObservableFormatter.OBSERVABLE))) {
      result.add(`import { observable } from "mobx";`);
    }

    if (this.params.generateConversion) {
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

  writePropertyDecorators(writer: CodeBlockWriter, property: EntityProperty) {
    writer.conditionalBlankLine(!writer.isAtStartOfFirstLineOfBlock() && !writer.isLastBlankLine);

    if (property.tags?.get(ObservableFormatter.OBSERVABLE)) {
      writer.writeLine("@observable");
    }

    if (this.params.generateConversion) {
      this.writePropertyTypeConversion(writer, property);

      if (property.externalName) {
        writer.writeLine(`@Expose({ name: "${property.externalName}" })`);
      }
    }
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

  writePropertyTypeConversion(writer: CodeBlockWriter, property: EntityProperty) {
    let type = property.type.type;

    if (type instanceof AliasEntity) {
      type = type.referencedEntity.type;
    }

    if (type instanceof Enum) {
      return;
    }

    if (typeof type === "object") {
      const typeName = property.type.getTypeName();
      if (typeName) {
        writer.writeLine(`@Type(() => ${typeName})`);
      }
    }

    if (type === "Date") {
      if (this.config.dates === "date-fns") {
        writer.writeLine(`@Transform(value => (value ? new Date(value) : undefined), { toClassOnly: true })`);

        const format = property.restrictions?.get(Restriction.format);
        if (format === "date") {
          writer.writeLine(
            `@Transform(value => (value ? formatISO(value, { representation: "date" }) : undefined), { toPlainOnly: true })`
          );
        } else {
          writer.writeLine(`@Transform(value => (value ? formatISO(value) : undefined), { toPlainOnly: true })`);
        }
      } else {
        writer.writeLine(`@Type(() => Date)`);
      }
    }
  }

  private writeValidationEntity(writer: CodeBlockWriter, entity: ObjectEntity, baseClass: ObjectEntity | undefined) {
    if (hasValidation(entity)) {
      if (baseClass && hasValidation(baseClass)) {
        writer.blankLineIfLastNot().writeLine("static ValidationRules = Object.assign(");
        writer.indent(() => {
          writer.inlineBlock(() => entity.properties.forEach(p => this.writeValidationProperty(writer, p)));
          writer.write(",").newLine();
          writer.writeLine(`${baseClass.name}.ValidationRules`);
        });
        writer.writeLine(");");
      } else {
        writer.blankLineIfLastNot().write("static ValidationRules = {");
        writer.indent(() => entity.properties.forEach(p => this.writeValidationProperty(writer, p)));
        writer.write("};").newLine();
      }
    } else if (baseClass && hasValidation(baseClass)) {
      writer.blankLineIfLastNot().writeLine(`static ValidationRules = ${baseClass.name}.ValidationRules;`);
    }
  }

  private writeValidationProperty(writer: CodeBlockWriter, property: EntityProperty) {
    if (property.restrictions?.size) {
      const definitions: string[] = [];
      property.restrictions.forEach((params, key) => {
        const definition = this.getRestrictionDefinition(key, params);
        if (definition && !definitions.includes(definition)) {
          definitions.push(definition);
        }
      });

      if (definitions.length) {
        writer.write(property.name).write(": { ");
        definitions.forEach((x, i) => writer.conditionalWrite(i > 0, ", ").write(x));
        writer.write(" },").newLine();
      }
    }
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

function needsImport(reference: TypeReference): boolean {
  if (reference.type instanceof AliasEntity) {
    return needsImport(reference.type.referencedEntity);
  } else {
    return typeof reference.type === "object";
  }
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

function shouldWriteValidation(config: ValidationConfig | undefined, value: string) {
  if (typeof config === "object" && config.filter) {
    const regex = getCachedRegex(config.filter);
    return !!regex.exec(value);
  } else {
    return true;
  }
}
