import type { ConstructorDeclaration, MethodDeclaration, Node, SourceFile } from "ts-morph";
import { ArrowFunction, ClassDeclaration, FunctionTypeNode, InterfaceDeclaration } from "ts-morph";
import type CodeBlock from "../codeBlock";
import { getImportDeclaration, unwrapType } from "../morphHelpers";
import type ServiceRegistration from "./models/serviceRegistration";
import type ServiceRule from "./models/serviceRule";

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
    if (service.rule.addDecorators) {
      this.decorateServiceInjectable(service.declaration);
    }

    if (service.rule.scope !== "none") {
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

  private registerService({ declaration, rule }: ServiceRegistration) {
    const factory = declaration.getStaticMethod(this.factoryName);
    if (factory) {
      this.registerServiceFactory(declaration, rule, factory);
    } else {
      const construct = getConstructor(declaration);
      this.registerConstructor(declaration, rule, construct);
    }
  }

  private registerServiceFactory(declaration: ClassDeclaration, rule: ServiceRule, factory: MethodDeclaration) {
    const importStatement = getImportDeclaration(declaration, this.registrationFile);
    const factoryPath = `${importStatement.identifier}.${factory.getName()}`;
    const serviceIdentifier = rule.identifier === undefined || rule.identifier === "$class" ? factoryPath : rule.identifier;

    this.registrations.push({
      importStatements: [importStatement.declaration],
      statements: [
        "container",
        `.bind<interfaces.Factory<${importStatement.identifier}>>(${serviceIdentifier})`,
        `.toFactory(${factoryPath});`,
      ],
    });
  }

  private registerConstructor(declaration: ClassDeclaration, rule: ServiceRule, construct: ConstructorDeclaration | undefined) {
    const importStatement = getImportDeclaration(declaration, this.registrationFile);

    let serviceIdentifier: string;
    let bindType: string;
    switch (rule.identifier) {
      case undefined:
      case "$class":
        serviceIdentifier = importStatement.identifier;
        bindType = "toSelf()";
        break;
      case "$interface": {
        const impl = declaration.getImplements()[0];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        serviceIdentifier = impl ? `"${impl.getText()}"` : "NoInterfaceImplemented";
        bindType = `to(${importStatement.identifier})`;
        break;
      }
      default:
        serviceIdentifier = `"${rule.identifier}"`;
        bindType = `to(${importStatement.identifier})`;
        break;
    }

    if (rule.scope === "singleton") {
      bindType += ".inSingletonScope()";
    }

    this.registrations.push({
      importStatements: [importStatement.declaration],
      statements: [`container.bind<${importStatement.identifier}>(${serviceIdentifier}).${bindType};`],
    });

    if (rule.registerAutoFactory) {
      this.registrations.push({
        importStatements: [],
        statements: [`container.bind("Factory<${declaration.getName() ?? ""}>").toAutoFactory(${serviceIdentifier});`],
      });
    }

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
      let parameterType = parameter.getType();
      let isMultiInject = false;

      if (parameterType.isArray()) {
        parameterType = parameterType.getArrayElementTypeOrThrow();
        isMultiInject = true;
      }

      const dependencyType = unwrapType(parameterType);
      if (dependencyType) {
        const decorator = this.getConstructorParameterDecorator(
          classImportStatement.identifier,
          i,
          dependencyType,
          isMultiInject
        );
        if (decorator) {
          this.decorators.push(decorator);
        }
      }
    }
  }

  private getConstructorParameterDecorator(
    parentClassIdentifier: string,
    parameterIndex: number,
    dependencyType: Node,
    isMultiInject: boolean
  ): CodeBlock | undefined {
    const injectDecorator = isMultiInject ? "multiInject" : "inject";

    if (dependencyType instanceof ClassDeclaration) {
      // instance
      const dependencyImportStatement = getImportDeclaration(dependencyType, this.decoratorsFile);
      return {
        importStatements: [dependencyImportStatement.declaration],
        statements: [
          `decorate(${injectDecorator}(${dependencyImportStatement.identifier}) as any, ${parentClassIdentifier}, ${parameterIndex});`,
        ],
      };
    }

    if (dependencyType instanceof InterfaceDeclaration) {
      return {
        importStatements: [],
        statements: [
          `decorate(${injectDecorator}("${dependencyType.getName()}") as any, ${parentClassIdentifier}, ${parameterIndex});`,
        ],
      };
    }

    // default factory method
    if (dependencyType instanceof FunctionTypeNode) {
      const sourceType = unwrapType(dependencyType.getReturnType());
      if (sourceType instanceof ClassDeclaration || sourceType instanceof InterfaceDeclaration) {
        return {
          importStatements: [],
          statements: [
            `decorate(${injectDecorator}("Factory<${
              sourceType.getName() ?? ""
            }>") as any, ${parentClassIdentifier}, ${parameterIndex});`,
          ],
        };
      }
    }

    if (dependencyType instanceof ArrowFunction) {
      // custom factory method
      const sourceType = unwrapType(dependencyType.getReturnType());
      if (sourceType instanceof ClassDeclaration) {
        const factoryMethod = this.factoryName && sourceType.getStaticMethod(this.factoryName);
        if (factoryMethod) {
          const sourceTypeImportStatement = getImportDeclaration(sourceType, this.decoratorsFile);
          return {
            importStatements: [sourceTypeImportStatement.declaration],
            statements: [
              `decorate(${injectDecorator}(${
                sourceTypeImportStatement.identifier
              }.${factoryMethod.getName()}) as any, ${parentClassIdentifier}, ${parameterIndex});`,
            ],
          };
        }
      }
    }
  }
}

function getConstructor(declaration: ClassDeclaration): ConstructorDeclaration | undefined {
  const construct = declaration.getConstructors()[0];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (construct) {
    return construct;
  }

  const base = declaration.getBaseClass();
  return base ? getConstructor(base) : undefined;
}
