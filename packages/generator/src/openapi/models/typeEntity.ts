import TypeDefinition from "./typeDefinition";

export default class TypeEntity {
  rawName?: string;
  constructor(public name: string, public type: TypeDefinition) {}
}
