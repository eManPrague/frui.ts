import { createEventDefinition } from "ts-bus";
import type { ErrorResponse } from "../data/apiModels";

const GeneralEvents = {
  apiError: createEventDefinition<{
    response: ErrorResponse;
    errorMessage: string;
  }>()("api.error"),
};

export { GeneralEvents };
