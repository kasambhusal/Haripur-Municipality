"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useOrganizations } from "@/hooks/use-organizations";
import { OrganizationTable } from "@/components/dashboard/organization/organization-table";
import { OrganizationForm } from "@/components/dashboard/organization/organization-form";
import type { OrganizationFormData } from "@/types/organization";
import { useNotifications } from "@/app/providers/notification-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublicOrganizationCategories } from "@/hooks/use-public-organizations";

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function OrganizationDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { categories, loading: categoriesLoading } =
    usePublicOrganizationCategories();
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Calculate offset for pagination
  const offset = (currentPage - 1) * itemsPerPage;

  // Fetch organizations using custom hook
  const { showSuccess, showError } = useNotifications();

  const {
    organizations,
    total,
    loading,
    error,
    refetch,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  } = useOrganizations({
    limit: itemsPerPage,
    offset,
    searchTerm: debouncedSearchTerm,
    category: selectedCategory,
  });

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory]);

  // Calculate pagination values
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = offset;
  const endIndex = Math.min(offset + itemsPerPage, total);

  // Handle create organization
  const handleCreate = async (data: OrganizationFormData) => {
    try {
      setIsSubmitting(true);
      await createOrganization(data);
      setIsAddDialogOpen(false);
      showSuccess("सफलता!", "संस्था सफलतापूर्वक सिर्जना गरियो।");
    } catch (error) {
      showError(
        "त्रुटि!",
        error instanceof Error
          ? error.message
          : "संस्था सिर्जना गर्न समस्या भयो।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update organization
  const handleUpdate = async (id: number, data: OrganizationFormData) => {
    try {
      await updateOrganization(id, data);
      showSuccess("सफलता!", "संस्था सफलतापूर्वक अपडेट गरियो।");
    } catch (error) {
      showError(
        "त्रुटि!",
        error instanceof Error ? error.message : "संस्था अपडेट गर्न समस्या भयो।"
      );
      throw error;
    }
  };

  // Handle delete organization
  const handleDelete = async (id: number) => {
    try {
      await deleteOrganization(id);
      showSuccess("सफलता!", "संस्था सफलतापूर्वक मेटाइयो।");
    } catch (error) {
      showError(
        "त्रुटि!",
        error instanceof Error ? error.message : "संस्था मेटाउन समस्या भयो।"
      );
      throw error;
    }
  };

  // Pagination handlers
  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                संस्था व्यवस्थापन / Organization Management
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                संस्थाहरूको सूची र व्यवस्थापन
              </p>
            </div>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                समस्या भयो
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                पुनः प्रयास गर्नुहोस्
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
              संस्था व्यवस्थापन / Organization Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              संस्थाहरूको सूची र व्यवस्थापन
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Total: {total} organization(s)
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="theme-color cursor-pointer hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  नयाँ संस्था थप्नुहोस्
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>नयाँ संस्था सिर्जना गर्नुहोस्</DialogTitle>
                </DialogHeader>
                <OrganizationForm
                  onSubmit={handleCreate}
                  onCancel={() => setIsAddDialogOpen(false)}
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="संस्थाको नाम, श्रेणी वा ठेगानाबाट खोज्नुहोस्..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-64">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="श्रेणी छान्नुहोस्" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सबै श्रेणी</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={refetch} disabled={loading}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                रिफ्रेस गर्नुहोस्
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Organizations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>संस्थाहरूको सूची</span>
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  कुनै संस्था फेला परेन
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  {debouncedSearchTerm
                    ? `"${debouncedSearchTerm}" को लागि कुनै संस्था फेला परेन। अर्को खोजी शब्द प्रयोग गर्नुहोस्।`
                    : "हाल कुनै संस्थाहरू उपलब्ध छैनन्। नयाँ संस्था थप्नुहोस्।"}
                </p>
              </div>
            ) : (
              <>
                <OrganizationTable
                  organizations={organizations}
                  loading={loading}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 pt-6 border-t">
                    <div className="text-sm text-gray-500 order-2 sm:order-1">
                      Showing {startIndex + 1} to {endIndex} of {total} results
                    </div>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="text-xs sm:text-sm"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </Button>
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => goToPage(page)}
                            className="w-8 h-8 p-0 text-xs"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
