import { camelCase } from "lodash-es";
import type { ClassDeclaration, ImportDeclarationStructure, OptionalKind, SourceFile, Type } from "ts-morph";

export function toSingleArray<T>(item: T | undefined) {
  return item ? [item] : undefined;
}

export function importType(type: ClassDeclaration, target: SourceFile) {
  const declaration = getImportDeclaration(type, target);
  target.addImportDeclaration(declaration.declaration);
  return declaration.identifier;
}

export function getImportDeclaration(
  type: ClassDeclaration,
  target: SourceFile
): { identifier: string; declaration: OptionalKind<ImportDeclarationStructure> } {
  const file = type.getSourceFile();
  const path = target.getRelativePathAsModuleSpecifierTo(file);

  if (type.isDefaultExport()) {
    const identifier = camelCase(path);
    const declaration = { defaultImport: identifier, moduleSpecifier: path };
    return { identifier, declaration };
  } else {
    const identifier = camelCase(path) + (type.getName() ?? "");
    const declaration = { namedImports: [{ name: type.getNameOrThrow(), alias: identifier }], moduleSpecifier: path };
    return { identifier, declaration };
  }
}

export function unwrapType(sourceType: Type) {
  let symbol = sourceType.getSymbol() ?? sourceType.getAliasSymbol();

  if (sourceType.isUnion()) {
    const unionTypes = sourceType.getUnionTypes();
    for (const type of unionTypes) {
      symbol = type.getSymbol() ?? type.getAliasSymbol();
      if (symbol) {
        break;
      }
    }
  }

  return symbol && (symbol.getValueDeclaration() || symbol.getDeclarations()[0]);
}
