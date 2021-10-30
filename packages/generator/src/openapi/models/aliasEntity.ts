import NamedObject from "./namedObject";
import type TypeReference from "./typeReference";

export default class AliasEntity extends NamedObject {
  constructor(name: string, public referencedEntity: TypeReference, public isArray = false) {
    super(name);
  }
}
