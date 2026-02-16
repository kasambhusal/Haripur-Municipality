"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Shield,
  UserCheck,
  Settings,
} from "lucide-react";
import { useLogin } from "@/context/login-context";
import { Get } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/jwt-utils";
import Link from "next/link";
import Image from "next/image";
import type { ErrorWithResponse } from "@/types/api";

interface UserProfileResponse {
  id: number;
  user_groups_name: string;
  last_login: string | null;
  is_superuser: boolean;
  email: string;
  user_name: string;
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

// Modern SVG Icons for Gender
const MaleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500">
    <path
      fill="currentColor"
      d="M9 9c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7zM9 9L4 4m0 0h3m-3 0v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FemaleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-500">
    <path
      fill="currentColor"
      d="M12 16c3.86 0 7-3.14 7-7s-3.14-7-7-7-7 3.14-7 7 3.14 7 7 7zm0 0v6m-3-3h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OtherIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-purple-500">
    <path
      fill="currentColor"
      d="M12 16c3.86 0 7-3.14 7-7s-3.14-7-7-7-7 3.14-7 7 3.14 7 7 7zm0 0v6m-3-3h6m-6-6L4 4m0 0h3m-3 0v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getGenderIcon = (gender: number | null) => {
  switch (gender) {
    case 1:
      return <MaleIcon />;
    case 2:
      return <FemaleIcon />;
    case 3:
      return <OtherIcon />;
    default:
      return <User className="w-6 h-6 text-gray-400" />;
  }
};

const getGenderText = (gender: number | null) => {
  switch (gender) {
    case 1:
      return "Male";
    case 2:
      return "Female";
    case 3:
      return "Other";
    default:
      return "Not specified";
  }
};

const getGenderColor = (gender: number | null) => {
  switch (gender) {
    case 1:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 2:
      return "bg-pink-100 text-pink-800 border-pink-200";
    case 3:
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function ProfilePage() {
  const { user } = useLogin();
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);

        if (!user?.token) {
          throw new Error("No authentication token found");
        }

        const userIdFromToken = getUserIdFromToken(user.token);
        if (!userIdFromToken) {
          throw new Error("Could not extract user ID from token");
        }

        const response = (await Get({
          url: `/user/users/${userIdFromToken}/`,
        })) as UserProfileResponse;

        setProfileData(response);
      } catch (error: unknown) {
        console.error("Failed to load profile:", error);
        const errorWithResponse = error as ErrorWithResponse;
        setError(
          errorWithResponse.response?.data?.detail ||
            errorWithResponse.message ||
            "Failed to load profile"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (
    firstName: string,
    lastName: string,
    userName: string
  ) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <User className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to Load Profile
            </h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Link href="/dashboard/settings">
          <Button className="bg-[#002c58] hover:bg-[#003d73]">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              {/* Profile Image */}
              <div className="relative mb-6">
                {profileData.photo ? (
                  <Image
                    src={
                      profileData.photo ||
                      "/placeholder.svg?height=128&width=128"
                    }
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-[#002c58] to-[#003d73] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {getInitials(
                      profileData.first_name,
                      profileData.last_name,
                      profileData.user_name
                    )}
                  </div>
                )}
              </div>
              {/* Name and Username */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {profileData.first_name || profileData.last_name
                    ? `${profileData.first_name} ${profileData.last_name}`.trim()
                    : profileData.user_name}
                </h2>
                <p className="text-gray-600">@{profileData.user_name}</p>
              </div>
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {profileData.is_active && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
                {profileData.is_staff && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Staff
                  </Badge>
                )}
                {profileData.is_superuser && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Settings className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              {/* User Group
              {profileData.user_groups_name && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Group:</span>{" "}
                  {profileData.user_groups_name}
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Email Address
                  </p>
                  <p className="text-sm text-gray-600 break-all">
                    {profileData.email || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Mobile Number
                  </p>
                  <p className="text-sm text-gray-600">
                    {profileData.mobile_no || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getGenderIcon(profileData.gender)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Gender</p>
                  <Badge className={getGenderColor(profileData.gender)}>
                    {getGenderText(profileData.gender)}
                  </Badge>
                </div>
              </div>

              {/* Birth Date */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Date of Birth
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(profileData.birth_date)}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3 md:col-span-2">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">
                    {profileData.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Member Since
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(profileData.start_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
