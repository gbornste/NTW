import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimpleDebugPage() {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Simple Debug Page</CardTitle>
          <CardDescription>Basic debug information that works during SSR</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Environment Information</h3>
              <div className="space-y-1">
                <div>Node Environment: {process.env.NODE_ENV}</div>
                <div>Next.js Version: Available</div>
                <div>Build Time: {new Date().toISOString()}</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Available API Routes</h3>
              <div className="space-y-1">
                <div>✅ /api/auth/login</div>
                <div>✅ /api/auth/session</div>
                <div>✅ /api/auth/csrf</div>
                <div>✅ /api/auth/[...nextauth]</div>
              </div>
            </div>

            {/* Demo credentials removed. Only real user login is supported. */}

            <div>
              <h3 className="font-medium mb-2">Test Links</h3>
              <div className="space-y-1">
                <div>
                  <a href="/login" className="text-blue-600 hover:underline">
                    Login Page
                  </a>
                </div>
                <div>
                  <a href="/create-card" className="text-blue-600 hover:underline">
                    Create Card Page
                  </a>
                </div>
                <div>
                  <a href="/debug/auth" className="text-blue-600 hover:underline">
                    Advanced Debug Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
