import NamedObject from "./namedObject";
import TypeReference from "./typeReference";

export default class InheritedEntity extends NamedObject {
  constructor(name: string, public baseEntities: TypeReference[]) {
    super(name);
  }
}
