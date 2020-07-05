import Restriction from "./restriction";
import TypeDefinition from "./typeDefinition";

export default class EntityProperty {
  constructor(public name: string, public type: TypeDefinition) {}
  description?: string;
  example?: any;
  restrictions?: Map<Restriction, any>;
  rawName?: string;

  addRestriction(name: Restriction, params: any) {
    if (!this.restrictions) {
      this.restrictions = new Map<Restriction, any>();
    }

    this.restrictions.set(name, params);
  }

  get isRequired() {
    return this.restrictions?.has(Restriction.required);
  }
}
