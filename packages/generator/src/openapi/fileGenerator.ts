import { camelCase, uniq } from "lodash";
import { CodeBlockWriter, Directory, Project } from "ts-morph";
import GeneratorBase from "../generatorBase";
import { createProgressBar } from "../progressBar";
import Entity from "./models/entity";
import EntityProperty from "./models/entityProperty";
import Enum from "./models/enum";
import { Restriction } from "./models/restriction";
import TypeDefinition from "./models/typeDefinition";

export default class FileGenerator {
  constructor(private project: Project, private entities: Entity[], private enums: Enum[]) {}

  async generate(outputFolder: string) {
    const progress = createProgressBar("Generating");
    progress.start(this.entities.length * 2 + this.enums.length, 0); // each entity has also a validation file

    const directory = this.project.createDirectory(outputFolder);

    for (const definition of this.enums) {
      this.createEnumFile(directory, definition);
      progress.increment();
    }
    await this.project.save();

    for (const definition of this.entities) {
      this.createEntityFile(directory, definition);
      progress.increment();
    }
    await this.project.save();

    // TODO generate validation rules

    progress.stop();
  }

  private createEnumFile(parentDirectory: Directory, definition: Enum) {
    const fileName = `${camelCase(definition.name)}.ts`;

    if (!GeneratorBase.canOverwiteFile(parentDirectory, fileName)) {
      return undefined;
    }

    return parentDirectory.createSourceFile(
      fileName,
      writer =>
        writer
          .writeLine(GeneratorBase.generatedFileHeader)
          .blankLine()
          .write("enum ")
          .write(definition.name)
          .block(() => definition.items.forEach(x => writer.write(x).write(",").newLine()))
          .write("export default ")
          .write(definition.name)
          .write(";")
          .newLineIfLastNot(),
      { overwrite: true }
    );
  }

  private createEntityFile(parentDirectory: Directory, definition: Entity) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(parentDirectory, fileName)) {
      return undefined;
    }

    const requiredImports = definition.properties.filter(x => x.type.isEntity || x.type.isEnum).map(x => x.type.name);

    return parentDirectory.createSourceFile(
      fileName,
      writer => {
        writer.writeLine(GeneratorBase.generatedFileHeader).blankLine();

        if (requiredImports.length) {
          uniq(requiredImports)
            .sort()
            .forEach(x => writer.writeLine(`import ${x} from "./${camelCase(x)}";`));
          writer.blankLine();
        }

        writer
          .write("export default interface ")
          .write(definition.name)
          .block(() => definition.properties.forEach(p => this.writeEntityProperty(writer, p)))
          .newLineIfLastNot();
      },
      { overwrite: true }
    );
  }

  private writeEntityProperty(writer: CodeBlockWriter, property: EntityProperty) {
    writer
      .write(property.name)
      .conditionalWrite(!property.restrictions?.has(Restriction.required), "?")
      .write(": ")
      .write(this.getType(property.type))
      .write(";")
      .newLine();
  }

  private getType(type: TypeDefinition) {
    const name = this.convertType(type.name);

    return type.isArray ? name + "[]" : name;
  }

  private convertType(type: string) {
    switch (type) {
      case "integer":
        return "number";
      case "dateTime":
        return "Date";
      default:
        return type;
    }
  }
}
