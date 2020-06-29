import camelCase from "lodash/camelCase";
import uniq from "lodash/uniq";
import { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
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
          .block(() => this.writeEntityBody(writer, definition))
          .newLineIfLastNot();
      },
      { overwrite: true }
    );
  }

  private writeEntityBody(writer: CodeBlockWriter, definition: ObjectEntity) {
    definition.properties.forEach(p => writeEntityProperty(writer, p));

    if (this.params.generateValidation) {
      writeValidationEntity(writer, definition);
    }

    if (this.params.generateConversion) {
      writeConversionFunction(writer, definition);
    }
  }
}

function writeEntityProperty(writer: CodeBlockWriter, property: EntityProperty) {
  writePropertyDoc(writer, property);

  writer
    .write(property.name)
    .write(property.isRequired ? "!" : "?")
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

function writeConversionFunction(writer: CodeBlockWriter, entity: ObjectEntity) {
  const identifier = camelCase(entity.name);
  const statements = entity.properties.map(x => getConversionStatement(identifier, x)).filter(x => x) as string[];
  if (statements.length) {
    writer
      .blankLineIfLastNot()
      .write("static fromJson(")
      .write(identifier)
      .write(": ")
      .write(entity.name)
      .write(") {")
      .indent(() => statements.forEach(x => writer.writeLine(x)));
    writer.write("}").newLine();
  }
}

function getConversionStatement(identifier: string, property: EntityProperty) {
  // eslint-disable-next-line @typescript-eslint/tslint/config
  switch (property.type.name) {
    case "dateTime":
      return property.isRequired
        ? `${identifier}.${property.name} = new Date(${identifier}.${property.name});`
        : `${identifier}.${property.name} = !!${identifier}.${property.name} ? new Date(${identifier}.${property.name}) : undefined;`;
    default:
      return undefined;
  }
}
