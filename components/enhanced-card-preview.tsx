"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  Send,
  Download,
  Share2,
  Heart,
  Star,
  Calendar,
  User,
  Mail,
  MessageSquare,
  Palette,
  Type,
  ImageIcon,
  RotateCcw,
} from "lucide-react"
import Image from "next/image"

interface CardData {
  template: any
  message: string
  templateName: string
  templateImage: string
  recipientName: string
  personalMessage: string
  optionalNote: string
  cardType: string
  fontStyle: string
}

interface EnhancedCardPreviewProps {
  cardData: CardData
  isDemo?: boolean
  onSend?: () => void
  onUpdate?: () => void
  onSave?: () => void
}

export function EnhancedCardPreview({ cardData, isDemo = false, onSend, onUpdate, onSave }: EnhancedCardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [previewMode, setPreviewMode] = useState<"card" | "email" | "print">("card")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset image states when template changes
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [cardData.templateImage])

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

  const getCardStats = () => {
    const messageLength = cardData.message?.length || 0
    const wordCount = cardData.message?.split(/\s+/).filter((word) => word.length > 0).length || 0
    const hasPersonalMessage = !!cardData.personalMessage?.trim()
    const hasOptionalNote = !!cardData.optionalNote?.trim()
    const hasRecipient = !!cardData.recipientName?.trim()

    return {
      messageLength,
      wordCount,
      hasPersonalMessage,
      hasOptionalNote,
      hasRecipient,
      completeness: Math.round(
        ((messageLength > 0 ? 30 : 0) +
          (hasRecipient ? 20 : 0) +
          (hasPersonalMessage ? 25 : 0) +
          (hasOptionalNote ? 25 : 0)) *
          1,
      ),
    }
  }

  const stats = getCardStats()

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoaded(false)
    setImageError(true)
  }

  // Safe fallback for card data
  const safeCardData = {
    templateName: cardData?.templateName || "Custom Card",
    templateImage: cardData?.templateImage || "/placeholder.svg?height=300&width=300&text=Card+Image",
    message: cardData?.message || "",
    recipientName: cardData?.recipientName || "",
    personalMessage: cardData?.personalMessage || "",
    optionalNote: cardData?.optionalNote || "",
    cardType: cardData?.cardType || "general",
    fontStyle: cardData?.fontStyle || "arial",
  }

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Card Preview</h2>
          {isDemo && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Demo Mode
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={previewMode === "card" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("card")}
          >
            Card View
          </Button>
          <Button
            variant={previewMode === "email" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("email")}
          >
            Email View
          </Button>
          <Button
            variant={previewMode === "print" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("print")}
          >
            Print View
          </Button>
        </div>
      </div>

      {/* Card Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.messageLength}</div>
          <div className="text-xs text-gray-600">Characters</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.wordCount}</div>
          <div className="text-xs text-gray-600">Words</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.completeness}%</div>
          <div className="text-xs text-gray-600">Complete</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 capitalize">{safeCardData.cardType}</div>
          <div className="text-xs text-gray-600">Type</div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Card Preview */}
        <div className="flex-1">
          {previewMode === "card" && (
            <div className="relative">
              <div
                className={`transition-transform duration-700 ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of Card */}
                <div className={`${isFlipped ? "[transform:rotateY(180deg)]" : ""} [backface-visibility:hidden]`}>
                  <Card className="w-full max-w-md mx-auto shadow-xl border-2 border-gray-200">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-4">
                      <h3 className="text-lg font-semibold">NoTrumpNWay Greeting Card</h3>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {safeCardData.templateName}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4 min-h-[400px] flex flex-col">
                      {/* Recipient Name */}
                      {safeCardData.recipientName && (
                        <div className="text-left">
                          <p className={`text-lg font-semibold text-gray-800 ${getFontClass(safeCardData.fontStyle)}`}>
                            Dear {safeCardData.recipientName},
                          </p>
                        </div>
                      )}

                      {/* Card Image */}
                      <div className="flex justify-center my-4">
                        <div className="relative w-48 h-36 rounded-lg overflow-hidden border shadow-md bg-gray-100">
                          <Image
                            src={safeCardData.templateImage || "/placeholder.svg"}
                            alt={safeCardData.templateName}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                              imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            sizes="(max-width: 768px) 100vw, 192px"
                          />
                          {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                          )}
                          {imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                              <div className="text-center p-2">
                                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-500">Image unavailable</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Main Message */}
                      <div className="flex-grow flex items-center justify-center">
                        <p
                          className={`text-center leading-relaxed text-gray-700 px-2 ${getFontClass(safeCardData.fontStyle)}`}
                        >
                          {safeCardData.message || "Your message will appear here..."}
                        </p>
                      </div>

                      {/* Personal Message */}
                      {safeCardData.personalMessage && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <p
                            className={`text-sm italic text-gray-600 text-center ${getFontClass(safeCardData.fontStyle)}`}
                          >
                            {safeCardData.personalMessage}
                          </p>
                        </div>
                      )}

                      {/* Optional Note */}
                      {safeCardData.optionalNote && (
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <p className={`text-xs text-gray-500 text-center ${getFontClass(safeCardData.fontStyle)}`}>
                            {safeCardData.optionalNote}
                          </p>
                        </div>
                      )}

                      {/* Logo */}
                      <div className="text-center mt-auto">
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
                  <Card className="w-full max-w-md mx-auto shadow-xl border-2 border-gray-200 h-full">
                    <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center space-y-4">
                      <div className="text-gray-600">
                        <h4 className="font-semibold mb-2">Created with NoTrumpNWay</h4>
                        <p className="text-sm">Political greeting cards that make a statement</p>
                        <p className="text-xs mt-2">Visit: notrumpnway.com</p>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>Card ID: {`card_${Date.now().toString().slice(-6)}`}</p>
                        <p>Created: {new Date().toLocaleDateString()}</p>
                        <p>Type: {safeCardData.cardType}</p>
                        <p>Font: {safeCardData.fontStyle}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 mx-auto block"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {isFlipped ? "Show Front" : "Show Back"}
              </Button>
            </div>
          )}

          {previewMode === "email" && (
            <div className="bg-white border rounded-lg shadow-lg max-w-2xl mx-auto">
              <div className="bg-gray-100 p-4 border-b">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>Email Preview</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-b pb-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>To:</strong> {safeCardData.recipientName || "Recipient"} &lt;recipient@example.com&gt;
                    </p>
                    <p>
                      <strong>From:</strong> NoTrumpNWay Cards &lt;cards@notrumpnway.com&gt;
                    </p>
                    <p>
                      <strong>Subject:</strong> You've received a {safeCardData.templateName} card!
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p>Hello {safeCardData.recipientName || "Friend"}!</p>
                  <p>You've received a special {safeCardData.templateName.toLowerCase()} card!</p>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className={`italic ${getFontClass(safeCardData.fontStyle)}`}>
                      "{safeCardData.message || "Your message will appear here..."}"
                    </p>
                  </div>
                  {safeCardData.personalMessage && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm">
                        <strong>Personal message:</strong>
                      </p>
                      <p className="text-sm italic">{safeCardData.personalMessage}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">
                    This card was created with love using NoTrumpNWay's greeting card creator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {previewMode === "print" && (
            <div className="bg-white border rounded-lg shadow-lg max-w-md mx-auto">
              <div className="p-8 space-y-6" style={{ aspectRatio: "5/7" }}>
                <div className="text-center border-b pb-4">
                  <h3 className="text-xl font-bold">{safeCardData.templateName}</h3>
                  <p className="text-sm text-gray-600">NoTrumpNWay Greeting Card</p>
                </div>

                <div className="space-y-4">
                  {safeCardData.recipientName && (
                    <p className={`${getFontClass(safeCardData.fontStyle)}`}>Dear {safeCardData.recipientName},</p>
                  )}

                  <div className="text-center">
                    <Image
                      src={safeCardData.templateImage || "/placeholder.svg"}
                      alt={safeCardData.templateName}
                      width={120}
                      height={90}
                      className="mx-auto rounded border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=90&width=120&text=Image"
                      }}
                    />
                  </div>

                  <p className={`text-center leading-relaxed ${getFontClass(safeCardData.fontStyle)}`}>
                    {safeCardData.message || "Your message will appear here..."}
                  </p>

                  {safeCardData.personalMessage && (
                    <div className="border-t pt-3 mt-4">
                      <p className={`text-sm italic text-center ${getFontClass(safeCardData.fontStyle)}`}>
                        {safeCardData.personalMessage}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center text-xs text-gray-500 mt-auto">
                  <p>Created with NoTrumpNWay</p>
                  <p>notrumpnway.com</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Details Panel */}
        <div className="w-full lg:w-80 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Card Details
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Template:</span>
                <span className="font-medium">{safeCardData.templateName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <Badge variant="outline" className="capitalize">
                  {safeCardData.cardType}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Font:</span>
                <span className="font-medium capitalize">{safeCardData.fontStyle}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Recipient:</span>
                <span className="font-medium">{safeCardData.recipientName || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Message Length:</span>
                <span className="font-medium">{stats.messageLength} chars</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completeness:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completeness}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{stats.completeness}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isDemo ? (
              <Alert>
                <Star className="h-4 w-4" />
                <AlertDescription>This is a demo preview. Login to send real cards!</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={onSend}
                  className="w-full flex items-center gap-2"
                  disabled={!safeCardData.message?.trim()}
                >
                  <Send className="h-4 w-4" />
                  Send Card
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={onUpdate} className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Update
                  </Button>
                  <Button variant="outline" onClick={onSave} className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Card Features */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-sm">Card Features</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <ImageIcon className="h-3 w-3 text-green-600" />
                <span>Custom Image</span>
                {imageError && <span className="text-red-500 text-xs">(Error loading)</span>}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Type className="h-3 w-3 text-blue-600" />
                <span>Custom Font ({safeCardData.fontStyle})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-3 w-3 text-purple-600" />
                <span>Personalized</span>
                {stats.hasRecipient && <span className="text-green-500 text-xs">✓</span>}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3 text-orange-600" />
                <span>Instant Delivery</span>
              </div>
            </CardContent>
          </Card>

          {/* Debug Info for Demo */}
          {isDemo && process.env.NODE_ENV !== "production" && (
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-sm text-blue-600">Debug Info</h3>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <p>
                  <strong>Mode:</strong> Demo
                </p>
                <p>
                  <strong>Template ID:</strong> {cardData?.template?.id || "N/A"}
                </p>
                <p>
                  <strong>Message Length:</strong> {stats.messageLength}
                </p>
                <p>
                  <strong>Image Loaded:</strong> {imageLoaded ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Image Error:</strong> {imageError ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Preview Mode:</strong> {previewMode}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
