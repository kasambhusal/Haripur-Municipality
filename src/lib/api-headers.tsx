  import { CookieManager } from "@/lib/cookies";

  export const getApiHeaders = () => {
    const tokenData = CookieManager.getSecureToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (tokenData?.token) {
      headers["Authorization"] = `Bearer ${tokenData.token}`;
    }

    return headers;
  };

  export const getApiHeadersWithAuth = () => {
    return getApiHeaders();
  };

  // For multipart/form-data (file uploads)
  export const getMultipartHeaders = () => {
    const tokenData = CookieManager.getSecureToken();

    const headers: Record<string, string> = {};

    if (tokenData?.token) {
      headers["Authorization"] = `Bearer ${tokenData.token}`;
    }

    // Don't set Content-Type for multipart, let browser set it with boundary
    return headers;
  };
