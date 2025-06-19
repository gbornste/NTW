import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon } from "lucide-react"
import Link from "next/link"

export default function SetupGuidePage() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Printify Integration Setup Guide</h1>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Demo Mode Active</AlertTitle>
        <AlertDescription>
          You're currently seeing demo products because your Printify API integration isn't fully configured.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Get Your Printify API Token</CardTitle>
            <CardDescription>You'll need to generate an API token from your Printify account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Log in to your Printify account at{" "}
                <a
                  href="https://printify.com/app/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  printify.com
                </a>
              </li>
              <li>Go to your profile settings</li>
              <li>Navigate to the "API" section</li>
              <li>Click "Generate new token"</li>
              <li>Give your token a name (e.g., "NoTrumpNWay Website")</li>
              <li>Select the necessary permissions (at minimum: shops.read, products.read, orders.write)</li>
              <li>Copy the generated token</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Add Your API Token to Environment Variables</CardTitle>
            <CardDescription>Configure your website to use the Printify API token.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Add the following environment variable to your project:</p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">PRINTIFY_API_TOKEN=your_api_token_here</div>
            <p>If you're using Vercel, you can add this in your project settings under "Environment Variables".</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Verify Your NoTrumpNWay Shop</CardTitle>
            <CardDescription>Make sure your shop is properly set up in Printify.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Ensure that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your Printify shop is named "NoTrumpNWay" or contains this name</li>
              <li>You have products added to your shop</li>
              <li>Your products have proper images, variants, and pricing</li>
            </ul>
            <p>The integration will automatically find your shop by name and display its products.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 4: Deploy Your Changes</CardTitle>
            <CardDescription>Update your website with the new configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>After adding your API token:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Deploy your website with the updated environment variables</li>
              <li>Visit the store page to verify that your actual products are displayed</li>
              <li>Test the checkout process to ensure orders are properly created in your Printify account</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link href="/store" className="text-primary underline">
          Return to Store
        </Link>
      </div>
    </div>
  )
}
