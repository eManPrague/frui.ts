export interface ErrorResponse {
  requestId: string;
  type: string;
  title: string;
}

export interface PageMetadataResponse {
  pagination: {
    total: number;
    offset: number;
    limit: number;
  };
  sorting: unknown;
}

export type SuccessApiResult<T> = { success: true; payload: T };
export type ErrorApiResult = { success: false; payload: ErrorResponse };

export type ApiResult<T> = SuccessApiResult<T> | ErrorApiResult;

export interface PagedResult<T> {
  metadata: PageMetadataResponse;
  items: T[];
}
