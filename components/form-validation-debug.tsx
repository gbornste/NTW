"use client"

interface FormValidationDebugProps {
  recipientName: string
  recipientEmail: string
  cardMessage: string
  isAuthenticated: boolean
  isSending: boolean
}

export function FormValidationDebug({
  recipientName,
  recipientEmail,
  cardMessage,
  isAuthenticated,
  isSending,
}: FormValidationDebugProps) {
  if (process.env.NODE_ENV === "production") {
    return null
  }

  const validations = [
    {
      label: "Recipient Name",
      value: recipientName,
      isValid: !!recipientName?.trim(),
      requirement: "Must not be empty",
    },
    {
      label: "Recipient Email",
      value: recipientEmail,
      isValid: !!recipientEmail?.trim() && recipientEmail.includes("@"),
      requirement: "Must be valid email format",
    },
    {
      label: "Card Message",
      value: cardMessage,
      isValid: !!cardMessage?.trim(),
      requirement: "Must not be empty",
    },
    {
      label: "Authentication",
      value: isAuthenticated ? "Logged in" : "Not logged in",
      isValid: isAuthenticated,
      requirement: "Must be logged in",
    },
    {
      label: "Send Status",
      value: isSending ? "Sending..." : "Ready",
      isValid: !isSending,
      requirement: "Must not be currently sending",
    },
  ]

  const allValid = validations.every((v) => v.isValid)

  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h4 className="font-medium text-yellow-800 mb-2">🔍 Form Validation Debug</h4>
      <div className="space-y-2">
        {validations.map((validation, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className={validation.isValid ? "text-green-600" : "text-red-600"}>
              {validation.isValid ? "✅" : "❌"}
            </span>
            <span className="font-medium">{validation.label}:</span>
            <span className="text-gray-600">
              "{validation.value}" ({validation.requirement})
            </span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-yellow-200">
          <div className="flex items-center gap-2">
            <span className={allValid ? "text-green-600" : "text-red-600"}>{allValid ? "✅" : "❌"}</span>
            <span className="font-medium">Button Should Be: {allValid ? "ENABLED" : "DISABLED"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
