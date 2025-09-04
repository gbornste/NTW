"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardSendingInterface } from "@/components/card-sending-interface"
import { EnhancedCardPreview } from "@/components/enhanced-card-preview"
import { ArrowLeft, Eye, Send } from "lucide-react"

const PRESET_MESSAGES = [
  "Happy Holidays! May your season be filled with more joy than a Trump rally has facts!",
  "Season's Greetings! Wishing you peace, love, and a president who can string together coherent sentences!",
  "Happy Holidays! May your new year be as free of drama as Trump's Twitter account is now!",
  "Wishing you a holiday season with family who love you for who you are, not how much you can do for them (unlike the Trump family)!",
  "May your holidays be bright and your politics be progressive! Happy Holidays!",
  "Here's to a holiday season with more truth than a Trump press conference!",
  "Wishing you a wonderful holiday filled with actual facts and real news!",
]

const FONT_OPTIONS = [
  { value: "arial", label: "Arial" },
  { value: "times", label: "Times New Roman" },
  { value: "comic", label: "Comic Sans" },
  { value: "impact", label: "Impact" },
]

export default function HolidayCardPage() {
  const [message, setMessage] = useState(PRESET_MESSAGES[0])
  const [customMessage, setCustomMessage] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [personalMessage, setPersonalMessage] = useState("")
  const [optionalNote, setOptionalNote] = useState("")
  const [fontStyle, setFontStyle] = useState("arial")
  const [useCustomMessage, setUseCustomMessage] = useState(false)
  const [currentView, setCurrentView] = useState<"editor" | "preview" | "send">("editor")

  const handleMessageSelect = (index: number) => {
    setMessage(PRESET_MESSAGES[index])
    setUseCustomMessage(false)
  }

  const handleCustomMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomMessage(e.target.value)
    setUseCustomMessage(true)
  }

  const finalMessage = useCustomMessage ? customMessage : message

  const cardData = {
    templateName: "Holiday Card",
    templateImage: "/political-holiday-card.png",
    message: finalMessage,
    recipientName,
    personalMessage,
    optionalNote,
    cardType: "holiday",
    fontStyle,
    template: { name: "Holiday Card", image: "/political-holiday-card.png" },
  }

  const handleSendComplete = () => {
    console.log("Card sent successfully")
    // Could redirect to a success page or show a success message
  }

  if (currentView === "send") {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setCurrentView("preview")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Preview
            </Button>
          </div>
          <CardSendingInterface
            cardData={cardData}
            onSendComplete={handleSendComplete}
            onCancel={() => setCurrentView("preview")}
          />
        </div>
      </div>
    )
  }

  if (currentView === "preview") {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentView("editor")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
            <Button onClick={() => setCurrentView("send")} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Card
            </Button>
          </div>
          <EnhancedCardPreview
            cardData={cardData}
            onSend={() => setCurrentView("send")}
            onUpdate={() => setCurrentView("editor")}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Image
              src="/political-holiday-card.png"
              alt="Holiday Card Icon"
              width={32}
              height={32}
              className="rounded"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=🎄"
              }}
            />
            Create Holiday Card
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Card Preview */}
            <div className="lg:w-1/2">
              <div className="sticky top-4">
                <div className="relative w-full max-w-md mx-auto aspect-[3/4] mb-4">
                  <Image
                    src="/political-holiday-card.png"
                    alt="Trump Holiday cartoon"
                    fill
                    className="object-contain rounded-md border shadow-lg"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=400&width=300&text=Holiday+Card"
                    }}
                  />
                </div>

                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label htmlFor="recipient">Recipient's Name (Optional)</Label>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient's name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="font-style">Font Style</Label>
                    <Select value={fontStyle} onValueChange={setFontStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font style" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Editor */}
            <div className="lg:w-1/2 space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Choose a Message</Label>
                <RadioGroup value={useCustomMessage ? "custom" : message} className="space-y-3">
                  {PRESET_MESSAGES.map((msg, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <RadioGroupItem
                        value={msg}
                        id={`message-${index}`}
                        checked={!useCustomMessage && message === msg}
                        onClick={() => handleMessageSelect(index)}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={`message-${index}`}
                        className="text-sm leading-relaxed cursor-pointer flex-1 p-2 rounded border hover:bg-gray-50 transition-colors"
                      >
                        {msg}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="custom-message" className="text-base font-medium">
                  Or Write Your Own Message
                </Label>
                <Textarea
                  id="custom-message"
                  placeholder="Enter your custom message here..."
                  className="min-h-[120px] mt-2"
                  value={customMessage}
                  onChange={handleCustomMessageChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {useCustomMessage ? customMessage.length : finalMessage.length} characters
                </p>
              </div>

              <div>
                <Label htmlFor="personal-message">Personal Message (Optional)</Label>
                <Textarea
                  id="personal-message"
                  placeholder="Add a personal touch to your card..."
                  className="min-h-[80px] mt-2"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="optional-note">Optional Note (Optional)</Label>
                <Input
                  id="optional-note"
                  placeholder="P.S. or additional note..."
                  value={optionalNote}
                  onChange={(e) => setOptionalNote(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <Button variant="outline" asChild>
            <Link href="/create-card" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentView("preview")} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview Card
            </Button>
            <Button
              onClick={() => setCurrentView("send")}
              className="flex items-center gap-2"
              disabled={!finalMessage.trim()}
            >
              <Send className="h-4 w-4" />
              Send Card
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
