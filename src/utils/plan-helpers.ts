import type { Plan } from "@/types/plan"

// Helper function to get image URL from plan
export function getPlanImageUrl(plan: Plan): string | null {
  if (plan.images && typeof plan.images === "string") {
    return plan.images
  }
  if (plan.images_url && typeof plan.images_url === "string") {
    return plan.images_url
  }
  return null
}

// Helper function to get document URL from plan
export function getPlanDocumentUrl(plan: Plan): string | null {
  if (plan.documents && typeof plan.documents === "string") {
    return plan.documents
  }
  if (plan.documents_url && typeof plan.documents_url === "string") {
    return plan.documents_url
  }
  return null
}

// Helper function to extract filename from URL
export function getFileNameFromUrl(url: string): string {
  try {
    const urlParts = url.split("/")
    const fileName = urlParts[urlParts.length - 1]
    // Remove any query parameters
    return fileName.split("?")[0] || "File"
  } catch {
    return "File"
  }
}

// Helper function to check if plan has image
export function hasImage(plan: Plan): boolean {
  return getPlanImageUrl(plan) !== null
}

// Helper function to check if plan has document
export function hasDocument(plan: Plan): boolean {
  return getPlanDocumentUrl(plan) !== null
}
