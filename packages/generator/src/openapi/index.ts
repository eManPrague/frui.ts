import GeneratorBase from "../generatorBase";
import FileGenerator from "./fileGenerator";
import NameFormatter from "./formatters/nameFormatter";
import ObservableFormatter from "./formatters/observableFormatter";
import ModelProcessor from "./modelProcessor";
import { IConfig, IGeneratorParams } from "./types";

export default class OpenApiGenerator extends GeneratorBase<IGeneratorParams, IConfig> {
  async run() {
    if (!this.config.api) {
      console.warn("Api definition is missing");
      return;
    }

    const modelProcessor = new ModelProcessor();
    const types = await modelProcessor.process(this.config.api);

    const nameFormatter = new NameFormatter();
    const observableFormatter = new ObservableFormatter(this.config.observable);
    types.forEach(x => {
      nameFormatter.formatNames(x);
      observableFormatter.format(x);
    });

    const generator = new FileGenerator(this.project, this.params, this.config);
    await generator.generate(Array.from(types.values()));
  }

  protected async getDefaultConfig() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const config = await import("./defaultConfig.json");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return config.default as IConfig;
  }
}
