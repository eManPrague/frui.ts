export default interface TypeDefinition {
  name: string;
  isEntity?: boolean;
  isArray?: boolean;
  isEnum?: boolean;

  definition?: string;
}
