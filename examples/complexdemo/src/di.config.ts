import { Container } from "inversify";
import "./di.decorators";
import registerServices from "./di.registry";
import UserContext from "./models/userContext";

export default function createContainer() {
  const container = new Container({ skipBaseClassChecks: true });

  const userContext = new UserContext();
  container.bind(UserContext).toConstantValue(userContext);

  registerServices(container);

  return container;
}
