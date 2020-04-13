// WARNING: This file has been generated. Do not edit it manually, your changes might get lost.
import { Container } from "inversify";
import LoginRepository from "./data/repositories/loginRepository";
import AuthorizationService from "./services/authorizationService";
import InitializationService from "./services/initializationService";
import LoginViewModel from "./viewModels/loginViewModel";
import RootViewModel from "./viewModels/rootViewModel";

export default function registerServices(container: Container) {
  container.bind<AuthorizationService>(AuthorizationService).toSelf().inSingletonScope();

  container.bind<InitializationService>(InitializationService).toSelf().inSingletonScope();

  container.bind<LoginViewModel>(LoginViewModel).toSelf();

  container.bind<RootViewModel>(RootViewModel).toSelf();

  container.bind<LoginRepository>(LoginRepository).toSelf();
}
