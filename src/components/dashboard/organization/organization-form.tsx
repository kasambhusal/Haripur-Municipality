"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationCategories } from "@/hooks/use-organizations";
import type { Organization, OrganizationFormData } from "@/types/organization";

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function OrganizationForm({
  organization,
  onSubmit,
  onCancel,
  isSubmitting,
}: OrganizationFormProps) {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useOrganizationCategories();
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    category: "",
    address: "",
    phone_no: "",
    is_active: true,
  });
  const [errors, setErrors] = useState<Partial<OrganizationFormData>>({});

  // Initialize form data when organization or categories change
  useEffect(() => {
    if (organization && categories.length > 0) {
      console.log("Setting form data for organization:", organization);
      console.log("Available categories:", categories);
      console.log("Organization category:", organization.category);

      // Find if the organization's category exists in available categories
      const categoryExists = categories.find(
        (cat) => cat.value === organization.category
      );
      console.log("Category exists in options:", categoryExists);

      setFormData({
        name: organization.name,
        category: organization.category, // Use the raw category value from API
        address: organization.address || "",
        phone_no: organization.phone_no || "",
        is_active: organization.is_active,
      });
    } else if (!organization) {
      // Reset form for new organization
      setFormData({
        name: "",
        category: "",
        address: "",
        phone_no: "",
        is_active: true,
      });
    }
  }, [organization, categories]);

  const validateForm = (): boolean => {
    const newErrors: Partial<OrganizationFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "संस्थाको नाम आवश्यक छ";
    } else if (formData.name.length > 200) {
      newErrors.name = "संस्थाको नाम २०० अक्षरभन्दा बढी हुन सक्दैन";
    }

    if (!formData.category) {
      newErrors.category = "श्रेणी चयन गर्नुहोस्";
    }

    if (formData.phone_no && !/^\+?1?\d{9,15}$/.test(formData.phone_no)) {
      newErrors.phone_no = "मान्य फोन नम्बर प्रविष्ट गर्नुहोस्";
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (
    field: keyof OrganizationFormData,
    value: string | boolean
  ) => {
    console.log(`Changing ${field} to:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Get the display name for the current category
  const getCurrentCategoryDisplay = () => {
    if (!formData.category) return "श्रेणी चयन गर्नुहोस्";
    const category = categories.find((cat) => cat.value === formData.category);
    return category ? category.label : formData.category;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Name */}
        <div className="md:col-span-2">
          <Label className="mb-2" htmlFor="name">
            संस्थाको नाम / Organization Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="संस्थाको नाम प्रविष्ट गर्नुहोस्"
            className={errors.name ? "border-red-500" : ""}
            maxLength={200}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <Label className="mb-2" htmlFor="category">
            श्रेणी / Category *
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
            disabled={categoriesLoading}
          >
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="श्रेणी चयन गर्नुहोस्">
                {formData.category
                  ? getCurrentCategoryDisplay()
                  : "श्रेणी चयन गर्नुहोस्"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <SelectItem value="loading" disabled>
                  लोड हुँदैछ...
                </SelectItem>
              ) : categoriesError ? (
                <SelectItem value="error" disabled>
                  श्रेणी लोड गर्न समस्या भयो
                </SelectItem>
              ) : categories.length === 0 ? (
                <SelectItem value="no-categories" disabled>
                  कुनै श्रेणी उपलब्ध छैन
                </SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500 mt-1">{errors.category}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <Label className="mb-2" htmlFor="phone_no">
            फोन नम्बर / Phone Number
          </Label>
          <Input
            id="phone_no"
            value={formData.phone_no}
            onChange={(e) => handleInputChange("phone_no", e.target.value)}
            placeholder="+977-9800000000"
            className={errors.phone_no ? "border-red-500" : ""}
            maxLength={17}
          />
          {errors.phone_no && (
            <p className="text-sm text-red-500 mt-1">{errors.phone_no}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <Label className="mb-2" htmlFor="address">
            ठेगाना / Address
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="पूरा ठेगाना प्रविष्ट गर्नुहोस्"
            rows={3}
          />
        </div>

        {/* Active Status */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleInputChange("is_active", checked)
              }
            />
            <Label className="mb-2" htmlFor="is_active">
              सक्रिय स्थिति / Active Status
            </Label>
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
        <Button type="submit" disabled={isSubmitting || categoriesLoading}>
          {isSubmitting
            ? "सुरक्षित गर्दै..."
            : organization
            ? "अपडेट गर्नुहोस्"
            : "सिर्जना गर्नुहोस्"}
        </Button>
      </div>
    </form>
  );
}
