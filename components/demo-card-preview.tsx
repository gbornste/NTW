"use client"

interface DemoCardPreviewProps {
  recipientName?: string
  message?: string
  personalMessage?: string
  optionalNote?: string
  templateImage?: string
  templateName?: string
  senderName?: string
}

export function DemoCardPreview({
  recipientName = "John Smith",
  message = "Wishing you a wonderful day filled with joy and happiness!",
  personalMessage = "Hope to see you soon at the family gathering.",
  optionalNote = "P.S. Don't forget to bring your favorite dessert!",
  templateImage = "/placeholder.svg?height=200&width=300&text=Demo+Card",
  templateName = "Demo Holiday Card",
  senderName = "Demo User",
}: DemoCardPreviewProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="bg-blue-600 text-white p-4 text-center">
          <h3 className="text-lg font-semibold">NoTrumpNWay Greeting Card</h3>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Recipient Name */}
          <div className="text-left">
            <p className="text-lg font-semibold text-gray-800">Dear {recipientName},</p>
          </div>

          {/* Main Message */}
          <div className="text-center">
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>

          {/* Card Image */}
          {templateImage && (
            <div className="text-center">
              <img
                src={templateImage || "/placeholder.svg"}
                alt={templateName || "Card Template"}
                className="mx-auto max-w-full h-32 object-contain rounded border"
              />
              <p className="text-xs text-gray-500 mt-2 italic">Template: {templateName}</p>
            </div>
          )}

          {/* Personal Message at bottom */}
          {personalMessage && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm italic text-gray-600 text-center">{personalMessage}</p>
            </div>
          )}

          {/* Optional Note underneath personal message */}
          {optionalNote && (
            <div className="border-t border-gray-100 pt-3 mt-3">
              <p className="text-xs text-gray-500 text-center">{optionalNote}</p>
            </div>
          )}

          {/* Sender Signature */}
          <div className="text-right mt-6">
            <p className="text-sm italic text-gray-600">
              With best wishes,
              <br />
              <span className="font-semibold">{senderName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
