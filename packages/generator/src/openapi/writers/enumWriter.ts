import camelCase from "lodash/camelCase";
import type { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { pascalCase } from "../../helpers";
import { entityGeneratedHeader } from "../../messages.json";
import type Enum from "../models/enum";
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
    const currentEnum = file.getEnumOrThrow(definition.name);
    currentEnum.replaceWithText(writer => this.writeEnum(writer, definition));

    return file;
  }

  private createFile(fileName: string, definition: Enum) {
    return this.parentDirectory.createSourceFile(
      fileName,
      writer => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        writer.writeLine(entityGeneratedHeader);
        this.writeEnum(writer, definition);
        writer.newLineIfLastNot();
        writer.writeLine(`export default ${definition.name};`);
      },
      { overwrite: true }
    );
  }

  private writeEnum(writer: CodeBlockWriter, definition: Enum) {
    writer.write(`enum ${definition.name}`);
    writer.block(() => {
      definition.items.forEach(item => writer.writeLine(`${pascalCase(item)} = "${item}",`));
    });
  }
}
