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

const PRESET_MESSAGES = [
  "Congratulations on your graduation! You earned your degree through hard work, not a 'small loan' of millions from daddy!",
  "Congrats grad! Your diploma is real, unlike some people's university credentials!",
  "You did it! A real academic achievement that didn't require threatening your school to hide your grades!",
  "Congratulations! Your future is bright because you actually studied instead of just claiming to be a 'stable genius'!",
  "Way to go, graduate! You're entering the world with knowledge, skills, and hopefully better hair than Trump!",
]

export default function GraduationCardPage() {
  const [message, setMessage] = useState(PRESET_MESSAGES[0])
  const [customMessage, setCustomMessage] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [useCustomMessage, setUseCustomMessage] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const handleMessageSelect = (index: number) => {
    setMessage(PRESET_MESSAGES[index])
    setUseCustomMessage(false)
  }

  const handleCustomMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomMessage(e.target.value)
    setUseCustomMessage(true)
  }

  const finalMessage = useCustomMessage ? customMessage : message

  if (previewMode) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Graduation Card Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {recipientName && <div className="mb-4 text-lg font-medium">Dear {recipientName},</div>}

              <div className="flex justify-center mb-6">
                <div className="relative w-full max-w-md aspect-square">
                  <Image
                    src="/images/trump-graduation.jpg"
                    alt="Trump Graduation cartoon"
                    fill
                    className="object-contain rounded-md"
                    priority
                  />
                </div>
              </div>

              <div className="text-center mb-6 text-lg">{finalMessage}</div>

              {senderName && (
                <div className="text-right mt-8">
                  <p>From,</p>
                  <p className="font-medium">{senderName}</p>
                </div>
              )}

              <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                <p>NoTrumpNWay.com</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              Back to Editor
            </Button>
            <Button>Send Card</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Create Graduation Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <div className="relative w-full aspect-square mb-4">
                <Image
                  src="/images/trump-graduation.jpg"
                  alt="Trump Graduation cartoon"
                  fill
                  className="object-contain rounded-md"
                  priority
                />
              </div>

              <div className="space-y-4">
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
                  <Label htmlFor="sender">Your Name (Optional)</Label>
                  <Input
                    id="sender"
                    placeholder="Enter your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="md:w-1/2 space-y-4">
              <div>
                <Label className="text-base font-medium">Choose a Message</Label>
                <RadioGroup defaultValue="0" className="mt-2">
                  {PRESET_MESSAGES.map((msg, index) => (
                    <div key={index} className="flex items-start space-x-2 mb-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`message-${index}`}
                        checked={!useCustomMessage && message === msg}
                        onClick={() => handleMessageSelect(index)}
                      />
                      <Label htmlFor={`message-${index}`} className="text-sm leading-tight">
                        {msg}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="custom-message">Or Write Your Own Message</Label>
                <Textarea
                  id="custom-message"
                  placeholder="Enter your custom message here..."
                  className="min-h-[120px]"
                  value={customMessage}
                  onChange={handleCustomMessageChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/create-card">Back to Templates</Link>
          </Button>
          <Button onClick={() => setPreviewMode(true)}>Preview Card</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
