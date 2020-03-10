import LoginRepository from "../data/repositories/loginRepository";
import CurrentUser from "../models/currentUser";
import UserContext from "../models/userContext";

export default class AuthorizationService {
  constructor(private userContext: UserContext, private repository: LoginRepository) {}

  async tryPersistedLogin() {
    // TODO try to refresh the persisted login credentials and return whether the user is logged in
    return false;
  }

  async login(userName: string, password: string, persistLogin: boolean) {
    const user = await this.repository.login(userName, password);

    if (user) {
      const userModel = new CurrentUser(user.email, user.firstName, user.lastName);
      this.userContext.setUser(userModel, user.apiKey);
      return true;
    } else {
      return false;
    }
  }
}
