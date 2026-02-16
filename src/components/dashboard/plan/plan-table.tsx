"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Eye, FileText, ImageIcon, Download } from "lucide-react";
import { Delete as DELETE } from "@/lib/api";
import type { Plan, PlanFormData } from "@/types/plan";
import { PlanForm } from "./plan-form";
import {
  getPlanImageUrl,
  getPlanDocumentUrl,
  getFileNameFromUrl,
} from "@/utils/plan-helpers";
import Image from "next/image";

interface PlanTableProps {
  plans: Plan[];
  loading: boolean;
  onUpdate: (id: number, data: PlanFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onGetPlan: (id: number) => Promise<Plan>;
}

export function PlanTable({
  plans,
  loading,
  onUpdate,
  onDelete,
  onGetPlan,
}: PlanTableProps) {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = async (planId: number) => {
    try {
      const plan = await onGetPlan(planId);
      setEditingPlan(plan);
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error("Error loading plan for edit:", error);
    }
  };

  const handleUpdate = async (data: PlanFormData) => {
    if (!editingPlan) return;

    try {
      setIsSubmitting(true);
      await onUpdate(editingPlan.id, data);
      setIsEditDialogOpen(false);
      setEditingPlan(null);
    } catch {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await onDelete(id);
    } catch {
      // Error is handled in the hook
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageRemove = async () => {
    try {
      await DELETE({
        url: `/plans/${editingPlan?.id}/remove_image/`,
      });
    } catch {
      console.error("Error removing image");
    }
  };

  const handleDocumentRemove = async () => {
    try {
      await DELETE({
        url: `/plans/${editingPlan?.id}/remove_document/`,
      });
    } catch {
      console.error("Error removing document");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("ne-NP");
  };

  if (loading && plans.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {plans.map((plan) => {
          const imageUrl = getPlanImageUrl(plan);
          const documentUrl = getPlanDocumentUrl(plan);

          return (
            <Card key={plan.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {plan.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {plan.description.length > 100
                          ? `${plan.description.substring(0, 100)}...`
                          : plan.description}
                      </p>
                    </div>
                  </div>

                  {plan.progress_note && (
                    <div className="text-xs text-blue-600 line-clamp-2">
                      प्रगति:{" "}
                      {plan.progress_note.length > 80
                        ? `${plan.progress_note.substring(0, 80)}...`
                        : plan.progress_note}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {imageUrl && (
                      <div className="flex items-center">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        छवि
                      </div>
                    )}
                    {documentUrl && (
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        कागजात
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-gray-500">
                      {formatDate(plan.created_at)}
                    </span>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            हेर्नुहोस्
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
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                विवरण / Description
                              </h3>
                              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                {plan.description}
                              </p>
                            </div>

                            {/* Progress Note */}
                            {plan.progress_note && (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  प्रगति नोट / Progress Note
                                </h3>
                                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                  {plan.progress_note}
                                </p>
                              </div>
                            )}

                            {/* Image */}
                            {imageUrl && (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  छवि / Image
                                </h3>
                                <div className="w-fit">
                                  <Image
                                    src={imageUrl || "/placeholder.svg"}
                                    alt="Plan image"
                                    width={256}
                                    height={256}
                                    className="max-w-full h-64 object-cover rounded-lg border"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Document */}
                            {documentUrl && (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  कागजात / Document
                                </h3>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {getFileNameFromUrl(documentUrl)}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(documentUrl, "_blank")
                                    }
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    डाउनलोड
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plan.id)}
                        className="text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        सम्पादन
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            मेटाउनुहोस्
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              के तपाईं निश्चित हुनुहुन्छ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              यो कार्य फिर्ता गर्न सकिँदैन। यसले &quot;
                              {plan.title}&quot; योजनालाई स्थायी रूपमा मेटाउनेछ।
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              रद्द गर्नुहोस्
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(plan.id)}
                              disabled={deletingId === plan.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deletingId === plan.id
                                ? "मेटाउँदै..."
                                : "मेटाउनुहोस्"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>योजनाको शीर्षक</TableHead>
              <TableHead>विवरण</TableHead>
              <TableHead>प्रगति नोट</TableHead>
              <TableHead>फाइलहरू</TableHead>
              <TableHead>सिर्जना मिति</TableHead>
              <TableHead className="text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => {
              const imageUrl = getPlanImageUrl(plan);
              const documentUrl = getPlanDocumentUrl(plan);

              return (
                <TableRow key={plan.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {plan.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {plan.description.length > 150
                          ? `${plan.description.substring(0, 150)}...`
                          : plan.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {plan.progress_note ? (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {plan.progress_note.length > 100
                            ? `${plan.progress_note.substring(0, 100)}...`
                            : plan.progress_note}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400">
                          कुनै प्रगति नोट छैन
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {imageUrl && (
                        <div className="flex items-center">
                          <ImageIcon className="h-4 w-4 mr-1" />
                          छवि
                        </div>
                      )}
                      {documentUrl && (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          कागजात
                        </div>
                      )}
                      {!imageUrl && !documentUrl && (
                        <span className="text-gray-400">कुनै फाइल छैन</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(plan.created_at)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            हेर्नुहोस्
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
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                विवरण / Description
                              </h3>
                              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                {plan.description}
                              </p>
                            </div>

                            {/* Progress Note */}
                            {plan.progress_note && (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  प्रगति नोट / Progress Note
                                </h3>
                                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                  {plan.progress_note}
                                </p>
                              </div>
                            )}

                            {/* Image */}
                            {imageUrl && (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  छवि / Image
                                </h3>
                                <div className="w-fit">
                                  <Image
                                    src={imageUrl || "/placeholder.svg"}
                                    alt="Plan image"
                                    width={256}
                                    height={256}
                                    className="max-w-full h-64 object-cover rounded-lg border"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Document */}
                            {documentUrl && (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  कागजात / Document
                                </h3>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {getFileNameFromUrl(documentUrl)}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(documentUrl, "_blank")
                                    }
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    डाउनलोड
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plan.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        सम्पादन
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            मेटाउनुहोस्
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              के तपाईं निश्चित हुनुहुन्छ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              यो कार्य फिर्ता गर्न सकिँदैन। यसले &quot;
                              {plan.title}&quot; योजनालाई स्थायी रूपमा मेटाउनेछ।
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              रद्द गर्नुहोस्
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(plan.id)}
                              disabled={deletingId === plan.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deletingId === plan.id
                                ? "मेटाउँदै..."
                                : "मेटाउनुहोस्"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>योजना सम्पादन गर्नुहोस्</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <PlanForm
              plan={editingPlan}
              onSubmit={handleUpdate}
              removeImage={handleImageRemove}
              removeDocument={handleDocumentRemove}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingPlan(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
