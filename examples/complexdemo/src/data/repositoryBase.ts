import type { FetchError } from "@frui.ts/apiclient";
import type EventBus from "../services/eventBus";
import { GeneralEvents } from "../services/events";
import type { ApiResult, ErrorResponse } from "./apiModels";
import type BackendConnector from "./backendConnector";
import type DeserializingRequestBuilder from "./deserializingRequestBuilder";

export default abstract class RepositoryBase {
  protected apiFactory: () => DeserializingRequestBuilder;
  constructor(connector: BackendConnector, protected eventBus: EventBus) {
    this.apiFactory = connector.getRequestBuilder;
  }

  protected callApi<T>(action: (api: DeserializingRequestBuilder) => Promise<T>, notifyError = true): Promise<ApiResult<T>> {
    return action(this.apiFactory()).then(
      payload => ({ success: true, payload }),
      (error: FetchError<ErrorResponse>) => {
        const response = ensureErrorResponse(error);
        if (!response.type) {
          console.warn("Unexpected API error response structure.", response);
        }

        if (notifyError) {
          const errorMessage =
            response.type && response.title ? `${response.title} (${response.type})` : response.title || response.type;
          this.eventBus.publish(GeneralEvents.apiError({ response: response, errorMessage }));
        }

        return { success: false, payload: response };
      }
    );
  }
}

function ensureErrorResponse(error: FetchError<ErrorResponse>): ErrorResponse {
  return {
    requestId: error.content?.requestId ?? "INTERNAL",
    type: error.content?.type ?? error.name,
    title: error.content?.title ?? error.message,
  };
}
