"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw } from "lucide-react";
import { FeedbackTable } from "@/components/dashboard/feedback/feedback-table";
import { useFeedback } from "@/hooks/use-feedback";
import type { FeedbackFilters } from "@/types/feedback";

const ITEMS_PER_PAGE = 10;

export default function FeedbackPage() {
  const {
    feedbacks,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    fetchFeedbacks,
    deleteFeedback,
    updateFeedbackStatus,
  } = useFeedback();

  const [filters, setFilters] = useState<FeedbackFilters>({
    search: "",
    limit: ITEMS_PER_PAGE,
    offset: 0,
    status: "", // Updated default value to "all"
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const newFilters = {
        ...filters,
        search: searchTerm,
        offset: 0,
      };
      setFilters(newFilters);
      setCurrentPage(1);
      fetchFeedbacks(newFilters);
    },
    [filters, fetchFeedbacks]
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      const newFilters = {
        ...filters,
        status: status as "pending" | "resolved",
        offset: 0,
      };
      setFilters(newFilters);
      setCurrentPage(1);
      fetchFeedbacks(newFilters);
    },
    [filters, fetchFeedbacks]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const newOffset = (page - 1) * ITEMS_PER_PAGE;
      const newFilters = {
        ...filters,
        offset: newOffset,
      };
      setFilters(newFilters);
      setCurrentPage(page);
      fetchFeedbacks(newFilters);
    },
    [filters, fetchFeedbacks]
  );

  const handleRefresh = useCallback(() => {
    fetchFeedbacks(filters);
  }, [fetchFeedbacks, filters]);

  const safeTotal = totalCount || 0;
  const totalPages = Math.ceil(safeTotal / ITEMS_PER_PAGE);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Feedback Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and respond to citizen feedback
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading} variant="outline">
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, subject, or message..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.status || "all"} // Updated default value to "all"
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(filters.search || filters.status !== "") && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <Badge variant="secondary">Search: {filters.search}</Badge>
              )}
              {filters.status !== "" && (
                <Badge variant="secondary">Status: {filters.status}</Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({
                    search: "",
                    limit: ITEMS_PER_PAGE,
                    offset: 0,
                    status: "", // Updated default value to "all"
                  });
                  setCurrentPage(1);
                  fetchFeedbacks({ limit: ITEMS_PER_PAGE, offset: 0 });
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Feedback Records</CardTitle>
            {safeTotal > 0 && (
              <span className="text-sm text-gray-600">
                Total: {safeTotal} feedback{safeTotal !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <FeedbackTable
            feedbacks={feedbacks}
            loading={loading}
            onDelete={deleteFeedback}
            onUpdateStatus={updateFeedbackStatus}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, safeTotal)} of{" "}
                {safeTotal} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevious || loading}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
