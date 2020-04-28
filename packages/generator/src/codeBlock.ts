import { WriterFunction, StatementStructures, OptionalKind, ImportDeclarationStructure } from "ts-morph";

export default interface CodeBlock {
  statements: string | WriterFunction | ReadonlyArray<string | WriterFunction | StatementStructures>;
  importStatements: OptionalKind<ImportDeclarationStructure>[];
}
