import GeneratorBase from "../generatorBase";
import FileGenerator from "./fileGenerator";
import ModelProcessor from "./modelProcessor";
import { IConfig, IGeneratorParams } from "./types";
import NameFormatter from "./formatters/nameFormatter";
import ObservableFormatter from "./formatters/observableFormatter";

export default class OpenApiGenerator extends GeneratorBase<IGeneratorParams, IConfig> {
  async run() {
    if (!this.config.api) {
      console.warn("Api definition is missing");
      return;
    }

    const modelProcessor = new ModelProcessor();
    const { entities, enums } = await modelProcessor.process(this.config.api);

    const nameFormatter = new NameFormatter();
    nameFormatter.formatEnums(enums);
    nameFormatter.formatEntities(entities);

    new ObservableFormatter().formatEntities(this.config.observable, entities);

    const fileGenerator = new FileGenerator(this.project, entities, enums);
    await fileGenerator.generate(this.params);
  }

  protected async getDefaultConfig() {
    const config = await import("./defaultConfig.json");
    return config.default as IConfig;
  }
}
