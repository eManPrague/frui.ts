import camelCase from "lodash/camelCase";
import { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
import UnionEntity from "../models/unionEntity";
export default class UnionEntityWriter {
  constructor(private parentDirectory: Directory) {}

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
      const currentEnum = file.getTypeAliasOrThrow(definition.name);
      currentEnum.replaceWithText(writer => this.writeTypeAlias(writer, definition));
    } catch (error) {
      console.error(`Error while updating union type ${definition.name} in file ${file.getFilePath()}.`);
      throw error;
    }

    return file;
  }

  private createFile(fileName: string, definition: UnionEntity) {
    const requiredImports = definition.entities.filter(x => typeof x.type === "object").map(x => x.getTypeName());

    return this.parentDirectory.createSourceFile(
      fileName,
      writer => {
        for (const statement of requiredImports) {
          writer.writeLine(`import ${statement} from "./${camelCase(statement)}";`);
        }
        writer.conditionalBlankLine(!!requiredImports.length);

        writer.writeLine(entityGeneratedHeader);
        this.writeTypeAlias(writer, definition);
        writer.newLineIfLastNot();
        writer.writeLine(`export default ${definition.name};`);
      },
      { overwrite: true }
    );
  }

  private writeTypeAlias(writer: CodeBlockWriter, definition: UnionEntity) {
    const names = definition.entities.map(x => x.getTypeDeclaration());
    writer.write(`type ${definition.name} = ${names.join(" | ")};`);
  }
}
