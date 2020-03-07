import { Container } from "inversify";
import RootViewModel from "./viewModels/rootViewModel";

export default function registerServices(container: Container) {
  container.bind<RootViewModel>(RootViewModel).toSelf();
}
