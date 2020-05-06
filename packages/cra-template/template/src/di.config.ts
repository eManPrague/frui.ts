import { Container } from "inversify";
import "./di.decorators";
import registerServices from "./di.registry";

export default function createContainer() {
  const container = new Container({ skipBaseClassChecks: true });

  registerServices(container);

  return container;
}
