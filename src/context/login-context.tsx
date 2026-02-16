"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { CookieManager } from "@/lib/cookies"
import { Post } from "@/lib/api"

interface User {
  id?: string
  userName: string
  token: string
  refreshToken: string
  loginTime: number // This will now be the ACTUAL login time, not updated on reload
}

interface LoginContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: { token: string; refreshToken: string; userName: string; id?: string }) => void
  logout: () => void
  checkAuthStatus: () => boolean
}

const LoginContext = createContext<LoginContextType | undefined>(undefined)

interface LoginProviderProps {
  children: ReactNode
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // Check authentication status
  const checkAuthStatus = useCallback((): boolean => {
    const tokenData = CookieManager.getSecureToken()

    if (tokenData && tokenData.isValid) {
      if (!user) {
        // Use the stored login time from cookie, not current time
        setUser({
          userName: tokenData.userName,
          token: tokenData.token,
          refreshToken: tokenData.refreshToken,
          loginTime: tokenData.loginTime, // This is the original login time
        })
      }
      return true
    } else {
      if (user) {
        setUser(null)
        CookieManager.clearAuthCookies()
      }
      return false
    }
  }, [user])

  // Login function - sets the ACTUAL login time
  const login = (userData: { token: string; refreshToken: string; userName: string; id?: string }) => {
    const actualLoginTime = Date.now() // Capture the EXACT moment of login

    const newUser: User = {
      id: userData.id,
      userName: userData.userName,
      token: userData.token,
      refreshToken: userData.refreshToken,
      loginTime: actualLoginTime, // Set the actual login time
    }

    setUser(newUser)

    // Set secure cookie with 24 hours expiry instead of 8 hours
    CookieManager.setSecureToken(
      userData.token,
      userData.refreshToken,
      userData.userName,
      actualLoginTime,
      1, // 24 hours instead of 0.33 (8 hours)
    )

    // Set additional session tracking for 24 hours
    CookieManager.setCookie("user_session", "active", {
      expires: 1, // 24 hours instead of 0.33
      secure: true,
      sameSite: "strict",
    })

    console.log("🔐 User logged in at:", new Date(actualLoginTime).toLocaleString())
  }

  // Logout function with proper server-side logout
  const logout = useCallback(async () => {
    try {
      // Get refresh token before clearing cookies
      const refreshToken = user?.refreshToken

      if (refreshToken) {
        console.log("Logging out with refresh token...")

        // Send logout request to server
        await Post({
          url: "/logout/",
          data: {
            refresh: refreshToken,
          },
        })

        console.log("Server logout successful")
      }
    } catch (error) {
      console.error("Server logout failed:", error)
      // Continue with client-side logout even if server logout fails
    } finally {
      // Clear client-side data
      setUser(null)
      CookieManager.clearAuthCookies()
      router.push("/login")
    }
  }, [user?.refreshToken, router])

  // Check auth on mount only - no periodic checks
  useEffect(() => {
    checkAuthStatus()
    setIsLoading(false)
  }, [checkAuthStatus])

  const value: LoginContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  }

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
}

export const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext)
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider")
  }
  return context
}
