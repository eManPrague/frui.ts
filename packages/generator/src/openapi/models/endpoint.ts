import type EntityProperty from "./entityProperty";
import NamedObject from "./namedObject";
import type TypeReference from "./typeReference";

export default class Endpoint extends NamedObject {
  repository: string;
  method: string;
  path: string;

  description?: string;

  pathParams: EntityProperty[];
  queryParam?: TypeReference;
  requestBody?: BodyType;
  responses?: Record<string, BodyType | undefined>;

  constructor(name: string) {
    super(name);
  }
}

interface BodyType {
  contentType: string;
  typeReference: TypeReference;
}
