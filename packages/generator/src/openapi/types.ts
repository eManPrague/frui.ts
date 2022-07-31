import type { BaseParams } from "../generatorBase";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGeneratorParams extends BaseParams {}

interface HasExclude {
  exclude?: string[];
  include?: string[];
}

export type ExcludeConfig = {
  entities?: Record<string, boolean | HasExclude>;
  properties?: HasExclude;
};

export type ObservableConfig = boolean | ExcludeConfig;

export type ValidationRuleConfig =
  | string // generated rule name
  | boolean // 'false' disables rule generation
  | {
      name?: string; // generated rule name
      filter?: string; // regex matched against the rule param
    };

export type ValidationsConfig =
  | boolean
  | (ExcludeConfig & {
      rules?: Record<string, ValidationRuleConfig>;
    });

export interface IConfig {
  api: string;
  observable?: ObservableConfig;
  enums?: "enum" | "string";
  dates?: "native" | "date-fns";
  validations?: ValidationsConfig;

  entitiesPath: string;
  repositoriesPath: string;

  conversion?: boolean;

  endpointUrlPrefix?: string;
  templates: Record<string, string>;
  templatesFolder?: string;

  aliases?: Record<string, string>;
  optionalAsNullable?: boolean;
}

export interface IApiParserConfig {
  endpointUrlPrefix?: string;
}
