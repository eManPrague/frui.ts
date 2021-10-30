import AliasEntity from "../models/aliasEntity";
import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import type TypeReference from "../models/typeReference";

export default class ValidationsFormatter {
  format(item: TypeReference) {
    if (item.type instanceof ObjectEntity) {
      this.formatEntity(item.type);
    }
  }

  formatEntity(entity: ObjectEntity) {
    for (const property of entity.properties) {
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
    }
  }
}
