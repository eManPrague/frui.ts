import camelCase from "lodash/camelCase";
import type { CodeBlockWriter, Directory, SourceFile } from "ts-morph";
import GeneratorBase from "../../generatorBase";
import { entityGeneratedHeader } from "../../messages.json";
import type AliasEntity from "../models/aliasEntity";
import type Entity from "../models/entity";
import type Enum from "../models/enum";
export default class AliasEntityWriter {
  constructor(private parentDirectory: Directory) {}

  write(definition: AliasEntity) {
    if (typeof definition.referencedEntity.type !== "object") {
      return;
    }

    const fileName = `${camelCase(definition.name)}.ts`;
    if (!GeneratorBase.canOverwiteFile(this.parentDirectory, fileName)) {
      return undefined;
    }

    const file = this.parentDirectory.getSourceFile(fileName);
    return file ? this.updateFile(file, definition) : this.createFile(fileName, definition);
  }

  private updateFile(file: SourceFile, definition: AliasEntity) {
    try {
      const currentEnum = file.getTypeAliasOrThrow(definition.name);
      currentEnum.replaceWithText(writer => this.writeTypeAlias(writer, definition));
    } catch (error) {
      console.error(`Error while updating alias type ${definition.name} in file ${file.getFilePath()}.`);
      throw error;
    }

    return file;
  }

  private createFile(fileName: string, definition: AliasEntity) {
    const referencedType = definition.referencedEntity.type as Entity | Enum;
    const requiredImport = referencedType.name;

    return this.parentDirectory.createSourceFile(
      fileName,
      writer => {
        if (requiredImport) {
          writer.writeLine(`import ${requiredImport} from "./${camelCase(requiredImport)}";`);
          writer.blankLine();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        writer.writeLine(entityGeneratedHeader);
        this.writeTypeAlias(writer, definition);
        writer.newLineIfLastNot();
        writer.writeLine(`export default ${definition.name};`);
      },
      { overwrite: true }
    );
  }

  private writeTypeAlias(writer: CodeBlockWriter, definition: AliasEntity) {
    const referencedType = definition.referencedEntity.type as Entity | Enum;
    writer.write(`type ${definition.name} = ${referencedType.name}${definition.isArray ? "[]" : ""};`);
  }
}
