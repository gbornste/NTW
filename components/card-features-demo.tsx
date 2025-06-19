"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DemoCardPreview } from "./demo-card-preview"

export function CardFeaturesDemo() {
  const [recipientName, setRecipientName] = useState("John Smith")
  const [message, setMessage] = useState("Wishing you a wonderful day filled with joy and happiness!")
  const [personalMessage, setPersonalMessage] = useState("Hope to see you soon at the family gathering.")
  const [optionalNote, setOptionalNote] = useState("P.S. Don't forget to bring your favorite dessert!")

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto p-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Demo Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="demo-recipient">Recipient's Name</Label>
            <Input
              id="demo-recipient"
              placeholder="Enter recipient's name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <p className="text-xs text-gray-500">Will appear as "Dear [Name]," on the card</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="demo-message">Main Message</Label>
            <Textarea
              id="demo-message"
              placeholder="Enter your main card message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="demo-personal">Personal Message</Label>
            <Textarea
              id="demo-personal"
              placeholder="Add a personal message (appears at bottom of card)"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="demo-note">Additional Note</Label>
            <Textarea
              id="demo-note"
              placeholder="Add an optional note (appears below personal message)"
              value={optionalNote}
              onChange={(e) => setOptionalNote(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live Card Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <DemoCardPreview
            recipientName={recipientName}
            message={message}
            personalMessage={personalMessage}
            optionalNote={optionalNote}
            senderName="Demo User"
          />
        </CardContent>
      </Card>
    </div>
  )
}
