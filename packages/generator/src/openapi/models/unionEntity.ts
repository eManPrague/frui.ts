import NamedObject from "./namedObject";
import type TypeReference from "./typeReference";

export default class UnionEntity extends NamedObject {
  constructor(name: string, public entities: TypeReference[]) {
    super(name);
  }
}
