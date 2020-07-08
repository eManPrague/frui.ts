import camelCase from "lodash/camelCase";
import uniq from "lodash/uniq";
import { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
import ObservableFormatter from "../formatters/observableFormatter";
import EntityProperty from "../models/entityProperty";
import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import TypeDefinition from "../models/typeDefinition";
import { IGeneratorParams } from "../types";

export default class ObjectEntityWriter {
  constructor(private parentDirectory: Directory, private params: IGeneratorParams) {}

  write(definition: ObjectEntity) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition) : this.createFile(fileName, definition);
  }

  private updateFile(file: SourceFile, definition: ObjectEntity) {
    const currentClass = file.getClass(definition.name);
    if (currentClass) {
      currentClass.removeText();
      currentClass.insertText(currentClass.getEnd() - 1, writer =>
        writer.newLineIfLastNot().indent(() => this.writeEntityBody(writer, definition))
      );
    }

    return file;
  }

  private createFile(fileName: string, definition: ObjectEntity) {
    const decoratorImports = this.getPropertyDecoratorsImports(definition.properties);

    const requiredImports = definition.properties.filter(x => x.type.isEntity || x.type.enumValues).map(x => x.type.name);
    requiredImports.push(
      ...definition.properties
        .filter(x => x.type.innerTypes)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .flatMap(x => x.type.innerTypes!)
        .map(x => x.name)
    );

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
          .block(() => this.writeEntityBody(writer, definition))
          .newLineIfLastNot();
      },
      { overwrite: true }
    );
  }

  private writeEntityBody(writer: CodeBlockWriter, definition: ObjectEntity) {
    definition.properties.forEach(p => this.writeEntityProperty(writer, p));

    if (this.params.generateValidation) {
      writeValidationEntity(writer, definition);
    }
  }

  writeEntityProperty(writer: CodeBlockWriter, property: EntityProperty) {
    this.writePropertyDoc(writer, property);
    this.writePropertyDecorators(writer, property);

    writer
      .write(property.name)
      .write(property.isRequired ? "!" : "?")
      .write(": ")
      .write(getType(property.type))
      .write(";")
      .newLine();
  }

  writePropertyDoc(writer: CodeBlockWriter, property: EntityProperty) {
    if (property.description || property.example) {
      writer.conditionalBlankLine(!writer.isAtStartOfFirstLineOfBlock()).writeLine("/**");

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
      if (properties.some(p => p.type.isEntity || p.type.name === "dateTime")) {
        result.add(`import { Type } from "class-transformer";`);
      }

      if (properties.some(p => p.rawName)) {
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
      if (property.type.isEntity || property.type.name === "dateTime") {
        writer.writeLine(`@Type(() => ${convertType(property.type.name)})`);
      }

      if (property.rawName) {
        writer.writeLine(`@Expose({ name: "${property.rawName}" })`);
      }
    }
  }
}

function writeValidationEntity(writer: CodeBlockWriter, entity: ObjectEntity) {
  if (entity.properties.some(p => p.restrictions?.size)) {
    writer.blankLineIfLastNot().write("static ValidationRules = {");
    writer.indent(() => entity.properties.forEach(p => writeValidationProperty(writer, p)));
    writer.write("};").newLine();
  }
}

function writeValidationProperty(writer: CodeBlockWriter, property: EntityProperty) {
  if (property.restrictions?.size) {
    writer.write(property.name).write(": { ");

    Array.from(property.restrictions).forEach(([key, params], index) => {
      writer.conditionalWrite(index > 0, ", ").write(getRestrictionDefinition(key, params));
    });

    writer.write(" },").newLine();
  }
}

function getType(type: TypeDefinition) {
  const name = convertType(type.name);

  return type.isArray ? name + "[]" : name;
}

function convertType(type: string) {
  switch (type) {
    case "integer":
      return "number";
    case "dateTime":
      return "Date";
    default:
      return type;
  }
}

function getRestrictionDefinition(restriction: Restriction, params: any) {
  // eslint-disable-next-line @typescript-eslint/tslint/config
  switch (restriction) {
    default:
      return `${Restriction[restriction]}: ${JSON.stringify(params)}`;
  }
}
