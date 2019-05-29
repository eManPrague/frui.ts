import { IPagingFilter, IPagingInfo } from "./types";

type onPageChangedHandler = (offset: number, limit: number) => void;

export interface IPagerProps {
  paging: IPagingInfo;
  filter?: IPagingFilter;
  onPageChanged?: onPageChangedHandler;
}

const defaultPageSize = 25;
export function pageChangedHandler(newPageNumber: number, filter: IPagingFilter, onPageChanged: onPageChangedHandler) {
  return () => handlePageChanged(newPageNumber, filter, onPageChanged);
}

export function handlePageChanged(newPageNumber: number, filter: IPagingFilter, onPageChanged: onPageChangedHandler) {
  const pageSize = (filter && filter.limit) || defaultPageSize;
  const offset = (newPageNumber - 1) * pageSize;

  if (filter) {
    filter.offset = offset;
    filter.limit = pageSize;
  }

  if (onPageChanged) {
    onPageChanged(offset, pageSize);
  }
}
