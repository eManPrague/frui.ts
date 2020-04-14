import { BaseParams } from "../generatorBase";

export interface IGeneratorParams extends BaseParams {
  outputFolder: string;
}

export interface IConfig {
  api: string;
}
