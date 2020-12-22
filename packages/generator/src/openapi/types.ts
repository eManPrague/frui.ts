import { BaseParams } from "../generatorBase";

export interface IGeneratorParams extends BaseParams {
  outputFolder: string;
  generateValidation: boolean;
  generateConversion: boolean;
}

interface HasExclude {
  exclude?: string[];
}

export type ObservableConfig =
  | boolean
  | {
      entities: Record<string, boolean | HasExclude>;
      properties?: HasExclude;
    };

export type ValidationConfig =
  | string
  | boolean
  | {
      name?: string;
      filter?: string;
    };

export interface IConfig {
  api: string;
  observable?: ObservableConfig;
  enums?: "enum" | "string";
  dates?: "native" | "date-fns";
  validations?: Record<string, ValidationConfig>;
}
