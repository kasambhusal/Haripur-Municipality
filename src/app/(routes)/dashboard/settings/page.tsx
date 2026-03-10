"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, AlertCircle, Settings, User, Save } from "lucide-react";
import { useLogin } from "@/context/login-context";
import { Patch, Get } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/jwt-utils";
import { getApiHeadersWithAuth } from "@/lib/api-headers";

interface UserProfileResponse {
  id: number;
  user_groups_name: string;
  last_login: string | null;
  is_superuser: boolean;
  email: string;
  first_name: string;
  last_name: string;
  start_date: string;
  is_staff: boolean;
  is_active: boolean;
  gender: number | null;
  birth_date: string | null;
  address: string;
  mobile_no: string;
  photo: string | null;
}

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  birth_date: string;
  address: string;
  mobile_no: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  birth_date?: string;
  address?: string;
  mobile_no?: string;
  general?: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      detail?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

const genderOptions = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "3", label: "Other" },
];

export default function SettingsPage() {
  const { user } = useLogin();
  const [formData, setFormData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    birth_date: "",
    address: "",
    mobile_no: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);

        // Extract user ID from JWT token
        if (!user?.token) {
          throw new Error("No authentication token found");
        }

        const userIdFromToken = getUserIdFromToken(user.token);
        if (!userIdFromToken) {
          throw new Error("Could not extract user ID from token");
        }

        setUserId(userIdFromToken.toString());

        console.log("Fetching user profile for ID:", userIdFromToken);

        // Get user profile using the extracted ID
        const response: UserProfileResponse = (await Get({
          url: `/user/users/${userIdFromToken}/`,
        })) as UserProfileResponse;

        console.log("User profile response:", response);

        if (response) {
          setFormData({
            first_name: response.first_name || "",
            last_name: response.last_name || "",
            email: response.email || "",
            gender: response.gender?.toString() || "",
            birth_date: response.birth_date || "",
            address: response.address || "",
            mobile_no: response.mobile_no || "",
          });
        }
      } catch (error: unknown) {
        console.error("Failed to load user profile:", error);

        // Try to extract user ID even if profile fetch fails
        if (user?.token) {
          const userIdFromToken = getUserIdFromToken(user.token);
          if (userIdFromToken) {
            setUserId(userIdFromToken.toString());
          }
        }

        // Handle different types of errors with proper typing
        const apiError = error as ApiErrorResponse;
        let errorMessage =
          "Failed to load profile data. You can still update your information below.";

        if (apiError.response?.data?.detail) {
          errorMessage = apiError.response.data.detail;
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.response?.status === 403) {
          errorMessage =
            "You do not have permission to view this profile data.";
        } else if (apiError.response?.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }

        setErrors({
          general: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      loadUserProfile();
    } else {
      setIsLoading(false);
      setErrors({ general: "Authentication required. Please log in again." });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation (required, email format)
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // First name validation (maxLength: 50)
    if (formData.first_name && formData.first_name.length > 50) {
      newErrors.first_name = "First name must be less than 50 characters";
    }

    // Last name validation (maxLength: 50)
    if (formData.last_name && formData.last_name.length > 50) {
      newErrors.last_name = "Last name must be less than 50 characters";
    }

    // Address validation (maxLength: 100)
    if (formData.address && formData.address.length > 100) {
      newErrors.address = "Address must be less than 100 characters";
    }

    // Mobile number validation (maxLength: 10)
    if (formData.mobile_no && formData.mobile_no.length > 10) {
      newErrors.mobile_no = "Mobile number must be maximum 10 characters";
    } else if (formData.mobile_no && !/^\d+$/.test(formData.mobile_no)) {
      newErrors.mobile_no = "Mobile number should contain only digits";
    }

    // Birth date validation
    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birth_date = "Birth date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    if (!userId) {
      setErrors({ general: "User ID not found. Please try logging in again." });
      return;
    }

    if (!user?.token) {
      setErrors({
        general: "Authentication token not found. Please log in again.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    try {
      const updateData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        gender: formData.gender ? Number.parseInt(formData.gender) : undefined,
        birth_date: formData.birth_date || null,
        address: formData.address.trim(),
        mobile_no: formData.mobile_no.trim(),
      };

      // Remove empty fields
      Object.keys(updateData).forEach((key) => {
        if (
          updateData[key as keyof typeof updateData] === "" ||
          updateData[key as keyof typeof updateData] === undefined
        ) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      // Use Patch with proper authentication headers
      await Patch({
        url: `/user/update_profile/`,
        data: updateData,
        config: {
          headers: getApiHeadersWithAuth(), // This includes the Authorization header
        },
      });

      setSubmitStatus("success");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);

      const apiError = error as ApiErrorResponse;
      let errorMessage = "Failed to update profile. Please try again.";

      // Handle specific API error responses with proper typing
      if (apiError.response?.data?.detail) {
        errorMessage = apiError.response.data.detail;
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.response?.status === 403) {
        errorMessage = "You do not have permission to update this profile.";
      } else if (apiError.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
      } else if (apiError.response?.status === 404) {
        errorMessage = "Profile not found. Please contact support.";
      } else if (apiError.response?.status === 400) {
        errorMessage = "Invalid data provided. Please check your inputs.";
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setErrors({ general: errorMessage });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Settings className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Settings className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Update Your Profile
          </CardTitle>
          <p className="text-sm text-gray-600">
            Update your personal information and account details.
          </p>
          {userId && <p className="text-xs text-gray-500">User ID: {userId}</p>}
        </CardHeader>

        <CardContent className="p-6">
          {submitStatus === "success" && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your profile has been updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {errors.general && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Error:</strong> {errors.general}
                {errors.general.includes("Authentication") && (
                  <div className="mt-2 text-sm">
                    <p>This could be due to:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Expired authentication token</li>
                      <li>Missing authorization headers</li>
                      <li>Session timeout</li>
                    </ul>
                    <p className="mt-2">
                      Please try logging out and logging back in.
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  className={errors.first_name ? "border-red-500" : ""}
                  maxLength={50}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  className={errors.last_name ? "border-red-500" : ""}
                  maxLength={50}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Gender and Birth Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger
                    className={errors.gender ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_date" className="text-sm font-medium">
                  Birth Date
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) =>
                    handleInputChange("birth_date", e.target.value)
                  }
                  className={errors.birth_date ? "border-red-500" : ""}
                />
                {errors.birth_date && (
                  <p className="text-sm text-red-600">{errors.birth_date}</p>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobile_no" className="text-sm font-medium">
                Mobile Number
              </Label>
              <Input
                id="mobile_no"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.mobile_no}
                onChange={(e) => handleInputChange("mobile_no", e.target.value)}
                className={errors.mobile_no ? "border-red-500" : ""}
                maxLength={10}
              />
              {errors.mobile_no && (
                <p className="text-sm text-red-600">{errors.mobile_no}</p>
              )}
              <p className="text-xs text-gray-500">Maximum 10 digits</p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`min-h-[80px] resize-none ${
                  errors.address ? "border-red-500" : ""
                }`}
                maxLength={100}
              />
              <div className="flex justify-between items-center">
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.address.length}/100 characters
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !userId || !user?.token}
                className="bg-[#002c58] hover:bg-[#003d73] px-8 py-2 min-w-[120px]"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
