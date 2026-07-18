import axios from "axios";

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response
        ? `Request failed with status ${status}`
        : "Network error — the CDR API could not be reached";
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(error);
  },
);
