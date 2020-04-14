import {
  ArrowFunction,
  ClassDeclaration,
  ConstructorDeclaration,
  FunctionDeclaration,
  MethodDeclaration,
  SourceFile,
} from "ts-morph";
import GeneratorBase from "../generatorBase";
import { importType, unwrapType } from "../morphHelpers";
import { IConfig, IGeneratorParams, LifeScope } from "./types";

export default class IversifyGenerator extends GeneratorBase<IGeneratorParams, IConfig> {
  private decoratorsFile: SourceFile;
  private registryFile: SourceFile;
  private registrationFunction: FunctionDeclaration;

  // eslint-disable-next-line @typescript-eslint/tslint/config
  async run() {
    const rules = this.parseRules();

    this.forEachExport((declarations, key) => {
      const declaration = declarations[0];
      if (declaration instanceof ClassDeclaration && !declaration.isAbstract()) {
        const className = declaration.getName();

        if (className) {
          const matchingRule = rules.find(x => x.regex.test(className));

          if (matchingRule) {
            if (matchingRule.addDecorators && this.ensureDecoratorsFile()) {
              this.markInjectable(declaration);
            }

            if (matchingRule.scope && this.ensureRegistryFile()) {
              this.registerService(declaration, matchingRule.scope);
            }
          }
        }
      }
    });

    if (this.decoratorsFile) {
      await this.saveFile(this.decoratorsFile);
    }
    if (this.registryFile) {
      await this.saveFile(this.registryFile);
    }
  }

  private markInjectable(declaration: ClassDeclaration) {
    if (this.decoratorsFile) {
      const identifier = importType(declaration, this.decoratorsFile);
      this.decoratorsFile.addStatements([writer => writer.newLine(), `decorate(injectable(), ${identifier});`]);
    }
  }

  private registerService(declaration: ClassDeclaration, scope: LifeScope) {
    if (scope === "none") {
      return;
    }

    const factory = this.config.factoryName && declaration.getStaticMethod(this.config.factoryName);
    const construct = declaration.getConstructors()[0];

    if (factory) {
      this.registerServiceFactory(declaration, factory);
    } else if (construct) {
      this.registerServiceCustomConstructor(declaration, construct, scope);
    } else {
      this.registerServiceEmptyConstructor(declaration, scope);
    }
  }

  private registerServiceFactory(declaration: ClassDeclaration, factory: MethodDeclaration) {
    const identifier = importType(declaration, this.registryFile);
    const factoryIdentifier = `${identifier}.${factory.getName()}`;
    this.registrationFunction.addStatements([
      writer => writer.newLine(),
      "container",
      `.bind<interfaces.Factory<${identifier}>>(${factoryIdentifier})`,
      `.toFactory(${factoryIdentifier});`,
    ]);
  }

  private registerServiceEmptyConstructor(declaration: ClassDeclaration, scope: LifeScope) {
    const identifier = importType(declaration, this.registryFile);

    const bindSuffix = scope === "singleton" ? ".inSingletonScope()" : "";
    this.registrationFunction.addStatements([
      writer => writer.newLine(),
      `container.bind<${identifier}>(${identifier}).toSelf()${bindSuffix};`,
    ]);
  }

  private registerServiceCustomConstructor(declaration: ClassDeclaration, construct: ConstructorDeclaration, scope: LifeScope) {
    const identifier = importType(declaration, this.registryFile);
    if (identifier) {
      const bindSuffix = scope === "singleton" ? ".inSingletonScope()" : "";
      this.registrationFunction.addStatements([
        writer => writer.newLine(),
        `container.bind<${identifier}>(${identifier}).toSelf()${bindSuffix};`,
      ]);

      if (this.decoratorsFile) {
        this.registerConstructorParameters(identifier, construct);
      }
    }
  }

  private registerConstructorParameters(identifier: string, construct: ConstructorDeclaration) {
    const parameters = construct.getParameters();
    for (let i = 0; i < parameters.length; i++) {
      const param = parameters[i];
      const dependencyType = unwrapType(param.getType());

      if (dependencyType instanceof ClassDeclaration) {
        const dependencyIdentifier = importType(dependencyType, this.decoratorsFile);
        this.decoratorsFile.addStatements([`decorate(inject(${dependencyIdentifier}) as any, ${identifier}, ${i});`]);
      } else if (dependencyType instanceof ArrowFunction) {
        // factory
        const sourceType = unwrapType(dependencyType.getReturnType());
        if (sourceType instanceof ClassDeclaration) {
          const factoryMethod = this.config.factoryName && sourceType.getStaticMethod(this.config.factoryName);
          if (factoryMethod) {
            const sourceTypeIdentifier = importType(sourceType, this.decoratorsFile);
            this.decoratorsFile.addStatements([
              `decorate(inject(${sourceTypeIdentifier}.${factoryMethod.getName()}) as any, ${identifier}, ${i});`,
            ]);
          }
        }
      }
    }
  }

  protected async getDefaultConfig() {
    const config = await import("./defaultConfig.json");
    return config.default as IConfig;
  }

  private ensureDecoratorsFile() {
    if (!this.decoratorsFile && this.params.decorators?.output) {
      this.decoratorsFile = this.project.createSourceFile(this.params.decorators.output, undefined, { overwrite: true });
      this.decoratorsFile.addImportDeclaration({
        namedImports: ["decorate", "inject", "injectable", "multiInject"],
        moduleSpecifier: "inversify",
      });
    }
    return this.decoratorsFile;
  }

  private ensureRegistryFile() {
    if (!this.registryFile && this.params.registry?.output) {
      this.registryFile = this.project.createSourceFile(this.params.registry.output, undefined, { overwrite: true });
      this.registryFile.addImportDeclaration({
        namedImports: ["Container", "interfaces"],
        moduleSpecifier: "inversify",
      });

      this.registrationFunction = this.registryFile.addFunction({
        isDefaultExport: true,
        name: "registerServices",
        parameters: [{ name: "container", type: "Container" }],
      });
    }
    return this.registryFile;
  }

  private parseRules() {
    return (
      this.config.rules?.map(x => ({
        ...x,
        regex: new RegExp(x.pattern),
      })) ?? []
    );
  }
}
