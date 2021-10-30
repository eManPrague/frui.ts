import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import type TypeReference from "../models/typeReference";
import type { ObservableConfig } from "../types";

type ExcludeList = string[] | undefined;

export default class ObservableFormatter {
  static OBSERVABLE = Symbol("observable");
  private globalExcludedProperties?: string[];

  constructor(private config: ObservableConfig | undefined) {
    this.globalExcludedProperties = typeof config === "object" ? config.properties?.exclude : undefined;
  }

  format(item: TypeReference) {
    if (!this.config) {
      return;
    }

    if (item.type instanceof ObjectEntity) {
      this.formatEntity(item.type);
    }
  }

  formatEntity(entity: ObjectEntity) {
    let excludedProperties: ExcludeList;

    if (typeof this.config === "object") {
      const entityConfig = this.config.entities[entity.name];

      if (entityConfig === false) {
        return;
      }

      if (typeof entityConfig === "object") {
        excludedProperties = entityConfig.exclude;
      }
    }

    for (const property of entity.properties) {
      const excluded = isExcluded(excludedProperties, property.name) || isExcluded(this.globalExcludedProperties, property.name);
      const readOnly = property.restrictions?.has(Restriction.readOnly);
      if (!excluded && !readOnly) {
        property.addTag(ObservableFormatter.OBSERVABLE, true);
      }
    }
  }
}

function isExcluded(list: ExcludeList, value: string): boolean {
  return list?.includes(value) === true;
}
