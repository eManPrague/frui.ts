export default interface TypeDefinition {
  name: string;
  isEntity?: boolean;
  isArray?: boolean;

  innerTypes?: TypeDefinition[];
  enumValues?: string[];
  format?: string;
}
