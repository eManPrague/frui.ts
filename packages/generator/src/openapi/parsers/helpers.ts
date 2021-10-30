import type { OpenAPIV2, OpenAPIV3 } from "openapi-types";

export function isOpenAPIv2(api: any): api is OpenAPIV2.Document {
  return (api as OpenAPIV2.Document).swagger === "2.0";
}

export function isOpenAPIv3(api: any): api is OpenAPIV3.Document {
  return !!(api as Partial<OpenAPIV3.Document>).openapi?.startsWith("3");
}

export function isV3ReferenceObject(item: any): item is OpenAPIV3.ReferenceObject {
  return !!(item as OpenAPIV3.ReferenceObject).$ref;
}

export function isV2ReferenceObject(item: any): item is OpenAPIV2.ReferenceObject {
  return !!(item as OpenAPIV2.ReferenceObject).$ref;
}

export function isV3ArraySchemaObject(item: any): item is OpenAPIV3.ArraySchemaObject {
  return (item as Partial<OpenAPIV3.ArraySchemaObject>).type === "array";
}

export function isV3SchemaObject(item: any): item is OpenAPIV3.SchemaObject {
  return !!(item as OpenAPIV3.SchemaObject).type;
}

export function isV2SchemaObject(item: OpenAPIV2.Schema): item is OpenAPIV2.SchemaObject {
  return !(item as OpenAPIV2.SchemaObject).$ref;
}
