import AliasEntity from "./aliasEntity";
import Entity from "./entity";
import Enum from "./enum";

export default class TypeReference {
  constructor(public type?: Entity | Enum | string) {}

  getTypeName(): string | undefined {
    if (typeof this.type === "string") {
      return this.type;
    }

    if (this.type instanceof AliasEntity) {
      return this.type.referencedEntity.getTypeName();
    }

    return this.type?.name;
  }

  getTypeDeclaration() {
    const name = this.getTypeName();
    if (name && this.type instanceof AliasEntity && this.type.isArray) {
      return `${name}[]`;
    }

    return name;
  }
}
