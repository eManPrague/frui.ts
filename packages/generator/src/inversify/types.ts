import type { BaseParams } from "../generatorBase";

export interface IGeneratorParams extends BaseParams {
  decorators?: {
    output: string;
  };

  registry?: { output: string };
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type ServiceIdentifier = "$class" | "$interface" | string;
export type LifeScope = "none" | "singleton" | "transient";

export interface IConfig {
  factoryName?: string;
  rules?: {
    pattern: string;
    addDecorators?: boolean;
    scope: LifeScope;
  }[];
}
