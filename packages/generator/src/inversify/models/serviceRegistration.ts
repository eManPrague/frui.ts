import { ClassDeclaration } from "ts-morph";
import { LifeScope } from "../types";

export default interface ServiceRegistration {
  declaration: ClassDeclaration;
  scope: LifeScope;
  addDecorators: boolean;
}
