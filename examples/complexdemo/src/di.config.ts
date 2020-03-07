import { Container } from "inversify";
import "./di.decorators";
import registerServices from "./di.registry";

export default function createContainer() {
  const container = new Container({ skipBaseClassChecks: true });

  // register all components here with container.bind<>().to()...

  registerServices(container);

  return container;
}
