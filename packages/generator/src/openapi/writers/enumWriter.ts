﻿import { camelCase } from "lodash";
import type { Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import type Enum from "../models/enum";
export default class EnumWriter {
  constructor(
    private parentDirectory: Directory,
    private templates: Record<"enumEntity" | "enumEntityFile", Handlebars.TemplateDelegate>
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
    const currentEnum = file.getFunction(`build${definition.name}`) ?? file.getEnum(definition.name);
    if (!currentEnum) {
      throw new Error(
        `Could not find node to replace (enum ${definition.name}, or function build${
          definition.name
        }) in file ${file.getFilePath()}`
      );
    }
    currentEnum.replaceWithText(this.getEnumContent(definition));

    return file;
  }

  private createFile(fileName: string, definition: Enum) {
    const result = this.templates.enumEntityFile({
      content: () => this.getEnumContent(definition),
      enum: definition,
    });

    return this.parentDirectory.createSourceFile(fileName, result, { overwrite: true });
  }

  private getEnumContent(definition: Enum) {
    return this.templates.enumEntity(definition);
  }
}
