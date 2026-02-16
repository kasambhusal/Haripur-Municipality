interface CookieOptions {
  expires?: number; // Days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
}

export class CookieManager {
  // Set cookie with security options
  static setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    if (typeof window === "undefined") return;

    const {
      expires = 7, // Default 7 days
      path = "/",
      secure = process.env.NODE_ENV === "production",
      sameSite = "strict",
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (expires) {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    cookieString += `; path=${path}`;

    if (secure) {
      cookieString += "; secure";
    }

    cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  }

  // Get cookie value
  static getCookie(name: string): string | null {
    if (typeof window === "undefined") return null;

    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  // Delete cookie
  static deleteCookie(name: string, path = "/"): void {
    if (typeof window === "undefined") return;

    document.cookie = `${encodeURIComponent(
      name
    )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  }

  // Check if cookie exists and is valid
  static isValidCookie(name: string): boolean {
    const value = this.getCookie(name);
    return (
      value !== null &&
      value !== "null" &&
      value !== "undefined" &&
      value.trim() !== ""
    );
  }

  // Set secure token with encryption-like encoding and FIXED login time
  static setSecureToken(
    accessToken: string,
    refreshToken: string,
    userName: string,
    loginTime: number,
    expiryDays = 1
  ): void {
    const tokenData = {
      accessToken,
      refreshToken,
      userName,
      loginTime, // Store the actual login time passed from login function
      timestamp: Date.now(),
      expires: Date.now() + expiryDays * 24 * 60 * 60 * 1000,
    };

    // Base64 encode for basic obfuscation (in production, use proper encryption)
    const encodedData = btoa(JSON.stringify(tokenData));

    this.setCookie("auth_token", encodedData, {
      expires: expiryDays,
      secure: true,
      sameSite: "strict",
    });
  }

  // Get and validate secure token with FIXED login time
  static getSecureToken(): {
    token: string;
    refreshToken: string;
    userName: string;
    loginTime: number;
    isValid: boolean;
  } | null {
    const encodedData = this.getCookie("auth_token");

    if (!encodedData) {
      return null;
    }

    try {
      const tokenData = JSON.parse(atob(encodedData));
      const isValid = Date.now() < tokenData.expires;

      if (!isValid) {
        this.deleteCookie("auth_token");
        return null;
      }

      return {
        token: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        userName: tokenData.userName,
        loginTime: tokenData.loginTime, // Return the original login time
        isValid,
      };
    } catch (error) {
      console.error("Invalid token format:", error);
      this.deleteCookie("auth_token");
      return null;
    }
  }

  // Clear all authentication cookies
  static clearAuthCookies(): void {
    this.deleteCookie("auth_token");
    this.deleteCookie("user_session");
    this.deleteCookie("refresh_token");
  }
}
