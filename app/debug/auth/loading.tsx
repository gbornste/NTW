import { Card, CardContent } from "@/components/ui/card"

export default function AuthDebugLoading() {
  return (
    <div className="container py-8">
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <div>Loading authentication debug tools...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
