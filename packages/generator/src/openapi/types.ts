import { BaseParams } from "../generatorBase";

export interface IGeneratorParams extends BaseParams {
  outputFolder: string;
  generateValidation: boolean;
  generateConversion: boolean;
}

export interface IConfig {
  api: string;
}
