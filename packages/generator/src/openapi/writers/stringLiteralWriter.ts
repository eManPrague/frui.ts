import camelCase from "lodash/camelCase";
import type { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
import type Enum from "../models/enum";
export default class StringLiteralWriter {
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
    const currentEnum = file.getTypeAliasOrThrow(definition.name);
    currentEnum.replaceWithText(writer => this.writeTypeAlias(writer, definition));

    return file;
  }

  private createFile(fileName: string, definition: Enum) {
    return this.parentDirectory.createSourceFile(
      fileName,
      writer => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        writer.writeLine(entityGeneratedHeader);
        this.writeTypeAlias(writer, definition);
        writer.newLineIfLastNot();
        writer.writeLine(`export default ${definition.name};`);
      },
      { overwrite: true }
    );
  }

  private writeTypeAlias(writer: CodeBlockWriter, definition: Enum) {
    const items = definition.items.map(x => `"${x}"`).join(" | ");
    writer.write(`type ${definition.name} = ${items};`);
  }
}
