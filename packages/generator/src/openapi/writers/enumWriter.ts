import { camelCase } from "lodash";
import { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
import Enum from "../models/enum";
export default class EnumWriter {
  constructor(private parentDirectory: Directory) {}

  write(definition: Enum) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition) : this.createFile(fileName, definition);
  }

  private updateFile(file: SourceFile, definition: Enum) {
    const currentEnum = file.getEnum(definition.name);

    if (currentEnum) {
      currentEnum.removeText();
      currentEnum.insertText(currentEnum.getEnd() - 1, writer =>
        writer.newLineIfLastNot().indent(() => this.writeEnumBody(writer, definition))
      );
    }

    return file;
  }

  private createFile(fileName: string, definition: Enum) {
    return this.parentDirectory.createSourceFile(
      fileName,
      writer =>
        writer
          .writeLine(entityGeneratedHeader)
          .write("const enum ")
          .write(definition.name)
          .block(() => this.writeEnumBody(writer, definition))
          .write("export default ")
          .write(definition.name)
          .write(";")
          .newLineIfLastNot(),
      { overwrite: true }
    );
  }

  private writeEnumBody(writer: CodeBlockWriter, definition: Enum) {
    definition.items.forEach(x => writer.write(x).write(",").newLine());
    return writer;
  }
}
