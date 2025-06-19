import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthTestLoading() {
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Session Status</h2>
            <div className="rounded-md bg-gray-50 p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">API Response</h2>
            <div className="rounded-md bg-gray-50 p-4">
              <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
