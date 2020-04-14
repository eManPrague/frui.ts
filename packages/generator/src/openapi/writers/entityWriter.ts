import { camelCase, uniq } from "lodash";
import { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
import Entity from "../models/entity";
import EntityProperty from "../models/entityProperty";
import Restriction from "../models/restriction";
import TypeDefinition from "../models/typeDefinition";

export default class EntityWriter {
  constructor(private parentDirectory: Directory) {}

  write(definition: Entity) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition) : this.createFile(fileName, definition);
  }

  private updateFile(file: SourceFile, definition: Entity) {
    const currentClass = file.getClass(definition.name);
    if (currentClass) {
      currentClass.removeText();
      currentClass.insertText(currentClass.getEnd() - 1, writer =>
        writer.newLineIfLastNot().indent(() => writeEntityBody(writer, definition))
      );
    }

    return file;
  }

  private createFile(fileName: string, definition: Entity) {
    const requiredImports = definition.properties.filter(x => x.type.isEntity || x.type.isEnum).map(x => x.type.name);

    return this.parentDirectory.createSourceFile(
      fileName,
      writer => {
        if (requiredImports.length) {
          uniq(requiredImports)
            .sort()
            .forEach(x => writer.writeLine(`import ${x} from "./${camelCase(x)}";`));
          writer.blankLine();
        }

        writer
          .writeLine(entityGeneratedHeader)
          .write("export default class ")
          .write(definition.name)
          .block(() => writeEntityBody(writer, definition))
          .newLineIfLastNot();
      },
      { overwrite: true }
    );
  }
}

function writeEntityBody(writer: CodeBlockWriter, definition: Entity) {
  definition.properties.forEach(p => writeEntityProperty(writer, p));
  writer.blankLine();
  writeValidationEntity(writer, definition);
}

function writeEntityProperty(writer: CodeBlockWriter, property: EntityProperty) {
  writePropertyDoc(writer, property);

  writer
    .write(property.name)
    .conditionalWrite(!property.restrictions?.has(Restriction.required), "?")
    .write(": ")
    .write(getType(property.type))
    .write(";")
    .newLine();
}

function writePropertyDoc(writer: CodeBlockWriter, property: EntityProperty) {
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

function writeValidationEntity(writer: CodeBlockWriter, entity: Entity) {
  writer.write("static ValidationRules = {");

  if (entity.properties.some(p => p.restrictions?.size)) {
    writer.indent(() => entity.properties.forEach(p => writeValidationProperty(writer, p)));
  }
  writer.write("};").newLineIfLastNot();
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
  switch (restriction) {
    default:
      return `${Restriction[restriction]}: ${JSON.stringify(params)}`;
  }
}
