import type { IPagingFilter, IPagingInfo } from "./types";

type onPageChangedHandler = (offset: number, limit: number) => void;

export interface IPagerProps {
  paging: IPagingInfo;
  filter?: IPagingFilter;
  onPageChanged?: onPageChangedHandler;
}

const defaultPageSize = 25;

/** Assigns the provided paging values to the filter and calls the provided handler */
export function handlePagingChanged(offset: number, limit: number, filter?: IPagingFilter, onPageChanged?: onPageChangedHandler) {
  if (filter) {
    // shouldn't we use mobx's runInAction here?
    filter.offset = offset;
    filter.limit = limit;
  }

  if (onPageChanged) {
    onPageChanged(offset, limit);
  }
}

/** Calculates paging filter values for the new page, updates the filter, and calls the provided handler */
export function handlePageChanged(newPageNumber: number, filter?: IPagingFilter, onPageChanged?: onPageChangedHandler) {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const pageSize = filter?.limit || defaultPageSize;
  const offset = (newPageNumber - 1) * pageSize;

  handlePagingChanged(offset, pageSize, filter, onPageChanged);
}

export function pageChangedHandler(newPageNumber: number, filter: IPagingFilter, onPageChanged: onPageChangedHandler) {
  return () => handlePageChanged(newPageNumber, filter, onPageChanged);
}

/** Calculates paging filter values for the new page size, updates the filter, and calls the provided handler */
export function handlePageSizeChanged(newPageSize: number, filter?: IPagingFilter, onPageChanged?: onPageChangedHandler) {
  handlePagingChanged(0, newPageSize, filter, onPageChanged);
}
