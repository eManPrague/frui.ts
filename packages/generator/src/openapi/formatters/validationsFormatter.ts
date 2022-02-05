import AliasEntity from "../models/aliasEntity";
import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import type TypeReference from "../models/typeReference";
import type { ValidationsConfig } from "../types";
import ExcludeFormatterBase from "./excludeFormatterBase";

export default class ValidationsFormatter extends ExcludeFormatterBase {
  constructor(private config: ValidationsConfig | undefined) {
    super(typeof config === "object" ? config : undefined);
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
    const excludeList = this.buildExcludeList(entity.name);
    if (excludeList === false) {
      return;
    }

    for (const property of entity.properties) {
      const excluded = excludeList.includes(property.name);
      if (excluded) {
        continue;
      }

      const isPropertyArray = property.type.type instanceof AliasEntity && property.type.type.isArray;
      if (!isPropertyArray) {
        switch (property.type.getTypeName()) {
          case "number":
            property.addRestriction(Restriction.number, true);
            break;
          case "Date":
            property.addRestriction(Restriction.date, true);
            break;
        }
      }

      const nullableRestriction = property.restrictions?.get(Restriction.nullable);
      if (nullableRestriction === false && !property.restrictions?.has(Restriction.required)) {
        property.addRestriction(Restriction.required, true);
      }

      property.validations = property.restrictions;
    }
  }
}
