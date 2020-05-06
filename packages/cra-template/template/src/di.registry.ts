import { Container } from "inversify";
import DemoRepository from "./repositories/demoRepository";
import InitializationService from "./services/initializationService";
import DemoViewModel from "./viewModels/demo/demoViewModel";
import RootViewModel from "./viewModels/rootViewModel";

export default function registerServices(container: Container) {
  container.bind<DemoRepository>(DemoRepository).toSelf();
  container.bind<InitializationService>(InitializationService).toSelf().inSingletonScope();
  container.bind<RootViewModel>(RootViewModel).toSelf();
  container.bind<DemoViewModel>(DemoViewModel).toSelf();
}
