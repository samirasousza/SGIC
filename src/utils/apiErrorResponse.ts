import axios from "axios";

export interface ApiErrorResponse {
  detail?: string;
  title?: string;
  errors?: Record<string, string>;
}

export function getApiError(error: unknown): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response?.data;

    if (response) {
      return {
        message: response.detail || response.title || "Ocorreu um erro.",
        fieldErrors: response.errors || {},
      };
    }
  }

  return {
    message: "Não foi possível realizar a operação. Tente novamente.",
    fieldErrors: {},
  };
}
