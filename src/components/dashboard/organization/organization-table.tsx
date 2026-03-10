"use client";

import { Label } from "@/components/ui/label";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Edit, Trash2, Eye, Phone, MapPin } from "lucide-react";
import type { Organization, OrganizationFormData } from "@/types/organization";
import { OrganizationForm } from "./organization-form";
import { useOrganizationCategories } from "@/hooks/use-organizations";

interface OrganizationTableProps {
  organizations: Organization[];
  loading: boolean;
  onUpdate: (id: number, data: OrganizationFormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function OrganizationTable({
  organizations,
  loading,
  onUpdate,
  onDelete,
}: OrganizationTableProps) {
  const { categories } = useOrganizationCategories();
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: OrganizationFormData) => {
    if (!editingOrganization) return;

    try {
      setIsSubmitting(true);
      await onUpdate(editingOrganization.id, data);
      setIsEditDialogOpen(false);
      setEditingOrganization(null);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("ne-NP");
  };

  // Helper function to get category display name
  const getCategoryDisplay = (categoryValue: string) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  if (loading && organizations.length === 0) {
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
        {organizations.map((org) => (
          <Card key={org.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {org.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {getCategoryDisplay(org.category)}
                    </p>
                  </div>
                  <Badge
                    variant={org.is_active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {org.is_active ? "सक्रिय" : "निष्क्रिय"}
                  </Badge>
                </div>

                {org.address && (
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">{org.address}</span>
                  </div>
                )}

                {org.phone_no && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{org.phone_no}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-gray-500">
                    {formatDate(org.created_at)}
                  </span>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          हेर्नुहोस्
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{org.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">
                              श्रेणी:
                            </Label>
                            <p className="text-sm text-gray-600">
                              {getCategoryDisplay(org.category)}
                            </p>
                          </div>
                          {org.address && (
                            <div>
                              <Label className="text-sm font-medium">
                                ठेगाना:
                              </Label>
                              <p className="text-sm text-gray-600">
                                {org.address}
                              </p>
                            </div>
                          )}
                          {org.phone_no && (
                            <div>
                              <Label className="text-sm font-medium">
                                फोन:
                              </Label>
                              <p className="text-sm text-gray-600">
                                {org.phone_no}
                              </p>
                            </div>
                          )}
                          <div>
                            <Label className="text-sm font-medium">
                              स्थिति:
                            </Label>
                            <Badge
                              variant={org.is_active ? "default" : "secondary"}
                              className="ml-2"
                            >
                              {org.is_active ? "सक्रिय" : "निष्क्रिय"}
                            </Badge>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(org)}
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
                            यो कार्य फिर्ता गर्न सकिँदैन। यसले &quot;{org.name}
                            &quot; संस्थालाई स्थायी रूपमा मेटाउनेछ।
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(org.id)}
                            disabled={deletingId === org.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deletingId === org.id
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
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>संस्थाको नाम</TableHead>
              <TableHead>श्रेणी</TableHead>
              <TableHead>ठेगाना</TableHead>
              <TableHead>फोन नम्बर</TableHead>
              <TableHead>स्थिति</TableHead>
              <TableHead>सिर्जना मिति</TableHead>
              <TableHead className="text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="font-medium text-gray-900">{org.name}</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {getCategoryDisplay(org.category)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <span className="text-sm text-gray-600 line-clamp-2">
                      {org.address || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {org.phone_no || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={org.is_active ? "default" : "secondary"}>
                    {org.is_active ? "सक्रिय" : "निष्क्रिय"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDate(org.created_at)}
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
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{org.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="font-medium">श्रेणी:</Label>
                            <p className="text-gray-600">
                              {getCategoryDisplay(org.category)}
                            </p>
                          </div>
                          {org.address && (
                            <div>
                              <Label className="font-medium">ठेगाना:</Label>
                              <p className="text-gray-600">{org.address}</p>
                            </div>
                          )}
                          {org.phone_no && (
                            <div>
                              <Label className="font-medium">फोन नम्बर:</Label>
                              <p className="text-gray-600">{org.phone_no}</p>
                            </div>
                          )}
                          <div>
                            <Label className="font-medium">स्थिति:</Label>
                            <Badge
                              variant={org.is_active ? "default" : "secondary"}
                              className="ml-2"
                            >
                              {org.is_active ? "सक्रिय" : "निष्क्रिय"}
                            </Badge>
                          </div>
                          <div>
                            <Label className="font-medium">सिर्जना मिति:</Label>
                            <p className="text-gray-600">
                              {formatDate(org.created_at)}
                            </p>
                          </div>
                          {org.updated_at && (
                            <div>
                              <Label className="font-medium">अपडेट मिति:</Label>
                              <p className="text-gray-600">
                                {formatDate(org.updated_at)}
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(org)}
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
                            यो कार्य फिर्ता गर्न सकिँदैन। यसले &quot;{org.name}
                            &quot; संस्थालाई स्थायी रूपमा मेटाउनेछ।
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(org.id)}
                            disabled={deletingId === org.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deletingId === org.id
                              ? "मेटाउँदै..."
                              : "मेटाउनुहोस्"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>संस्था सम्पादन गर्नुहोस्</DialogTitle>
          </DialogHeader>
          {editingOrganization && (
            <OrganizationForm
              organization={editingOrganization}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingOrganization(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
