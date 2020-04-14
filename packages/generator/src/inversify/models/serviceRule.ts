import { LifeScope } from "../types";

export default interface ServiceRule {
  regexPattern: RegExp;
  scope: LifeScope;
  addDecorators?: boolean;
}
