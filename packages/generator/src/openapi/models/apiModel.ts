import Endpoint from "./endpoint";
import TypeReference from "./typeReference";

interface ApiModel {
  types: Map<string, TypeReference>;
  endpoints: Endpoint[];
}

export default ApiModel;
