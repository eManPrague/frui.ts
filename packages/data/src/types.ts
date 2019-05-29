import { SortingDirection } from "./sortingDirection";

export interface IPagingInfo {
  totalItems: number;
  offset: number;
  limit: number;
}

export interface IPagingFilter {
  offset: number;
  limit: number;
  sortColumn?: string;
  sortDirection?: SortingDirection;
}

export type PagedQueryResult<TEntity> = [TEntity[], IPagingInfo];
