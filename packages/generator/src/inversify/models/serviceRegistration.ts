import { ClassDeclaration } from "ts-morph";
import ServiceRule from "./serviceRule";

export default interface ServiceRegistration {
  declaration: ClassDeclaration;
  rule: ServiceRule;
}
