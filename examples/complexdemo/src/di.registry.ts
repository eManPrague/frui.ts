import { Container } from "inversify";
import AuthorizationService from "./services/authorizationService";
import InitializationService from "./services/initializationService";
import LoginViewModel from "./viewModels/loginViewModel";
import RootViewModel from "./viewModels/rootViewModel";

export default function registerServices(container: Container) {
  container.bind<AuthorizationService>(AuthorizationService).toSelf().inSingletonScope();

  container.bind<InitializationService>(InitializationService).toSelf().inSingletonScope();

  container.bind<LoginViewModel>(LoginViewModel).toSelf();

  container.bind<RootViewModel>(RootViewModel).toSelf();
}
