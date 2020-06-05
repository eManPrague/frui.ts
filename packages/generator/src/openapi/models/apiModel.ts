import Entity from "./entity";
import Enum from "./enum";

export default class ApiModel {
  constructor(public entities: Entity[], public enums: Enum[]) {}
}
