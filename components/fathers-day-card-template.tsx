"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Download, RotateCcw } from "lucide-react"
import Image from "next/image"

interface FathersDayCardProps {
  recipientName?: string
  personalMessage?: string
  fontStyle?: string
  isDemo?: boolean
}

export function FathersDayCardTemplate({
  recipientName = "",
  personalMessage = "",
  fontStyle = "arial",
  isDemo = false,
}: FathersDayCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const getFontClass = (font: string) => {
    switch (font) {
      case "times":
        return "font-serif"
      case "comic":
        return "font-mono"
      case "impact":
        return "font-bold tracking-wide"
      default:
        return "font-sans"
    }
  }

  const fathersDayMessages = [
    "Happy Father's Day! Here's to celebrating dads who actually show up for their kids, don't abandon them for golf, and know their names without a teleprompter.",
    "To a dad who shows real leadership - not the kind that involves throwing tantrums when things don't go your way!",
    "Happy Father's Day to someone who teaches their kids values, not how to avoid paying taxes!",
    "Celebrating a father who builds his children up instead of building walls between families!",
    "To a dad who sets a good example - unlike some people who think 'family values' means using your kids as political props!",
  ]

  const randomMessage = fathersDayMessages[Math.floor(Math.random() * fathersDayMessages.length)]

  return (
    <div className="max-w-md mx-auto">
      <div className="relative">
        <div
          className={`transition-transform duration-700 ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of Card */}
          <div className={`${isFlipped ? "[transform:rotateY(180deg)]" : ""} [backface-visibility:hidden]`}>
            <Card className="w-full shadow-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-orange-50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-center py-4">
                <h3 className="text-lg font-bold">Father's Day Special</h3>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Anti-Trump Edition
                </Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-4 min-h-[500px] flex flex-col">
                {/* Recipient Name */}
                {recipientName && (
                  <div className="text-left">
                    <p className={`text-lg font-semibold text-gray-800 ${getFontClass(fontStyle)}`}>
                      Dear {recipientName},
                    </p>
                  </div>
                )}

                {/* Father's Day Image */}
                <div className="flex justify-center my-4">
                  <div className="relative w-64 h-48 rounded-lg overflow-hidden border-2 border-orange-200 shadow-lg">
                    <Image
                      src="/images/trump-fathers-day.jpg"
                      alt="Father's Day cartoon"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=192&width=256&text=Fathers+Day+Image"
                      }}
                    />
                  </div>
                </div>

                {/* Main Message */}
                <div className="flex-grow flex items-center justify-center">
                  <p className={`text-center leading-relaxed text-gray-700 px-2 ${getFontClass(fontStyle)}`}>
                    {randomMessage}
                  </p>
                </div>

                {/* Personal Message */}
                {personalMessage && (
                  <div className="border-t border-orange-200 pt-4 mt-4">
                    <p className={`text-sm italic text-gray-600 text-center ${getFontClass(fontStyle)}`}>
                      {personalMessage}
                    </p>
                  </div>
                )}

                {/* Father's Day specific footer */}
                <div className="text-center mt-auto">
                  <p className="text-xs text-orange-600 font-medium mb-2">
                    "Real dads don't need to make everything about themselves"
                  </p>
                  <Image
                    src="/images/logo.png"
                    alt="NoTrumpNWay"
                    width={120}
                    height={32}
                    className="mx-auto"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=32&width=120&text=NoTrumpNWay"
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back of Card */}
          <div
            className={`absolute inset-0 ${isFlipped ? "" : "[transform:rotateY(180deg)]"} [backface-visibility:hidden]`}
          >
            <Card className="w-full shadow-xl border-2 border-blue-200 h-full bg-gradient-to-br from-orange-50 to-blue-50">
              <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center space-y-4">
                <div className="text-gray-700">
                  <h4 className="font-bold text-lg mb-3 text-orange-600">Father's Day Facts</h4>
                  <div className="space-y-2 text-sm">
                    <p>✓ Good dads listen to their children</p>
                    <p>✓ Good dads teach by example</p>
                    <p>✓ Good dads put family before ego</p>
                    <p>✓ Good dads don't tweet insults at 3 AM</p>
                    <p>✓ Good dads know their kids' birthdays</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mt-4">
                  <p>Created with NoTrumpNWay</p>
                  <p>Father's Day Edition</p>
                  <p>For dads who actually deserve the title</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button variant="outline" size="sm" className="mt-4 mx-auto block" onClick={() => setIsFlipped(!isFlipped)}>
          <RotateCcw className="h-4 w-4 mr-2" />
          {isFlipped ? "Show Front" : "Show Back"}
        </Button>
      </div>

      {/* Action buttons for demo */}
      {isDemo && (
        <div className="mt-4 flex gap-2 justify-center">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Like
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      )}
    </div>
  )
}
