import NamedObject from "./namedObject";

export default class Enum extends NamedObject {
  constructor(
    name: string,
    public items: string[]
  ) {
    super(name);
  }
}
