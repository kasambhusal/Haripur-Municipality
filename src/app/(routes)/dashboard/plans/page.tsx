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
  FileText,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { usePlans } from "@/hooks/use-plans-dashboard";
import { PlanTable } from "@/components/dashboard/plan/plan-table";
import { PlanForm } from "@/components/dashboard/plan/plan-form";
import type { PlanFormData } from "@/types/plan";
import { useNotifications } from "@/app/providers/notification-provider";

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

export default function PlansDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Calculate offset for pagination
  const offset = (currentPage - 1) * itemsPerPage;

  // Fetch plans using custom hook
  const { showSuccess, showError } = useNotifications();

  const {
    plans,
    total,
    loading,
    error,
    refetch,
    createPlan,
    updatePlan,
    deletePlan,
    getPlan,
  } = usePlans({
    limit: itemsPerPage,
    offset,
    searchTerm: debouncedSearchTerm,
  });

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Calculate pagination values
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = offset;
  const endIndex = Math.min(offset + itemsPerPage, total);

  // Handle create plan
  const handleCreate = async (data: PlanFormData) => {
    try {
      setIsSubmitting(true);
      await createPlan(data);
      setIsAddDialogOpen(false);
      showSuccess("सफलता!", "योजना सफलतापूर्वक सिर्जना गरियो।");
    } catch (error) {
      showError(
        "त्रुटि!",
        error instanceof Error
          ? "यो कार्य गर्न तपाईंलाई अनुमति छैन।"
          : "योजना सिर्जना गर्न समस्या भयो।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update plan
  const handleUpdate = async (id: number, data: PlanFormData) => {
    try {
      await updatePlan(id, data);
      showSuccess("सफलता!", "योजना सफलतापूर्वक अपडेट गरियो।");
    } catch (error) {
      showError(
        "त्रुटि!",
        error instanceof Error ? error.message : "योजना अपडेट गर्न समस्या भयो।"
      );
      throw error;
    }
  };

  // Handle delete plan
  const handleDelete = async (id: number) => {
    try {
      await deletePlan(id);
      showSuccess("सफलता!", "योजना सफलतापूर्वक मेटाइयो।");
    } catch (error) {
      showError(
        "त्रुटि!",
        error instanceof Error ? error.message : "योजना मेटाउन समस्या भयो।"
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
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                योजना व्यवस्थापन / Plans Management
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                योजनाहरूको सूची र व्यवस्थापन
              </p>
            </div>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-red-500 mb-4" />
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
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
              योजना व्यवस्थापन / Plans Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              योजनाहरूको सूची र व्यवस्थापन
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Total: {total} plan(s)</div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="theme-color hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  नयाँ योजना थप्नुहोस्
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>नयाँ योजना सिर्जना गर्नुहोस्</DialogTitle>
                </DialogHeader>
                <PlanForm
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
                  placeholder="योजनाको शीर्षक, विवरण वा प्रगति नोटबाट खोज्नुहोस्..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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

        {/* Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>योजनाहरूको सूची</span>
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plans.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  कुनै योजना फेला परेन
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  {debouncedSearchTerm
                    ? `"${debouncedSearchTerm}" को लागि कुनै योजना फेला परेन। अर्को खोजी शब्द प्रयोग गर्नुहोस्।`
                    : "हाल कुनै योजनाहरू उपलब्ध छैनन्। नयाँ योजना थप्नुहोस्।"}
                </p>
              </div>
            ) : (
              <>
                <PlanTable
                  plans={plans}
                  loading={loading}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onGetPlan={getPlan}
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
