export interface ApiError {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  error?: ApiError;
}
