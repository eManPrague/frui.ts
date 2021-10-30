import type { LifeScope, ServiceIdentifier } from "../types";

export default interface ServiceRule {
  regexPattern: RegExp;
  identifier?: ServiceIdentifier;
  scope: LifeScope;
  addDecorators?: boolean;
  registerAutoFactory?: boolean;
}
