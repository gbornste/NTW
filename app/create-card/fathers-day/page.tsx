"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Send, Edit2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CardAuthWrapper } from "@/components/card-auth-wrapper"
import { CardSendingInterface } from "@/components/card-sending-interface"

export default function FathersDayCardPage() {
  // State for card data
  const [recipientName, setRecipientName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [selectedMessage, setSelectedMessage] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [currentView, setCurrentView] = useState<"edit" | "preview">("edit")
  const [showSendInterface, setShowSendInterface] = useState(false)

  // Predefined messages
  const predefinedMessages = [
    "Happy Father's Day! Unlike Trump, you've always been there for your kids.",
    "To a real father who doesn't need to buy his children's affection. Happy Father's Day!",
    "You taught me integrity and honesty - qualities Trump wouldn't recognize. Happy Father's Day!",
    "Happy Father's Day to someone who leads by example, not by Twitter rants.",
    "Unlike some 'fathers,' you actually raised your kids instead of sending them to boarding school. Happy Father's Day!",
  ]

  // Get the actual message to display
  const getMessage = () => {
    if (selectedMessage === "custom") {
      return customMessage
    }
    return selectedMessage
  }

  // Card data for preview and sending
  const cardData = {
    templateName: "Father's Day Card",
    templateImage: "/images/trump-fathers-day.jpg",
    message: getMessage(),
    recipientName: recipientName,
    personalMessage: "",
    optionalNote: "",
    cardType: "fathers-day",
    fontStyle: "arial",
  }

  // Handle preview button click
  const handlePreview = () => {
    setCurrentView("preview")
  }

  // Handle edit button click
  const handleEdit = () => {
    setCurrentView("edit")
  }

  // Handle send button click
  const handleSend = () => {
    setShowSendInterface(true)
  }

  // If showing send interface
  if (showSendInterface) {
    return (
      <CardAuthWrapper action="send">
        <div className="container mx-auto py-8 px-4">
          <Button variant="ghost" className="mb-4" onClick={() => setShowSendInterface(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Card
          </Button>
          <CardSendingInterface
            cardData={cardData}
            onSendComplete={() => {
              // Handle successful send
            }}
          />
        </div>
      </CardAuthWrapper>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/create-card">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Templates
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Father's Day Card Creator</h1>
      </div>

      {currentView === "edit" ? (
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Design Your Card</CardTitle>
              <CardDescription>Create a personalized Father's Day card with an anti-Trump twist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient's Name</Label>
                <Input
                  id="recipient"
                  placeholder="Dad, Father, Pop, etc."
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender">Your Name</Label>
                <Input
                  id="sender"
                  placeholder="Your name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Choose a Message</Label>
                <RadioGroup value={selectedMessage} onValueChange={setSelectedMessage} className="space-y-3">
                  {predefinedMessages.map((message, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <RadioGroupItem value={message} id={`message-${index}`} />
                      <Label htmlFor={`message-${index}`} className="font-normal cursor-pointer">
                        {message}
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="custom" id="message-custom" />
                    <Label htmlFor="message-custom" className="font-normal cursor-pointer">
                      Write your own message
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {selectedMessage === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-message">Your Custom Message</Label>
                  <Textarea
                    id="custom-message"
                    placeholder="Write your own Father's Day message here..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handlePreview} disabled={!selectedMessage} className="w-full">
                <Eye className="mr-2 h-4 w-4" /> Preview Card
              </Button>
            </CardFooter>
          </Card>

          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle>Card Preview</CardTitle>
                <CardDescription>See how your card will look when sent</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden border">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="bg-blue-600 text-white p-4 text-center">
                      <h3 className="text-xl font-bold">Happy Father's Day</h3>
                    </div>
                    <div className="flex-1 p-6 flex flex-col items-center">
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          src="/images/trump-fathers-day.jpg"
                          alt="Trump Father's Day"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {recipientName && <p className="text-lg mb-2">Dear {recipientName},</p>}

                      <p className="text-center mb-4">{getMessage() || "Select a message to see preview"}</p>

                      {senderName && <p className="mt-auto">From, {senderName}</p>}
                    </div>
                    <div className="bg-gray-100 p-2 text-center text-xs text-gray-500">
                      Created with NoTrumpNWay.com
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Your Father's Day Card</CardTitle>
            <CardDescription>Preview your personalized card before sending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border mx-auto max-w-md">
              <div className="bg-blue-600 text-white p-4 text-center">
                <h3 className="text-xl font-bold">Happy Father's Day</h3>
              </div>
              <div className="p-6 flex flex-col items-center">
                <div className="relative w-full h-64 mb-6">
                  <Image
                    src="/images/trump-fathers-day.jpg"
                    alt="Trump Father's Day"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {recipientName && <p className="text-lg mb-4">Dear {recipientName},</p>}

                <p className="text-center text-lg mb-6">{getMessage()}</p>

                {senderName && <p className="mt-4">From, {senderName}</p>}
              </div>
              <div className="bg-gray-100 p-3 text-center text-sm text-gray-500">Created with NoTrumpNWay.com</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleEdit}>
              <Edit2 className="mr-2 h-4 w-4" /> Edit Card
            </Button>
            <Button onClick={handleSend}>
              <Send className="mr-2 h-4 w-4" /> Send Card
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
