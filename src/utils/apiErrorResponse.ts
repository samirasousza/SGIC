export interface ApiErrorResponse {
  detail: string;
  instance: string;
  status: number;
  title: string;
  timestamp: string;
  errors?: Record<string, string>;
}
