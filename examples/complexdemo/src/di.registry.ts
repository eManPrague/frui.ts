// WARNING: This file has been generated. Do not edit it manually, your changes might get lost.
import { Container } from "inversify";
import repositoriesCategoryRepository from "./repositories/categoryRepository";
import repositoriesEnumerationsRepository from "./repositories/enumerationsRepository";
import repositoriesPaymentRepository from "./repositories/paymentRepository";
import repositoriesSessionRepository from "./repositories/sessionRepository";
import repositoriesUsersControllerRepository from "./repositories/usersControllerRepository";

export default function registerServices(container: Container) {
  container.bind<repositoriesCategoryRepository>(repositoriesCategoryRepository).toSelf();
  container.bind<repositoriesEnumerationsRepository>(repositoriesEnumerationsRepository).toSelf();
  container.bind<repositoriesPaymentRepository>(repositoriesPaymentRepository).toSelf();
  container.bind<repositoriesSessionRepository>(repositoriesSessionRepository).toSelf();
  container.bind<repositoriesUsersControllerRepository>(repositoriesUsersControllerRepository).toSelf();
}
