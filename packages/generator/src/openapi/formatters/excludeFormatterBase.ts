import type { ExcludeConfig } from "../types";

type ExcludeList = string[] | false;

export default abstract class ExcludeFormatterBase {
  private globalExcludedProperties: string[];

  constructor(protected excludeConfig: ExcludeConfig | undefined) {
    this.globalExcludedProperties = excludeConfig?.properties?.exclude ?? [];
  }

  protected buildExcludeList(entityName: string): ExcludeList {
    const entityConfig = this.excludeConfig?.entities?.[entityName];

    if (entityConfig === false) {
      return false;
    }

    if (typeof entityConfig === "object" && entityConfig.exclude) {
      return this.globalExcludedProperties.concat(entityConfig.exclude);
    }

    return this.globalExcludedProperties;
  }
}
