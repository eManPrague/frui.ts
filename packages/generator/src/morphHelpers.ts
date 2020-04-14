import { ClassDeclaration, ImportDeclarationStructure, OptionalKind, SourceFile, Type } from "ts-morph";

export function toSingleArray<T>(item: T | undefined) {
  return item ? [item] : undefined;
}

export function importType(type: ClassDeclaration, target: SourceFile) {
  const declaration = getImportDeclaration(type, target);
  target.addImportDeclaration(declaration.declaration);
  return declaration.identifier;
}

export function getImportDeclaration(type: ClassDeclaration, target: SourceFile) {
  const file = type.getSourceFile();
  const path = target.getRelativePathAsModuleSpecifierTo(file);
  const identifier = type.getName();

  const declaration: OptionalKind<ImportDeclarationStructure> = type.isDefaultExport()
    ? { defaultImport: identifier, moduleSpecifier: path }
    : { namedImports: toSingleArray(identifier), moduleSpecifier: path };

  return { identifier, declaration };
}

export function unwrapType(sourceType: Type) {
  let symbol = sourceType.getSymbol() || sourceType.getAliasSymbol();

  if (sourceType.isUnion()) {
    const unionTypes = sourceType.getUnionTypes();
    for (const type of unionTypes) {
      symbol = type.getSymbol() || type.getAliasSymbol();
      if (symbol) {
        break;
      }
    }
  }

  return symbol && symbol.getValueDeclaration();
}
