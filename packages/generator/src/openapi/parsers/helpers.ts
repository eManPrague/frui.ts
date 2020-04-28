import { OpenAPIV2, OpenAPIV3 } from "openapi-types";

export function isOpenAPIv2(api: any): api is OpenAPIV2.Document {
  return (api as OpenAPIV2.Document).swagger === "2.0";
}

export function isOpenAPIv3(api: any): api is OpenAPIV3.Document {
  return (api as OpenAPIV3.Document).openapi?.startsWith("3");
}

export function isReferenceObject(item: any): item is OpenAPIV3.ReferenceObject {
  return !!(item as OpenAPIV3.ReferenceObject).$ref;
}

export function isArraySchemaObject(item: any): item is OpenAPIV3.ArraySchemaObject {
  return (item as OpenAPIV3.ArraySchemaObject).type === "array";
}

export function isSchemaObject(item: any): item is OpenAPIV3.SchemaObject {
  return !!(item as OpenAPIV3.SchemaObject).type;
}
