export default class FetchError<TContent = any> extends Error {
  handled = false;

  constructor(public response: Response, public content?: TContent) {
    super(response.statusText);
  }
}
