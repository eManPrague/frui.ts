import { ClassDeclaration, SourceFile, Type, Directory, Project, ts } from "ts-morph";

export function toSingleArray<T>(item: T | undefined) {
  return item ? [item] : undefined;
}

export function importType(type: ClassDeclaration, target: SourceFile) {
  const file = type.getSourceFile();
  const path = target.getRelativePathAsModuleSpecifierTo(file);
  const identifier = type.getName();

  if (type.isDefaultExport()) {
    target.addImportDeclaration({ defaultImport: identifier, moduleSpecifier: path });
  } else {
    target.addImportDeclaration({ namedImports: toSingleArray(identifier), moduleSpecifier: path });
  }

  return identifier;
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
