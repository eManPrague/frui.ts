import { camelCase } from "lodash";
import { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
import TypeEntity from "../models/typeEntity";
export default class TypeEntityWriter {
  constructor(private parentDirectory: Directory) {}

  write(definition: TypeEntity) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition) : this.createFile(fileName, definition);
  }

  private updateFile(file: SourceFile, definition: TypeEntity) {
    const currentEnum = file.getTypeAliasOrThrow(definition.name);
    currentEnum.replaceWithText(writer => this.writeTypeAlias(writer, definition));

    return file;
  }

  private createFile(fileName: string, definition: TypeEntity) {
    const requiredImport = definition.type.isEntity ? definition.type.name : undefined;

    return this.parentDirectory.createSourceFile(
      fileName,
      writer => {
        if (requiredImport) {
          writer.writeLine(`import ${requiredImport} from "./${camelCase(requiredImport)}";`);
          writer.blankLine();
        }

        writer.writeLine(entityGeneratedHeader);
        this.writeTypeAlias(writer, definition);
        writer.writeLine(`export default ${definition.name};`);
      },
      { overwrite: true }
    );
  }

  private writeTypeAlias(writer: CodeBlockWriter, definition: TypeEntity) {
    writer.writeLine(`type ${definition.name} = ${definition.type.name}${definition.type.isArray ? "[]" : ""};`);
  }
}
