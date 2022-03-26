import { camelCase } from "lodash";
import type { Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import type UnionEntity from "../models/unionEntity";

export default class UnionEntityWriter {
  constructor(
    private parentDirectory: Directory,
    private templates: Record<"unionEntity" | "unionEntityFile", Handlebars.TemplateDelegate>
  ) {}

  write(definition: UnionEntity) {
    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition) : this.createFile(fileName, definition);
  }

  private updateFile(file: SourceFile, definition: UnionEntity) {
    try {
      const currentEntity = file.getTypeAliasOrThrow(definition.name);
      currentEntity.replaceWithText(this.getEntityContent(definition));
      return file;
    } catch (error) {
      console.error(`Error while updating union type ${definition.name} in file ${file.getFilePath()}.`);
      throw error;
    }
  }

  private createFile(fileName: string, definition: UnionEntity) {
    const importedEntities = definition.entities.filter(x => x.isImportRequired).map(x => x.getTypeName());

    const result = this.templates.unionEntityFile({
      importedEntities,
      content: () => this.getEntityContent(definition),
      entity: definition,
    });

    return this.parentDirectory.createSourceFile(fileName, result, { overwrite: true });
  }

  private getEntityContent(definition: UnionEntity) {
    const context = {
      name: definition.name,
      subEntities: definition.entities.map(x => x.getTypeDeclaration()),
    };
    return this.templates.unionEntity(context);
  }
}
