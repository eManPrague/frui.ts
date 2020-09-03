import EntityProperty from "./entityProperty";
import NamedObject from "./namedObject";
import Restriction from "./restriction";

export default class ObjectEntity extends NamedObject {
  constructor(name: string, public properties: EntityProperty[]) {
    super(name);
  }

  addPropertyRestriction(propertyName: string, restriction: Restriction, params: any) {
    this.properties.find(x => x.name === propertyName)?.addRestriction(restriction, params);
  }
}
