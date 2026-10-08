const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  public status: number;
  public statusText: string;

  constructor(status: number, statusText: string) {
    super(`API error ${status}: ${statusText}`);
    this.status = status;
    this.statusText = statusText;

    this.name = 'ApiError';
  }
}

export const fetcher = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  return response.json() as Promise<T>;
};
