import type { SortingDirection } from "./sortingDirection";

export interface IPagingInfo {
  readonly totalItems: number;
  readonly offset: number;
  readonly limit: number;
}

export interface IPagingFilter {
  offset: number;
  limit: number;
  sorting?: { column: string; direction: SortingDirection }[];
}

export type PagedQueryResult<TEntity> = [TEntity[], IPagingInfo];
