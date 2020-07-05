import camelCase from "lodash/camelCase";
import { pascalCase } from "../../helpers";
import Entity from "../models/entity";
import Enum from "../models/enum";
import ObjectEntity from "../models/objectEntity";

export default class NameFormatter {
  formatEnums(items: Enum[]) {
    for (const item of items) {
      fixName(pascalCase, item);
    }
  }

  formatEntities(items: Entity[]) {
    for (const entity of items) {
      fixName(pascalCase, entity);

      if (entity instanceof ObjectEntity) {
        this.formatObjectEntity(entity);
      }
    }
  }

  formatObjectEntity(item: ObjectEntity) {
    for (const property of item.properties) {
      fixName(camelCase, property);
    }
  }
}

function fixName(projection: (name: string) => string, item: { name: string; rawName?: string }) {
  const fixedName = projection(item.name);
  if (fixedName !== item.name) {
    item.rawName = item.name;
    item.name = fixedName;
  }
}
