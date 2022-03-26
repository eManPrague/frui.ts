// WARNING: This file has been generated. Do not edit it manually, your changes might get lost.
import { decorate, injectable } from "inversify";
import repositoriesCategoryRepository from "./repositories/categoryRepository";
import repositoriesEnumerationsRepository from "./repositories/enumerationsRepository";
import repositoriesPaymentRepository from "./repositories/paymentRepository";
import repositoriesSessionRepository from "./repositories/sessionRepository";
import repositoriesUsersControllerRepository from "./repositories/usersControllerRepository";
decorate(injectable(), repositoriesCategoryRepository);
decorate(injectable(), repositoriesEnumerationsRepository);
decorate(injectable(), repositoriesPaymentRepository);
decorate(injectable(), repositoriesSessionRepository);
decorate(injectable(), repositoriesUsersControllerRepository);
