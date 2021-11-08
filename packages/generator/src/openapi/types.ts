import type { BaseParams } from "../generatorBase";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGeneratorParams extends BaseParams {}

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
  | string // generated rule name
  | boolean // 'false' disables rule generation
  | {
      name?: string; // generated rule name
      filter?: string; // regex matched against the rule param
    };

export interface IConfig {
  api: string;
  observable?: ObservableConfig;
  enums?: "enum" | "string";
  dates?: "native" | "date-fns";
  validations?: Record<string, ValidationConfig>;

  entitiesPath: string;
  repositoriesPath: string;

  validation?: boolean;
  conversion?: boolean;

  templates: Record<string, string>;
}
