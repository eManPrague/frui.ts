import { ClassDeclaration, ConstructorDeclaration, MethodDeclaration, SourceFile, ArrowFunction } from "ts-morph";
import CodeBlock from "../codeBlock";
import { getImportDeclaration, unwrapType } from "../morphHelpers";
import ServiceRegistration from "./models/serviceRegistration";
import { LifeScope } from "./types";

export default class RegistrationsProcessor {
  private decorators: CodeBlock[];
  private registrations: CodeBlock[];

  constructor(private decoratorsFile: SourceFile, private registrationFile: SourceFile, private factoryName: string) {}

  process(services: ServiceRegistration[]) {
    this.decorators = [];
    this.registrations = [];

    services.forEach(x => this.processService(x));

    return {
      decorators: this.decorators,
      registrations: this.registrations,
    };
  }
  private processService(service: ServiceRegistration) {
    if (service.addDecorators) {
      this.decorateServiceInjectable(service.declaration);
    }

    if (service.scope !== "none") {
      this.registerService(service);
    }
  }

  private decorateServiceInjectable(declaration: ClassDeclaration) {
    const importStatement = getImportDeclaration(declaration, this.decoratorsFile);

    this.decorators.push({
      importStatements: [importStatement.declaration],
      statements: [`decorate(injectable(), ${importStatement.identifier});`],
    });
  }

  private registerService({ declaration, scope }: ServiceRegistration) {
    const factory = declaration.getStaticMethod(this.factoryName);
    if (factory) {
      this.registerServiceFactory(declaration, factory);
    } else {
      const construct = declaration.getConstructors()[0];
      this.registerConstructor(declaration, scope, construct);
    }
  }

  private registerServiceFactory(declaration: ClassDeclaration, factory: MethodDeclaration) {
    const importStatement = getImportDeclaration(declaration, this.registrationFile);
    const factoryIdentifier = `${importStatement.identifier}.${factory.getName()}`;

    this.registrations.push({
      importStatements: [importStatement.declaration],
      statements: [
        "container",
        `.bind<interfaces.Factory<${importStatement.identifier}>>(${factoryIdentifier})`,
        `.toFactory(${factoryIdentifier});`,
      ],
    });
  }

  private registerConstructor(declaration: ClassDeclaration, scope: LifeScope, construct: ConstructorDeclaration) {
    const importStatement = getImportDeclaration(declaration, this.registrationFile);
    const bindSuffix = scope === "singleton" ? ".inSingletonScope()" : "";

    this.registrations.push({
      importStatements: [importStatement.declaration],
      statements: [`container.bind<${importStatement.identifier}>(${importStatement.identifier}).toSelf()${bindSuffix};`],
    });

    if (construct) {
      this.decorateConstructorParameterInject(declaration, construct);
    }
  }

  private decorateConstructorParameterInject(parentClass: ClassDeclaration, construct: ConstructorDeclaration) {
    const classImportStatement = getImportDeclaration(parentClass, this.decoratorsFile);
    this.decorators.push({
      importStatements: [classImportStatement.declaration],
      statements: [],
    });

    const parameters = construct.getParameters();
    for (let i = 0; i < parameters.length; i++) {
      const parameter = parameters[i];
      const dependencyType = unwrapType(parameter.getType());

      if (dependencyType instanceof ClassDeclaration) {
        // instance
        const dependencyImportStatement = getImportDeclaration(dependencyType, this.decoratorsFile);
        this.decorators.push({
          importStatements: [dependencyImportStatement.declaration],
          statements: [
            `decorate(inject(${dependencyImportStatement.identifier}) as any, ${classImportStatement.identifier}, ${i});`,
          ],
        });
      } else if (dependencyType instanceof ArrowFunction) {
        // factory method
        const sourceType = unwrapType(dependencyType.getReturnType());
        if (sourceType instanceof ClassDeclaration) {
          const factoryMethod = this.factoryName && sourceType.getStaticMethod(this.factoryName);
          if (factoryMethod) {
            const sourceTypeImportStatement = getImportDeclaration(sourceType, this.decoratorsFile);
            this.decorators.push({
              importStatements: [sourceTypeImportStatement.declaration],
              statements: [
                `decorate(inject(${sourceTypeImportStatement.identifier}.${factoryMethod.getName()}) as any, ${
                  classImportStatement.identifier
                }, ${i});`,
              ],
            });
          }
        }
      }
    }
  }
}
