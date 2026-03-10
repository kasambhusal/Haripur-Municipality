import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface EmptyStateProps {
  searchTerm?: string
}

export function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">कुनै योजना फेला परेन</h3>
        <p className="text-gray-600 text-center max-w-md">
          {searchTerm
            ? `"${searchTerm}" को लागि कुनै योजना फेला परेन। अर्को खोजी शब्द प्रयोग गर्नुहोस्।`
            : "हाल कुनै योजनाहरू उपलब्ध छैनन्।"}
        </p>
      </CardContent>
    </Card>
  )
}
