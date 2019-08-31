export default class FetchError extends Error {
  constructor(public response: Response, public content?: any) {
    super();
  }
}
