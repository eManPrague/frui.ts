import AliasEntity from "./aliasEntity";
import type Entity from "./entity";
import type Enum from "./enum";

export default class TypeReference {
  constructor(public type?: Entity | Enum | string) {}

  getTypeName(): string {
    if (typeof this.type === "string") {
      return this.type;
    }

    if (this.type instanceof AliasEntity) {
      return this.type.referencedEntity.getTypeName();
    }

    return this.type?.name ?? "ERR_UnsetTypeReference";
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
