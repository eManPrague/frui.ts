import GeneratorBase from "../generatorBase";
import defaultConfig from "./defaultConfig.json";
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
    const { types, endpoints } = await modelProcessor.process(this.config.api, this.config);

    const nameFormatter = new NameFormatter();
    const observableFormatter = new ObservableFormatter(this.config.observable);

    // merge configuration from observable as well
    const validationConfig =
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      this.config.validation && Object.assign({}, this.config.observable || undefined, this.config.validation);
    const validationsFormatter = new ValidationsFormatter(validationConfig);

    types.forEach(x => {
      nameFormatter.formatNames(x);
      observableFormatter.format(x);
      validationsFormatter.format(x);
    });

    const generator = new FileGenerator(this.project, this.params, this.config);
    await generator.generateEntities(Array.from(types.values()));
    await generator.generateRepositories(endpoints);
  }

  protected getDefaultConfig() {
    return Promise.resolve(defaultConfig as IConfig);
  }
}
