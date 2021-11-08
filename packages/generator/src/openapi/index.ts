import GeneratorBase from "../generatorBase";
import FileGenerator from "./fileGenerator";
import NameFormatter from "./formatters/nameFormatter";
import ObservableFormatter from "./formatters/observableFormatter";
import ValidationsFormatter from "./formatters/validationsFormatter";
import ModelProcessor from "./modelProcessor";
import type { IConfig, IGeneratorParams } from "./types";

export default class OpenApiGenerator extends GeneratorBase<IGeneratorParams, IConfig> {
  async run() {
    if (!this.config.api) {
      console.warn("Api definition is missing");
      return;
    }

    const modelProcessor = new ModelProcessor();
    const { types, endpoints } = await modelProcessor.process(this.config.api);

    const nameFormatter = new NameFormatter();
    const observableFormatter = new ObservableFormatter(this.config.observable);
    const validationsFormatter = new ValidationsFormatter();
    types.forEach(x => {
      nameFormatter.formatNames(x);
      observableFormatter.format(x);
      validationsFormatter.format(x);
    });

    const generator = new FileGenerator(this.project, this.params, this.config);
    await generator.generateEntities(Array.from(types.values()));
    await generator.generateRepositories(endpoints);
  }

  protected async getDefaultConfig() {
    const config = (await import("./defaultConfig.json")) as { default: IConfig };
    return config.default;
  }
}
