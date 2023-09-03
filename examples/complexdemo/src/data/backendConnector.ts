import { FetchApiConnector } from "@frui.ts/apiclient";
import { bound } from "@frui.ts/helpers";
import DeserializingRequestBuilder from "./deserializingRequestBuilder";
import { serializeEntity } from "./helpers";

export default class BackendConnector {
  constructor(
    private baseUrl: string,
    private apiKey: string
  ) {}

  @bound
  getRequestBuilder() {
    const apiConnector = new FetchApiConnector({ serializer: serializeEntity });

    const params: RequestInit = {
      credentials: "include",
    };

    return new DeserializingRequestBuilder(apiConnector, this.baseUrl, params);
  }

  @bound
  getRequestBuilderWithApiKey() {
    const apiConnector = new FetchApiConnector({ serializer: serializeEntity });

    const params: RequestInit = {
      headers: { Authorization: this.apiKey },
      credentials: "include",
    };

    return new DeserializingRequestBuilder(apiConnector, this.baseUrl, params);
  }
}
