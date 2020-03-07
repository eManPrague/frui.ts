import { decorate, injectable } from "inversify";
import RootViewModel from "./viewModels/rootViewModel";

decorate(injectable(), RootViewModel);
