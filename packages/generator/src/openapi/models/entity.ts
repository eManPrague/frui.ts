import EntityProperty from "./entityProperty";
import Restriction from "./restriction";

export default class Entity {
  constructor(public name: string, public properties: EntityProperty[]) {}

  addPropertyRestriction(propertyName: string, restriction: Restriction, params: any) {
    this.properties.find(x => x.name === propertyName)?.addRestriction(restriction, params);
  }
}
