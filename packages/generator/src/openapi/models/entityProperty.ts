import NamedObject from "./namedObject";
import Restriction from "./restriction";
import TypeReference from "./typeReference";

export default class EntityProperty extends NamedObject {
  description?: string;
  example?: any;
  restrictions?: Map<Restriction, any>;
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

  get isRequired() {
    return this.restrictions?.has(Restriction.required);
  }
}
