const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public detail?: string;

  constructor(status: number, statusText: string, detail?: string) {
    super(`API error ${status}: ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.detail = detail;
  }
}

export const fetcher = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let detail: string | undefined;
    try {
      const body: unknown = await response.json();
      if (body && typeof body === 'object' && 'detail' in body) {
        const d = body.detail;
        if (typeof d === 'string') detail = d;
      }
    } catch {}
    throw new ApiError(response.status, response.statusText, detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
