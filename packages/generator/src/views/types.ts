import type { BaseParams } from "../generatorBase";

export interface GeneratorParams extends BaseParams {
  output: string;
}

export interface IConfig {
  viewsPattern: string;
}
