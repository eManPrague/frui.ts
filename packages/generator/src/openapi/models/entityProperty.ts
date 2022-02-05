import NamedObject from "./namedObject";
import type Restriction from "./restriction";
import type TypeReference from "./typeReference";

export default class EntityProperty extends NamedObject {
  description?: string;
  example?: string;
  restrictions?: Map<Restriction, unknown>;
  validations?: Map<Restriction, unknown>;
  tags?: Map<symbol, any>;

  constructor(name: string, public type: TypeReference) {
    super(name);
  }

  addRestriction(name: Restriction, params: any) {
    if (!this.restrictions) {
      this.restrictions = new Map<Restriction, any>();
    }

    this.restrictions.set(name, params);
  }

  addTag(name: symbol, params: any) {
    if (!this.tags) {
      this.tags = new Map<symbol, any>();
    }

    this.tags.set(name, params);
  }
}
