import Entity from "./entity";
import Enum from "./enum";

export default class TypeReference {
  constructor(public type?: Entity | Enum | string) {}

  getTypeName() {
    return typeof this.type === "string" ? this.type : this.type?.name;
  }
}
