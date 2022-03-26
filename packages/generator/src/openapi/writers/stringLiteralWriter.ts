import { camelCase } from "lodash";
import type { Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import type Enum from "../models/enum";

export default class StringLiteralWriter {
  constructor(
    private parentDirectory: Directory,
    private templates: Record<"stringLiteralEntity" | "stringLiteralEntityFile", Handlebars.TemplateDelegate>
  ) {}

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
    currentEnum.replaceWithText(this.getEnumContent(definition));

    return file;
  }

  private createFile(fileName: string, definition: Enum) {
    const result = this.templates.stringLiteralEntityFile({
      content: () => this.getEnumContent(definition),
      enum: definition,
    });

    return this.parentDirectory.createSourceFile(fileName, result, { overwrite: true });
  }

  private getEnumContent(definition: Enum) {
    return this.templates.stringLiteralEntity(definition);
  }
}
