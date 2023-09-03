import NamedObject from "./namedObject";

export default class ExternalEntity extends NamedObject {
  constructor(
    name: string,
    public fullName: string
  ) {
    super(name);
  }
}
