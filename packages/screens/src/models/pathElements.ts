export interface PathElement<TParamsValue = string | undefined> {
  name: string;
  params?: Record<string, TParamsValue>;
}
