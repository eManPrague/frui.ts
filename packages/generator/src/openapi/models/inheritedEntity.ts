import EntityProperty from "./entityProperty";
import ObjectEntity from "./objectEntity";
import TypeReference from "./typeReference";

export default class InheritedEntity extends ObjectEntity {
  constructor(name: string, public baseEntities: TypeReference[], properties: EntityProperty[]) {
    super(name, properties);
  }
}
