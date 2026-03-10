"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Hospital,
  Banknote,
  Users,
  RefreshCw,
} from "lucide-react";
import {
  usePublicOrganizations,
  usePublicOrganizationCategories,
  useOrganizationStats,
} from "@/hooks/use-public-organizations";
import { toNepaliNumber } from "@/utils/NumberConvert";

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

// Category grouping for statistics
const CATEGORY_GROUPS = {
  educational: [
    "gov_educational",
    "community_educational",
    "private_educational",
    "other_educational",
    "educational",
  ],
  health: ["health"],
  financial: ["financial", "commercial_bank", "cooperative"],
  social: ["ngo", "cso", "social", "community_space", "religious"],
};

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Calculate offset for pagination
  const offset = (currentPage - 1) * itemsPerPage;

  // Fetch data using hooks
  const { stats, loading: statsLoading } = useOrganizationStats();
  const { categories, loading: categoriesLoading } =
    usePublicOrganizationCategories();
  const { organizations, total, loading, error, refetch } =
    usePublicOrganizations({
      limit: itemsPerPage,
      offset,
      searchTerm: debouncedSearchTerm,
      category: selectedCategory,
    });

  console.log(organizations);

  // Reset to first page when search term or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory]);

  // Calculate pagination values
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = offset;
  const endIndex = Math.min(offset + itemsPerPage, total);

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

  // Get category display name
  const getCategoryDisplay = (categoryValue: string) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // Get icon for category
  const getIconForCategory = (categoryValue: string) => {
    // Check which group this category belongs to
    if (CATEGORY_GROUPS.educational.includes(categoryValue)) {
      return <GraduationCap className="h-5 w-5" />;
    }
    if (CATEGORY_GROUPS.health.includes(categoryValue)) {
      return <Hospital className="h-5 w-5" />;
    }
    if (CATEGORY_GROUPS.financial.includes(categoryValue)) {
      return <Banknote className="h-5 w-5" />;
    }
    if (CATEGORY_GROUPS.social.includes(categoryValue)) {
      return <Users className="h-5 w-5" />;
    }
    return <Building2 className="h-5 w-5" />;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
              संस्थाहरू / Organizations
            </h1>
            <p className="text-gray-600 mt-2">
              हरिपुर नगरपालिकाका दर्ता संस्थाहरू
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {total} organization(s)
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg">
                  <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-700">
                    {statsLoading ? "..." : toNepaliNumber(stats.educational)}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">
                    शैक्षिक संस्थाहरू
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="bg-red-500 text-white p-2 sm:p-3 rounded-lg">
                  <Hospital className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-red-700">
                    {statsLoading ? "..." : toNepaliNumber(stats.health)}
                  </div>
                  <div className="text-xs sm:text-sm text-red-600 font-medium">
                    स्वास्थ्य संस्थाहरू
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="bg-purple-500 text-white p-2 sm:p-3 rounded-lg">
                  <Banknote className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-700">
                    {statsLoading ? "..." : toNepaliNumber(stats.financial)}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">
                    वित्तीय संस्थाहरू
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="bg-green-500 text-white p-2 sm:p-3 rounded-lg">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-green-700">
                    {statsLoading ? "..." : toNepaliNumber(stats.social)}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                    सामाजिक संस्थाहरू
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="संस्थाको नाम वा ठेगानाबाट खोज्नुहोस्..."
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
                रिफ्रेस
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Organizations Table */}
        <Card>
          <CardContent className="p-6">
            {loading && organizations.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">संस्थाहरू लोड हुँदैछ...</p>
                </div>
              </div>
            ) : organizations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  कुनै संस्था फेला परेन
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  {debouncedSearchTerm || selectedCategory !== "all"
                    ? "खोजी मापदण्डअनुसार कुनै संस्था फेला परेन। अर्को खोजी शब्द प्रयोग गर्नुहोस्।"
                    : "हाल कुनै संस्थाहरू उपलब्ध छैनन्।"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>संस्थाको नाम</TableHead>
                        <TableHead>श्रेणी</TableHead>
                        <TableHead>ठेगाना</TableHead>
                        <TableHead>फोन नम्बर</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizations.map((org) => (
                        <TableRow key={org.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {org.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="text-gray-500">
                                {getIconForCategory(org.category)}
                              </div>
                              <span className="text-sm text-gray-600">
                                {getCategoryDisplay(org.category)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {org.address || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {org.phone_no || "N/A"}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

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
