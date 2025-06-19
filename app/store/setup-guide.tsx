import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon, ShieldAlert } from "lucide-react"

export default function SetupGuide() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Printify Integration Setup Guide</h1>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>This guide will help you set up your Printify integration securely.</AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Set Environment Variables</CardTitle>
            <CardDescription>Add your Printify API token to your environment variables</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Create or edit your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in your
                project root
              </li>
              <li>
                Add the following line:
                <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">PRINTIFY_API_TOKEN=your_api_token_here</pre>
              </li>
              <li>
                Replace <code className="bg-muted px-1 py-0.5 rounded">your_api_token_here</code> with your actual
                Printify API token
              </li>
              <li>Save the file and restart your development server</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Verify Connection</CardTitle>
            <CardDescription>Test that your Printify integration is working</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Navigate to your store page</li>
              <li>You should see your actual Printify products displayed</li>
              <li>If you see a notice about "demo products," check that your API token is set correctly</li>
              <li>Click the "Refresh Products" button to fetch the latest data from Printify</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <CardTitle>Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Never commit your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file to version
                control
              </li>
              <li>Don't share your API tokens in public forums, chat, or code repositories</li>
              <li>
                When deploying to Vercel or another hosting provider, add your environment variables through their
                secure interface
              </li>
              <li>Regularly rotate your API tokens, especially if you suspect they may have been compromised</li>
              <li>Only grant the minimum permissions necessary for your application to function</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
