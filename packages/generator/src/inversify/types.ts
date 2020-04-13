import { BaseParams } from "../generatorBase";

export interface IGeneratorParams extends BaseParams {
  decorators?: {
    output: string;
  };

  registry?: { output: string };
}

export type Scope = "singleton" | "transient" | "none";

export interface IConfig {
  factoryName: string;
  rules: {
    pattern: string;
    injectable?: boolean;
    scope?: Scope;
  }[];
}
