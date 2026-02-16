"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { usePlans } from "@/hooks/use-plans";
import { ErrorState } from "@/components/others/error-state";
import type { Plan } from "@/types/plans";

// Debounce hook for search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function PlansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const offset = (currentPage - 1) * itemsPerPage;

  const { plans, total, loading, error, refetch } = usePlans({
    limit: itemsPerPage,
    offset,
    searchTerm: debouncedSearchTerm,
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = offset;
  const endIndex = Math.min(offset + itemsPerPage, total);

  const handleDocumentAction = useCallback((plan: Plan) => {
    if (plan.documents_url) {
      window.open(plan.documents_url, "_blank", "noopener,noreferrer");
    } else {
      alert("यस योजनाको लागि कुनै कागजात उपलब्ध छैन।");
    }
  }, []);

  const goToPage = useCallback(
    (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    [totalPages]
  );

  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <ErrorState message={error} onRetry={refetch} />
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
              योजनाहरू / Plans
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              हरिपुर नगरपालिकाका विकास योजनाहरू
            </p>
          </div>
          <div className="text-sm text-gray-500">Total: {total} plan(s)</div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="योजनाको नाम, विवरण वा प्रगति नोटबाट खोज्नुहोस्..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Development Plans</span>
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Title</TableHead>
                    <TableHead className="w-2/5">Description</TableHead>
                    <TableHead className="w-1/4">Progress Note</TableHead>
                    <TableHead className="text-right w-1/12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.title}</TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {plan.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {plan.progress_note}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center">
                                  <FileText className="h-5 w-5 mr-2" />
                                  {plan.title}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Description */}
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    विवरण
                                  </h3>
                                  <p className="bg-gray-100 p-4 rounded-md">
                                    {plan.description}
                                  </p>
                                </div>

                                {/* Progress Note */}
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    प्रगति नोट
                                  </h3>
                                  <p className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                                    {plan.progress_note}
                                  </p>
                                </div>

                                {/* Image with next/image */}
                                {plan.images_url && (
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                      योजना फोटो
                                    </h3>
                                    <div className="relative w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden border">
                                      <Image
                                        src={plan.images_url}
                                        alt="Plan Image"
                                        fill
                                        style={{ objectFit: "contain" }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Documents */}
                                {plan.documents_url && (
                                  <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      कागजात
                                    </h3>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDocumentAction(plan)}
                                      className="mt-2"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      खोल्नुहोस्
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {plan.documents_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDocumentAction(plan)}
                              className="text-blue-600"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {endIndex} of {total} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>
                  {getPageNumbers().map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
