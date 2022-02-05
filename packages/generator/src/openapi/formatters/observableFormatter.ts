import ObjectEntity from "../models/objectEntity";
import Restriction from "../models/restriction";
import type TypeReference from "../models/typeReference";
import type { ObservableConfig } from "../types";
import ExcludeFormatterBase from "./excludeFormatterBase";

export default class ObservableFormatter extends ExcludeFormatterBase {
  static OBSERVABLE = Symbol("observable");

  constructor(private config: ObservableConfig | undefined) {
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
      const readOnly = property.restrictions?.has(Restriction.readOnly);
      if (!excluded && !readOnly) {
        property.addTag(ObservableFormatter.OBSERVABLE, true);
      }
    }
  }
}
