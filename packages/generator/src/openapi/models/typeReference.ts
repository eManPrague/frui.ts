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
    if (this.isArray) {
      return `${name}[]`;
    }

    return name;
  }

  get isArray() {
    return this.type instanceof AliasEntity && this.type.isArray;
  }

  get isImportRequired(): boolean {
    if (this.type instanceof AliasEntity) {
      return this.type.referencedEntity.isImportRequired;
    } else {
      return typeof this.type === "object";
    }
  }
}
