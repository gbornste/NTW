"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Send, Edit2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CardSendingInterface } from "@/components/card-sending-interface"
import { useAuth } from "@/contexts/auth-context"
import { cardStorageService } from "@/lib/card-storage-service"

export default function FourthOfJulyCardPage() {
  // Get authentication state
  const { user } = useAuth()

  // State for card data
  const [recipientName, setRecipientName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [selectedMessage, setSelectedMessage] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [currentView, setCurrentView] = useState<"edit" | "preview">("edit")
  const [showSendInterface, setShowSendInterface] = useState(false)

  // Check for saved card on mount
  useEffect(() => {
    const savedCard = cardStorageService.getCard()
    if (savedCard && savedCard.cardType === "fourth-of-july") {
      // Restore saved card data
      setRecipientName(savedCard.recipientName || "")
      setSelectedMessage(savedCard.message || "")
      if (!predefinedMessages.includes(savedCard.message)) {
        setSelectedMessage("custom")
        setCustomMessage(savedCard.message || "")
      }
    }
  }, [])

  // Update sender name when user changes
  useEffect(() => {
    if (user?.name) {
      setSenderName(user.name)
    }
  }, [user])

  // Predefined messages
  const predefinedMessages = [
    "Celebrating Independence from orange tweets and wall dreams—Happy Fourth!",
    "This Fourth of July, let's toast to freedom and the fact that at least our fireworks aren’t as loud as some tweets.-Happy Fourth",
    "Remember, even George Washington would’ve tweeted '1776 called—They’re still not impressed-Happy Fourth",
    "Celebrating liberty, justice, and a president who’s not convinced the flag is ‘yuge.’ Happy Fourth!",
    "Here's to a country where the only wall we care about is made of fireworks, not politics. Happy Independence Day!",
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
    templateName: "4th of July Card",
    templateImage: "/images/Trump 4th of July.png", // Using graduation image for birthday
    message: getMessage(),
    recipientName: recipientName,
    personalMessage: "",
    optionalNote: "",
    cardType: "fourth-of-july",
    fontStyle: "arial",
  }

  // Handle preview button click
  const handlePreview = () => {
    console.log("Preview Card button clicked")
    setCurrentView("preview")
  }

  // Handle edit button click
  const handleEdit = () => {
    console.log("Edit Card button clicked")
    setCurrentView("edit")
  }

  // Handle send button click
  const handleSend = () => {
    console.log("Send button clicked - setting showSendInterface to true")
    setShowSendInterface(true)

    // Save card data for potential login redirect
    cardStorageService.saveCard({
      ...cardData,
      createdAt: new Date().toISOString(),
    })
  }

  // If showing send interface
  if (showSendInterface) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-4" onClick={() => setShowSendInterface(false)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Card
        </Button>

        <CardSendingInterface cardData={cardData} onCancel={() => setShowSendInterface(false)} />
      </div>
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
        <h1 className="text-2xl font-bold">4th of July Card Creator</h1>
      </div>

      {currentView === "edit" ? (
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Design Your Card</CardTitle>
              <CardDescription>Create a personalized 4th of July card with an anti-Trump twist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient's Name</Label>
                <Input
                  id="recipient"
                  placeholder="Friend, Family Member, etc."
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
                    placeholder="Write your own 4th of July message here..."
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
                    <div className="bg-purple-600 text-white p-4 text-center">
                      <h3 className="text-xl font-bold">Fourth of July</h3>
                    </div>
                    <div className="flex-1 p-6 flex flex-col items-center">
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          src="/images/Trump 4th of July.png"
                          alt="Trump 4th of July"
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
            <CardTitle>Your 4th of July Card</CardTitle>
            <CardDescription>Preview your personalized card before sending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border mx-auto max-w-md">
              <div className="bg-purple-600 text-white p-4 text-center">
                <h3 className="text-xl font-bold">4th of July</h3>
              </div>
              <div className="p-6 flex flex-col items-center">
                <div className="relative w-full h-64 mb-6">
                  <Image
                    src="/images/trump-graduation.jpg"
                    alt="Trump 4th of July"
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
            <Button onClick={handleSend} id="send-card-button" data-testid="send-card-button">
              <Send className="mr-2 h-4 w-4" /> Send Card
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
