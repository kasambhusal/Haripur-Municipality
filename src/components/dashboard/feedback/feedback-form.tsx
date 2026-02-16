"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Post } from "@/lib/api";
import type { FeedbackFormData, ApiErrorResponse } from "@/types/feedback";

interface FeedbackData {
  name: string;
  phone_number: string; // Changed from phone to phone_number
  subject: string;
  address: string;
  message: string;
}

interface FormErrors {
  name?: string[];
  phone_number?: string[]; // Changed from phone to phone_number
  subject?: string[];
  address?: string[];
  message?: string[];
  captcha?: string[];
  non_field_errors?: string[];
}

const FeedbackForm = () => {
  const [formData, setFormData] = useState<FeedbackData>({
    name: "",
    phone_number: "", // Changed from phone to phone_number
    subject: "",
    address: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = ["Name is required"];
    }

    // Phone validation
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = ["Phone number is required"];
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrors.phone_number = ["Please enter a valid 10-digit phone number"];
    }

    if (!formData.subject.trim()) {
      newErrors.subject = ["Subject is required"];
    }

    if (!formData.address.trim()) {
      newErrors.address = ["Address is required"];
    }

    if (!formData.message.trim()) {
      newErrors.message = ["Message is required"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FeedbackData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone_number: "",
      subject: "",
      address: "",
      message: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submitData: FeedbackFormData = {
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        subject: formData.subject.trim(),
        address: formData.address.trim(),
        message: formData.message.trim(),
      };

      await Post({
        url: "/public/feedback/submit/",
        data: submitData,
      });

      // Reset form on successful submission
      resetForm();
      setSubmitStatus("success");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error: unknown) {
      console.error("Error submitting feedback:", error);

      // Handle API validation errors
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response: { data: ApiErrorResponse } };
        if (apiError.response?.data) {
          const apiErrors: FormErrors = {};
          Object.entries(apiError.response.data).forEach(([key, messages]) => {
            if (key in formData) {
              apiErrors[key as keyof FormErrors] = messages;
            } else if (key === "non_field_errors") {
              apiErrors.non_field_errors = messages;
            }
          });
          setErrors(apiErrors);
        }
      }

      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Name
        </label>
        <div className="mt-2">
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={errors.name ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Phone Number
        </label>
        <div className="mt-2">
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone_number} // Changed from phone to phone_number
            onChange={(e) => handleInputChange("phone_number", e.target.value)} // Changed from phone to phone_number
            className={
              errors.phone_number ? "border-red-500 focus:border-red-500" : "" // Changed from phone to phone_number
            }
          />
          {errors.phone_number && ( // Changed from phone to phone_number
            <p className="text-sm text-red-600">{errors.phone_number[0]}</p> // Access first error message
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Subject
        </label>
        <div className="mt-2">
          <Input
            id="subject"
            type="text"
            placeholder="Enter the subject"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            className={
              errors.subject ? "border-red-500 focus:border-red-500" : ""
            }
          />
          {errors.subject && (
            <p className="text-sm text-red-600">{errors.subject[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Address
        </label>
        <div className="mt-2">
          <Input
            id="address"
            type="text"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className={
              errors.address ? "border-red-500 focus:border-red-500" : ""
            }
          />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Message
        </label>
        <div className="mt-2">
          <Textarea
            id="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className={
              errors.message ? "border-red-500 focus:border-red-500" : ""
            }
          />
          {errors.message && (
            <p className="text-sm text-red-600">{errors.message[0]}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>

      {submitStatus === "success" && (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Feedback submitted successfully!
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to submit feedback. Please check the form for errors.
          </AlertDescription>
        </Alert>
      )}
      {errors.non_field_errors && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errors.non_field_errors[0]}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default FeedbackForm;
