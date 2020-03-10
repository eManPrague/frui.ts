export default class LoginRepository {
  async login(userName: string, password: string) {
    // TODO make actual backend call to authorize the user
    return {
      email: userName,
      firstName: "John",
      lastName: "Johnattan",
      apiKey: "ABC123",
    };
  }
}
