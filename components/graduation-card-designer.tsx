"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CardDesignerProps {
  onSave: (cardData: any) => void
}

const GraduationCardDesigner: React.FC<CardDesignerProps> = ({ onSave }) => {
  const [message, setMessage] = useState("Congratulations on your graduation!")
  const [recipientName, setRecipientName] = useState("")
  const [personalMessage, setPersonalMessage] = useState("")
  const [optionalNote, setOptionalNote] = useState("")

  const cardData = {
    template: { name: "Graduation Card", image: "/images/trump-graduation.jpg" },
    message: message,
    recipientName: recipientName,
    personalMessage: personalMessage,
    optionalNote: optionalNote,
    templateName: "Graduation Card",
    templateImage: "/images/trump-graduation.jpg",
  }

  return (
    <Card className="w-[800px] shadow-lg">
      <CardHeader>
        <CardTitle>Graduation Card Designer</CardTitle>
        <CardDescription>Customize your graduation card</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="recipient-name">Recipient's Name</Label>
          <Input
            id="recipient-name"
            placeholder="Enter graduate's name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="personal-message">Personal Message (Optional)</Label>
          <Textarea
            id="personal-message"
            placeholder="Add a personal congratulatory message"
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="optional-note">Additional Note (Optional)</Label>
          <Textarea
            id="optional-note"
            placeholder="Add any additional note or memory"
            value={optionalNote}
            onChange={(e) => setOptionalNote(e.target.value)}
            rows={2}
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <div className="space-y-4">
            <img
              src="/images/trump-graduation.jpg"
              alt="Graduation Card"
              className="mx-auto max-w-full h-48 object-contain rounded"
            />
            <div className="space-y-2">
              {recipientName && <p className="text-lg font-semibold">Dear {recipientName},</p>}
              <p className="text-gray-700">{message || "Your graduation message will appear here..."}</p>
              {personalMessage && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm italic text-gray-600">{personalMessage}</p>
                </div>
              )}
              {optionalNote && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">{optionalNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSave(cardData)}>Save Card</Button>
      </CardFooter>
    </Card>
  )
}

export default GraduationCardDesigner

// Add named export for the component
export { GraduationCardDesigner }
