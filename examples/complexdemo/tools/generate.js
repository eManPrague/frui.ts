const {
  Project,
  ArrowFunction,
  ClassDeclaration,
  FunctionDeclaration,
  ParameterDeclaration,
  SourceFile,
  Type,
} = require("ts-morph");

const FACTORY_METHOD_NAME = "Factory";

const fileNames = {
  decorators: "src/di.decorators.ts",
  registry: "src/di.registry.ts",
  views: "src/views/index.ts",
};

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

// DI services
console.log("Generating DI container configuration decorators...", fileNames.decorators);
console.log("Generating DI registry...", fileNames.registry);

const decoratorsFile = project.createSourceFile(fileNames.decorators, undefined, { overwrite: true });
decoratorsFile.addImportDeclaration({
  namedImports: "decorate, inject, injectable, multiInject",
  moduleSpecifier: "inversify",
});

const registryFile = project.createSourceFile(fileNames.registry, undefined, { overwrite: true });
registryFile.addImportDeclaration({
  namedImports: "Container, interfaces",
  moduleSpecifier: "inversify",
});
const registration = registryFile.addFunction({
  isDefaultExport: true,
  name: "registerServices",
  parameters: [{ name: "container", type: "Container" }],
});

const files = project.getSourceFiles();
for (const file of files) {
  const fileExports = file.getExportedDeclarations();

  for (const [exportName, declarations] of fileExports) {
    const declaration = declarations[0];
    if (declaration instanceof ClassDeclaration && !declaration.isAbstract()) {
      const className = declaration.getName();

      // TODO make this configurable
      if (className.endsWith("Service")) {
        markInjectable(declaration, decoratorsFile);
        registerService(declaration, decoratorsFile, registryFile, registration, "singleton");
      }

      if (className.endsWith("ViewModel")) {
        markInjectable(declaration, decoratorsFile);
        registerService(declaration, decoratorsFile, registryFile, registration);
      }

      if (className.endsWith("Repository")) {
        markInjectable(declaration, decoratorsFile);
      }
    }
  }
}

decoratorsFile.organizeImports();
decoratorsFile.saveSync();

registryFile.organizeImports();
registryFile.formatText();
registryFile.saveSync();

// views
console.log("Generating views registration...", fileNames.views);

const viewsFile = project.createSourceFile(fileNames.views, undefined, { overwrite: true });

for (const file of files) {
  const isViewRegistration = file
    .getImportDeclarations()
    .some(i => i.getNamedImports().some(n => n.getName() === "registerView"));

  if (isViewRegistration) {
    const path = viewsFile.getRelativePathAsModuleSpecifierTo(file);

    viewsFile.addImportDeclaration({
      moduleSpecifier: path,
    });
  }
}

console.log("Saving changes...");
viewsFile.organizeImports();
viewsFile.saveSync();

console.log("Done");

/**
 *
 * @param {ClassDeclaration} declaration
 * @param {SourceFile} decoratorsFile
 * @param {SourceFile} registrationFile
 * @param {FunctionDeclaration} registrationFunction
 */
function markInjectable(declaration, decoratorsFile) {
  const identifier = importType(declaration, decoratorsFile);
  decoratorsFile.addStatements([writer => writer.newLine(), `decorate(injectable(), ${identifier});`]);
}

/**
 *
 * @param {ClassDeclaration} declaration
 * @param {SourceFile} decoratorsFile
 * @param {SourceFile} registrationFile
 * @param {FunctionDeclaration} registrationFunction
 * @param {FunctionDeclaration} scope
 */
function registerService(declaration, decoratorsFile, registrationFile, registrationFunction, scope) {
  const bindSuffix = scope === "singleton" ? ".inSingletonScope()" : "";

  const factory = declaration.getStaticMethod(FACTORY_METHOD_NAME);
  const construct = declaration.getConstructors()[0];

  if (factory) {
    const identifier = importType(declaration, registrationFile);
    const factoryIdentifier = `${identifier}.${factory.getName()}`;
    registrationFunction.addStatements([
      writer => writer.newLine(),
      "container",
      `.bind<interfaces.Factory<${identifier}>>(${factoryIdentifier})`,
      `.toFactory(${factoryIdentifier});`,
    ]);
  } else if (construct) {
    const identifier = importType(declaration, registrationFile);
    registrationFunction.addStatements([
      writer => writer.newLine(),
      `container.bind<${identifier}>(${identifier}).toSelf()${bindSuffix};`,
    ]);

    const parameters = construct.getParameters();
    for (let i = 0; i < parameters.length; i++) {
      const param = parameters[i];
      const dependencyType = unwrapType(param.getType());

      if (dependencyType instanceof ClassDeclaration) {
        const dependencyIdentifier = importType(dependencyType, decoratorsFile);
        decoratorsFile.addStatements([`decorate(inject(${dependencyIdentifier}) as any, ${identifier}, ${i});`]);
      } else if (dependencyType instanceof ArrowFunction) {
        // factory
        const sourceType = unwrapType(dependencyType.getReturnType());
        const factoryMethod = sourceType.getStaticMethod(FACTORY_METHOD_NAME);
        if (factoryMethod) {
          const sourceTypeIdentifier = importType(sourceType, decoratorsFile);
          decoratorsFile.addStatements([
            `decorate(inject(${sourceTypeIdentifier}.${factoryMethod.getName()}) as any, ${identifier}, ${i});`,
          ]);
        }
      }
    }
  } else {
    // empty constructor
    const identifier = importType(declaration, registrationFile);
    registrationFunction.addStatements([
      writer => writer.newLine(),
      `container.bind<${identifier}>(${identifier}).toSelf()${bindSuffix};`,
    ]);
  }
}

/**
 *
 * @param {ClassDeclaration} type
 * @param {SourceFile} target
 */
function importType(type, target) {
  const file = type.getSourceFile();
  const path = target.getRelativePathAsModuleSpecifierTo(file);
  const identifier = type.getName();

  if (type.isDefaultExport()) {
    target.addImportDeclaration({ defaultImport: identifier, moduleSpecifier: path });
  } else {
    target.addImportDeclaration({ namedImports: [identifier], moduleSpecifier: path });
  }

  return identifier;
}

/**
 *
 * @param {Type} type
 */
function unwrapType(sourceType) {
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
