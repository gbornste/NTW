"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Eye, Send } from "lucide-react"
import { AuthStatusIndicator } from "@/app/components/auth-status-indicator"

const CARD_TEMPLATES = [
  // Template data would go here
]

export default function CreateCardPage() {
  const [activeTab, setActiveTab] = useState("design")
  const [cardText, setCardText] = useState("")
  const [currentTemplate, setCurrentTemplate] = useState(null)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      {/* Header with auth status */}
      <div className="flex flex-col gap-3 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Palette className="h-8 w-8" />
          Create Your Card
        </h1>
        <AuthStatusIndicator />
      </div>

      {/* Card creation interface */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!cardText.trim()} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="send" disabled={!cardText.trim() || !currentTemplate} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send
          </TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-8">
          {/* ... (rest of the design tab content) */}
        </TabsContent>

        <TabsContent value="preview" className="space-y-8">
          {/* ... (rest of the preview tab content) */}
        </TabsContent>

        <TabsContent value="send" className="space-y-8">
          {/* ... (rest of the send tab content) */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
