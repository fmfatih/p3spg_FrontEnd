export interface BaseResponse<T> {
  data: T;
  errorCode: null | string;
  isSuccess: boolean;
  message: string;
  requestId: string;
}

export interface PagingResponse<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  orderBy: string
  orderByDesc: boolean;
  result: T;
}


export interface BasePagingResponse<T> extends BaseResponse<PagingResponse<T>> {}