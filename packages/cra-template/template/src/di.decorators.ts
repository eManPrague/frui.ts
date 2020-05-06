import { decorate, inject, injectable } from "inversify";
import DemoRepository from "./repositories/demoRepository";
import InitializationService from "./services/initializationService";
import DemoViewModel from "./viewModels/demo/demoViewModel";
import RootViewModel from "./viewModels/rootViewModel";

decorate(injectable(), DemoRepository);
decorate(injectable(), InitializationService);
decorate(injectable(), RootViewModel);
decorate(inject(DemoViewModel) as any, RootViewModel, 0);
decorate(injectable(), DemoViewModel);
decorate(inject(DemoRepository) as any, DemoViewModel, 0);
