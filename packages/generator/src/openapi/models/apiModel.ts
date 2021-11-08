import type Endpoint from "./endpoint";
import type TypeReference from "./typeReference";

interface ApiModel {
  types: Map<string, TypeReference>;
  endpoints: Endpoint[];
}

export default ApiModel;
