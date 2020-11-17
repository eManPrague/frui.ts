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
import { IGeneratorParams } from "../types";

export default class ObjectEntityWriter {
  constructor(private parentDirectory: Directory, private params: IGeneratorParams) {}

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
    const requiredImports = definition.properties.filter(x => needsImport(x.type)).map(x => x.type.getTypeName());

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
          .conditionalWrite(!!baseClass, ` extends ${baseClass?.name}`)
          .block(() => this.writeEntityBody(writer, definition, baseClass))
          .newLineIfLastNot();
      },
      { overwrite: true }
    );
  }

  private writeEntityBody(writer: CodeBlockWriter, definition: ObjectEntity, baseClass: ObjectEntity | undefined) {
    definition.properties.forEach(p => this.writeEntityProperty(writer, p));

    if (this.params.generateValidation) {
      writeValidationEntity(writer, definition, baseClass);
    }
  }

  writeEntityProperty(writer: CodeBlockWriter, property: EntityProperty) {
    writer.conditionalBlankLine(!writer.isAtStartOfFirstLineOfBlock());
    this.writePropertyDoc(writer, property);
    this.writePropertyDecorators(writer, property);

    const readOnly = property.restrictions?.has(Restriction.readOnly);
    const nullable = property.restrictions?.get(Restriction.nullable);
    const required = nullable === false || (property.restrictions?.has(Restriction.required) && nullable !== true);

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
        writer.writeLine(" * @example").write(" * ").write(property.example.toString()).newLine();
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
      if (properties.some(p => needsTypeConversion(p.type))) {
        result.add(`import { Type } from "class-transformer";`);
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
      if (needsTypeConversion(property.type)) {
        writer.writeLine(`@Type(() => ${property.type.getTypeName()})`);
      }

      if (property.externalName) {
        writer.writeLine(`@Expose({ name: "${property.externalName}" })`);
      }
    }
  }
}

function writeValidationEntity(writer: CodeBlockWriter, entity: ObjectEntity, baseClass: ObjectEntity | undefined) {
  if (hasValidation(entity)) {
    if (baseClass && hasValidation(baseClass)) {
      writer.blankLineIfLastNot().writeLine("static ValidationRules = Object.assign(");
      writer.indent(() => {
        writer.inlineBlock(() => entity.properties.forEach(p => writeValidationProperty(writer, p)));
        writer.write(",").newLine();
        writer.writeLine(`${baseClass.name}.ValidationRules`);
      });
      writer.writeLine(");");
    } else {
      writer.blankLineIfLastNot().write("static ValidationRules = {");
      writer.indent(() => entity.properties.forEach(p => writeValidationProperty(writer, p)));
      writer.write("};").newLine();
    }
  } else if (baseClass && hasValidation(baseClass)) {
    writer.blankLineIfLastNot().writeLine(`static ValidationRules = ${baseClass.name}.ValidationRules;`);
  }
}

function hasValidation(entity: ObjectEntity) {
  return entity.properties.some(p => p.restrictions?.size);
}

function writeValidationProperty(writer: CodeBlockWriter, property: EntityProperty) {
  if (property.restrictions?.size) {
    const definitions: string[] = [];
    property.restrictions.forEach((params, key) => {
      const definition = getRestrictionDefinition(key, params);
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

function getRestrictionDefinition(restriction: Restriction, params: any) {
  // eslint-disable-next-line @typescript-eslint/tslint/config
  switch (restriction) {
    case Restriction.nullable: {
      if (params === false) {
        return `required: true`;
      }
      break;
    }
    case Restriction.readOnly: {
      return undefined;
    }
    default:
      return `${Restriction[restriction]}: ${JSON.stringify(params)}`;
  }
}

function needsTypeConversion(reference: TypeReference): boolean {
  if (reference.type instanceof Enum) {
    return false;
  }

  if (reference.type instanceof AliasEntity) {
    return needsTypeConversion(reference.type.referencedEntity);
  }

  return typeof reference.type === "object" || reference.type === "Date";
}

function needsImport(reference: TypeReference): boolean {
  if (reference.type instanceof AliasEntity) {
    return needsImport(reference.type.referencedEntity);
  } else {
    return typeof reference.type === "object";
  }
}
