import { FunctionDeclaration, SourceFile } from "ts-morph";
import GeneratorBase from "../generatorBase";
import { createProgressBar } from "../progressBar";
import ExportsAnalyzer from "./exportsAnalyzer";
import ServiceRule from "./models/serviceRule";
import RegistrationsProcessor from "./registrationsProcessor";
import { IConfig, IGeneratorParams } from "./types";

export default class IversifyGenerator extends GeneratorBase<IGeneratorParams, IConfig> {
  private decoratorsFile: SourceFile;
  private registryFile: SourceFile;
  private registrationFunction: FunctionDeclaration;

  async run() {
    const progressBar = createProgressBar("Generating");
    progressBar.start(4, 0);

    const rules = this.parseRules();
    const services = new ExportsAnalyzer().analyze(this.project, rules);
    progressBar.increment();

    const processor = new RegistrationsProcessor(
      this.ensureDecoratorsFile(),
      this.ensureRegistryFile(),
      this.config.factoryName ?? "Factory"
    );

    const { decorators, registrations } = processor.process(services);
    progressBar.increment();

    if (decorators.length) {
      const importStatements = decorators.flatMap(x => x.importStatements);
      this.decoratorsFile.addImportDeclarations(importStatements);

      const codeStatements = decorators.flatMap(x => x.statements);
      this.decoratorsFile.addStatements(codeStatements);
      await this.saveFile(this.decoratorsFile);
    }
    progressBar.increment();

    if (registrations.length) {
      const importStatements = registrations.flatMap(x => x.importStatements);
      this.registryFile.addImportDeclarations(importStatements);

      const codeStatements = registrations.flatMap(x => x.statements);
      this.registrationFunction.addStatements(codeStatements);
      await this.saveFile(this.registryFile);
    }
    progressBar.increment();
    progressBar.stop();
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
      this.config.rules?.map(
        x =>
          ({
            ...x,
            regexPattern: new RegExp(x.pattern),
          } as ServiceRule)
      ) ?? []
    );
  }
}
