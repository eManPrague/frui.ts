import { SourceFile, OptionalKind, ImportDeclarationStructure } from "ts-morph";
import CodeBlock from "../codeBlock";

export default class ViewsProcessor {
  constructor(private targetFile: SourceFile) {}
  process(files: SourceFile[]): CodeBlock {
    const paths = files.map(file => this.targetFile.getRelativePathAsModuleSpecifierTo(file));
    const importStatements: OptionalKind<ImportDeclarationStructure>[] = paths.map(x => ({
      moduleSpecifier: x,
    }));

    return {
      importStatements,
      statements: [],
    };
  }
}
