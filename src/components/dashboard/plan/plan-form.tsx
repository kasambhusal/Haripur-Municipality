"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, FileText, Eye } from "lucide-react";
import type { Plan, PlanFormData } from "@/types/plan";
import {
  getPlanImageUrl,
  getPlanDocumentUrl,
  getFileNameFromUrl,
} from "@/utils/plan-helpers";
import Image from "next/image";

interface PlanFormProps {
  plan?: Plan;
  onSubmit: (data: PlanFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  removeImage?: () => void;
  removeDocument?: () => void;
}

export function PlanForm({
  plan,
  onSubmit,
  onCancel,
  isSubmitting,
  removeImage,
  removeDocument,
}: PlanFormProps) {
  const [formData, setFormData] = useState<PlanFormData>({
    title: "",
    description: "",
    progress_note: "",
    image: null,
    document: null,
    existing_image: null,
    existing_document: null,
    remove_image: false,
    remove_document: false,
  });
  const [errors, setErrors] = useState<Partial<PlanFormData>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when plan changes
  useEffect(() => {
    if (plan) {
      console.log("Initializing form with plan:", plan);
      const imageUrl = getPlanImageUrl(plan);
      const documentUrl = getPlanDocumentUrl(plan);

      console.log("Image URL:", imageUrl);
      console.log("Document URL:", documentUrl);

      setFormData({
        title: plan.title,
        description: plan.description,
        progress_note: plan.progress_note || "",
        image: null,
        document: null,
        existing_image: imageUrl,
        existing_document: documentUrl,
        remove_image: false,
        remove_document: false,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        progress_note: "",
        image: null,
        document: null,
        existing_image: null,
        existing_document: null,
        remove_image: false,
        remove_document: false,
      });
    }
  }, [plan]);

  // Generate image preview
  useEffect(() => {
    if (formData.image) {
      const preview = URL.createObjectURL(formData.image);
      setImagePreview(preview);

      // Cleanup
      return () => {
        URL.revokeObjectURL(preview);
      };
    } else {
      setImagePreview(null);
    }
  }, [formData.image]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PlanFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "योजनाको शीर्षक आवश्यक छ";
    } else if (formData.title.length > 200) {
      newErrors.title = "शीर्षक २०० अक्षरभन्दा बढी हुन सक्दैन";
    }

    if (!formData.description.trim()) {
      newErrors.description = "योजनाको विवरण आवश्यक छ";
    } else if (formData.description.length > 2000) {
      newErrors.description = "विवरण २००० अक्षरभन्दा बढी हुन सक्दैन";
    }

    if (formData.progress_note && formData.progress_note.length > 1000) {
      newErrors.progress_note = "प्रगति नोट १००० अक्षरभन्दा बढी हुन सक्दैन";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch {
      // Error handling is done in the parent component
    }
  };

  const handleInputChange = (field: keyof PlanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedImageTypes.includes(file.type.toLowerCase())) {
      alert("कृपया केवल JPG, JPEG, वा PNG छवि फाइल चयन गर्नुहोस्।");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("छवि फाइल ५ MB भन्दा सानो हुनुपर्छ।");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
      remove_image: false, // Reset remove flag when new image is selected
    }));

    // Reset file input
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.toLowerCase() !== "application/pdf") {
      alert("कृपया केवल PDF कागजात फाइल चयन गर्नुहोस्।");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("कागजात फाइल १० MB भन्दा सानो हुनुपर्छ।");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      document: file,
      remove_document: false, // Reset remove flag when new document is selected
    }));

    // Reset file input
    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  const removeNewImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
  };

  const removeNewDocument = () => {
    setFormData((prev) => ({
      ...prev,
      document: null,
    }));
  };

  const removeExistingImage = () => {
    setFormData((prev) => ({
      ...prev,
      existing_image: null,
      remove_image: true,
    }));
    if (removeImage) {
      removeImage();
    }
  };

  const removeExistingDocument = () => {
    setFormData((prev) => ({
      ...prev,
      existing_document: null,
      remove_document: true,
    }));
    if (removeDocument) {
      removeDocument();
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 ">
        {/* Title */}
        <div>
          <Label className="mb-2" htmlFor="title">
            योजनाको शीर्षक / Plan Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="योजनाको शीर्षक प्रविष्ट गर्नुहोस्"
            className={errors.title ? "border-red-500" : ""}
            maxLength={200}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label className="mb-2" htmlFor="description">
            योजनाको विवरण / Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="योजनाको विस्तृत विवरण प्रविष्ट गर्नुहोस्"
            rows={4}
            className={errors.description ? "border-red-500" : ""}
            maxLength={2000}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Progress Note */}
        <div>
          <Label className="mb-2" htmlFor="progress_note">
            प्रगति नोट / Progress Note
          </Label>
          <Textarea
            id="progress_note"
            value={formData.progress_note}
            onChange={(e) => handleInputChange("progress_note", e.target.value)}
            placeholder="योजनाको प्रगति सम्बन्धी जानकारी (वैकल्पिक)"
            rows={3}
            className={errors.progress_note ? "border-red-500" : ""}
            maxLength={1000}
          />
          {errors.progress_note && (
            <p className="text-sm text-red-500 mt-1">{errors.progress_note}</p>
          )}
        </div>

        {/* Image Section */}
        <div>
          <Label className="mb-2">छवि / Image (वैकल्पिक - एक मात्र)</Label>
          <div className="space-y-4">
            {/* Upload Button */}
            <div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                className="w-full sm:w-auto"
                disabled={!!formData.image || !!formData.existing_image}
              >
                <Upload className="h-4 w-4 mr-2" />
                छवि अपलोड गर्नुहोस्
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                केवल JPG, JPEG, PNG फाइल (अधिकतम ५MB)
              </p>
            </div>

            {/* Existing Image */}
            {formData.existing_image && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  अवस्थित छवि:
                </h4>
                <Card className="relative w-fit">
                  <CardContent className="p-2">
                    <Image
                      src={formData.existing_image || "/placeholder.svg"}
                      alt="Plan image"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeExistingImage}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* New Image Preview */}
            {imagePreview && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  नयाँ छवि:
                </h4>
                <Card className="relative w-fit">
                  <CardContent className="p-2">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeNewImage}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Document Section */}
        <div>
          <Label className="mb-2">
            कागजात / Document (वैकल्पिक - एक मात्र)
          </Label>
          <div className="space-y-4">
            {/* Upload Button */}
            <div>
              <input
                ref={documentInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => documentInputRef.current?.click()}
                className="w-full sm:w-auto"
                disabled={!!formData.document || !!formData.existing_document}
              >
                <Upload className="h-4 w-4 mr-2" />
                कागजात अपलोड गर्नुहोस्
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                केवल PDF फाइल (अधिकतम १०MB)
              </p>
            </div>

            {/* Existing Document */}
            {formData.existing_document && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  अवस्थित कागजात:
                </h4>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getFileNameFromUrl(formData.existing_document)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(formData.existing_document!, "_blank")
                          }
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          हेर्नुहोस्
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeExistingDocument}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* New Document */}
            {formData.document && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  नयाँ कागजात:
                </h4>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formData.document.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getFileSize(formData.document.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeNewDocument}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          रद्द गर्नुहोस्
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "सुरक्षित गर्दै..."
            : plan
            ? "अपडेट गर्नुहोस्"
            : "सिर्जना गर्नुहोस्"}
        </Button>
      </div>
    </form>
  );
}
