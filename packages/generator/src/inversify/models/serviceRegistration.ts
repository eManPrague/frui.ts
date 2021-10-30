import type { ClassDeclaration } from "ts-morph";
import type ServiceRule from "./serviceRule";

export default interface ServiceRegistration {
  declaration: ClassDeclaration;
  rule: ServiceRule;
}
