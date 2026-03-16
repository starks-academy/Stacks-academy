const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sa_token") : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    // Backend error may be wrapped in error.error.message or error.message
    const message =
      error?.error?.message ||
      (Array.isArray(error?.message) ? error.message[0] : error?.message) ||
      "API request failed";
    throw new Error(message);
  }

  const json = await res.json();

  // Unwrap the backend response envelope: { success: true, data: {...}, meta: {...} }
  // If the response has a `data` field and a `success` field, return just `data`.
  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return json.data as T;
  }

  // Otherwise return the whole response (e.g. for plain objects)
  return json as T;
}