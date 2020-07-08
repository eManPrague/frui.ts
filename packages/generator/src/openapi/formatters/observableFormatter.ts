import { ObservableConfig } from "../types";
import Entity from "../models/entity";
import ObjectEntity from "../models/objectEntity";

type ExcludeList = string[] | undefined;

export default class ObservableFormatter {
  static OBSERVABLE = Symbol("observable");

  formatEntities(config: ObservableConfig | undefined, items: Entity[]) {
    if (!config) {
      return;
    }

    const globalExcludedProperties = typeof config === "object" ? config.properties?.exclude : undefined;

    for (const entity of items) {
      if (entity instanceof ObjectEntity) {
        this.formatEntity(config, globalExcludedProperties, entity);
      }
    }
  }

  formatEntity(config: ObservableConfig, globalExcludedProperties: ExcludeList, entity: ObjectEntity) {
    let excludedProperties: ExcludeList;

    if (typeof config === "object") {
      const entityConfig = config.entities[entity.name];

      if (entityConfig === false) {
        return;
      }

      if (typeof entityConfig === "object") {
        excludedProperties = entityConfig?.exclude;
      }
    }

    for (const property of entity.properties) {
      if (!isExcluded(excludedProperties, property.name) && !isExcluded(globalExcludedProperties, property.name)) {
        property.addTag(ObservableFormatter.OBSERVABLE, true);
      }
    }
  }
}

function isExcluded(list: ExcludeList, value: string) {
  return list && list.includes(value);
}
