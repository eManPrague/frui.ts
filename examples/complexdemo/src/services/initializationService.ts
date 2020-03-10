export default class InitializationService {
  async preLoginInitialize() {
    // initialize logic that does not need logged in user here
  }

  async postLoginInitialize() {
    // initialize logic that requires logged in user here
  }
}
