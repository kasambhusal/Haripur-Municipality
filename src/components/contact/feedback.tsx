"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Shield, RefreshCw } from "lucide-react";
import { Post } from "@/lib/api";
import { useNotifications } from "@/app/providers/notification-provider";

interface FeedbackData {
  name: string;
  phone_number: string;
  subject: string;
  address: string;
  message: string;
}

interface FormErrors {
  name?: string[];
  phone_number?: string[];
  subject?: string[];
  address?: string[];
  message?: string[];
  captcha?: string[];
  non_field_errors?: string[];
}

interface MathCaptcha {
  question: string;
  answer: number;
  operation: "addition" | "subtraction";
}

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackData>({
    name: "",
    phone_number: "",
    subject: "",
    address: "",
    message: "",
  });
  const { showSuccess, showError } = useNotifications();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [mathCaptcha, setMathCaptcha] = useState<MathCaptcha>({
    question: "",
    answer: 0,
    operation: "addition",
  });
  const [captchaInput, setCaptchaInput] = useState("");

  // Generate random math problem
  const generateMathCaptcha = (): MathCaptcha => {
    const operations = ["addition", "subtraction"] as const;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1: number, num2: number, answer: number, question: string;

    if (operation === "addition") {
      num1 = Math.floor(Math.random() * 20) + 1; // 1-20
      num2 = Math.floor(Math.random() * 20) + 1; // 1-20
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else {
      // For subtraction, ensure positive result
      num1 = Math.floor(Math.random() * 30) + 10; // 10-39
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 to (num1-1)
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
    }

    return { question, answer, operation };
  };

  // Initialize math captcha on component mount
  useEffect(() => {
    setMathCaptcha(generateMathCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setMathCaptcha(generateMathCaptcha());
    setCaptchaInput("");
    if (errors.captcha) {
      setErrors((prev) => ({
        ...prev,
        captcha: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = ["Name is required"];
    } else if (formData.name.trim().length < 2) {
      newErrors.name = ["Name must be at least 2 characters"];
    }

    // Phone validation
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = ["Phone number is required"];
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrors.phone_number = ["Please enter a valid 10-digit phone number"];
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = ["Subject is required"];
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = ["Subject must be at least 3 characters"];
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = ["Address is required"];
    } else if (formData.address.trim().length < 5) {
      newErrors.address = ["Address must be at least 5 characters"];
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = ["Message is required"];
    } else if (formData.message.trim().length < 10) {
      newErrors.message = ["Message must be at least 10 characters"];
    } else if (formData.message.trim().length > 500) {
      newErrors.message = ["Message must be less than 500 characters"];
    }

    // Math CAPTCHA validation
    if (!captchaInput.trim()) {
      newErrors.captcha = [
        "Please solve the math problem to verify you're human",
      ];
    } else {
      const userAnswer = Number.parseInt(captchaInput.trim());
      if (isNaN(userAnswer)) {
        newErrors.captcha = ["Please enter a valid number"];
      } else if (userAnswer !== mathCaptcha.answer) {
        newErrors.captcha = ["Incorrect answer. Please try again."];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FeedbackData, value: string) => {
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

  const handleCaptchaChange = (value: string) => {
    setCaptchaInput(value);

    // Clear captcha error when user starts typing
    if (errors.captcha) {
      setErrors((prev) => ({
        ...prev,
        captcha: undefined,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone_number: "",
      subject: "",
      address: "",
      message: "",
    });
    setCaptchaInput("");
    setErrors({});
    setMathCaptcha(generateMathCaptcha());
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
      const submitData = {
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        subject: formData.subject.trim(),
        address: formData.address.trim(),
        message: formData.message.trim(),
      };

      const response = await Post({
        url: "/public/feedback/submit/",
        data: submitData,
      });
      showSuccess("Feedback Send!", (response as { message: string }).message);
      // Reset form on successful submission
      resetForm();
      setSubmitStatus("success");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error: unknown) {
      console.error("Error submitting feedback:", error);
      showError("Feedback Error!", "Something went wrong, please try later!");

      // Handle API validation errors
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response: { data: FormErrors } };
        if (apiError.response?.data) {
          setErrors(apiError.response.data);
        }
      } else {
        setErrors({
          non_field_errors: ["Failed to submit feedback. Please try again."],
        });
      }

      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg p-0">
          <CardHeader
            className="bg-[#002c58] text-white rounded-t- py-3"
            style={{ borderRadius: "8px 8px 0 0" }}
          >
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Shield className="h-6 w-6 mr-2" />
              प्रतिक्रिया फारम
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6">
            {submitStatus === "success" && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for your feedback! Your message has been submitted
                  successfully and verified for security.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === "error" && Object.keys(errors).length > 0 && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Please fix the errors below before submitting.
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

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm font-medium">
                    पुरा नाम *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="आफ्नो पुरा नाम लाख्नुहोस"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={
                      errors.name ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-sm font-medium">
                    फोन नम्बर *
                  </Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="आफ्नो फोन नम्बर लाख्नुहोस"
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    className={
                      errors.phone_number
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-red-600">
                      {errors.phone_number[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                  बिषय *
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="यो प्रतिक्रिया के बारे हो?"
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

              <div className="space-y-1">
                <Label htmlFor="address" className="text-sm font-medium">
                  ठेगाना *
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="आफ्नो ठेगाना लाख्नुहोस"
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

              <div className="space-y-1">
                <Label htmlFor="message" className="text-sm font-medium">
                  सन्देश *
                </Label>
                <Textarea
                  id="message"
                  placeholder="कृपया यहाँ आफ्नो विस्तृत प्रतिक्रिया साझा गर्नुहोस्।"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`min-h-[120px] resize-none ${
                    errors.message ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                <div className="flex justify-between items-center">
                  {errors.message && (
                    <p className="text-sm text-red-600">{errors.message[0]}</p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.message.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Math CAPTCHA Section */}
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Human Verification *
                </Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Please solve this simple math problem:
                      </p>
                      <div className="bg-white border-2 border-[#002c58] rounded-lg p-4 inline-block">
                        <span className="text-2xl font-bold text-[#002c58] font-mono">
                          {mathCaptcha.question}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={refreshCaptcha}
                      className="flex items-center"
                      title="Generate new problem"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="w-32">
                      <Input
                        type="number"
                        placeholder="Your answer"
                        value={captchaInput}
                        onChange={(e) => handleCaptchaChange(e.target.value)}
                        className={`text-center text-lg font-semibold ${
                          errors.captcha
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                  {errors.captcha && (
                    <p className="text-sm text-red-600 text-center mt-2">
                      {errors.captcha[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end py-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white px-8 py-2 min-w-[120px] bg-[#002c58] hover:bg-[#003d73]"
                >
                  {isSubmitting
                    ? "प्रतिक्रिया पठाउँदै..."
                    : "प्रतिक्रिया पठाउनुहोस्"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
