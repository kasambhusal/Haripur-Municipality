interface JWTPayload {
  user_id: number;
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    const parsedPayload: JWTPayload = JSON.parse(decodedPayload);

    return parsedPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): number | null => {
  const payload = decodeJWT(token);
  return payload?.user_id || null;
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};
