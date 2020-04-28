// WARNING: This file has been generated. Do not edit it manually, your changes might get lost.
import { decorate, inject, injectable } from "inversify";
import LoginRepository from "./data/repositories/loginRepository";
import UserContext from "./models/userContext";
import AuthorizationService from "./services/authorizationService";
import InitializationService from "./services/initializationService";
import LoginViewModel from "./viewModels/loginViewModel";
import RootViewModel from "./viewModels/rootViewModel";
decorate(injectable(), AuthorizationService);
decorate(inject(UserContext) as any, AuthorizationService, 0);
decorate(inject(LoginRepository) as any, AuthorizationService, 1);
decorate(injectable(), InitializationService);
decorate(injectable(), LoginViewModel);
decorate(inject(AuthorizationService) as any, LoginViewModel, 0);
decorate(injectable(), RootViewModel);
decorate(injectable(), LoginRepository);
