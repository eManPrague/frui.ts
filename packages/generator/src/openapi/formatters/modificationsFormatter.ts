import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import type TypeReference from "../models/typeReference";
import type { IConfig } from "../types";

export default class ModificationsProvider {
  constructor(private config: Pick<IConfig, "optionalAsNullable">) {}

  format(item: TypeReference) {
    if (this.config.optionalAsNullable !== true) {
      return;
    }

    if (item.type instanceof ObjectEntity) {
      this.formatEntity(item.type);
    }
  }

  formatEntity(entity: ObjectEntity) {
    for (const property of entity.properties) {
      const readOnly = property.restrictions?.has(Restriction.required);
      if (!readOnly) {
        property.addRestriction(Restriction.nullable, true);
      }
    }
  }
}
