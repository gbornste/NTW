"use client"

import { useState } from "react"

interface TemplateCardProps {
  template?: {
    name?: string
    description?: string
  }
  isSelected?: boolean
  onClick?: () => void
}

export function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  const [imageStatus, setImageStatus] = useState("loading")
  const [imageError, setImageError] = useState(false)
  const [loadTimeout, setLoadTimeout] = useState(false)

  // ... (rest of the TemplateCard logic)

  return (
    <div 
      className={`p-4 border rounded cursor-pointer transition-colors ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <h3 className="font-semibold mb-2">{template?.name || 'Template'}</h3>
      <p className="text-sm text-muted-foreground">{template?.description || 'Template description'}</p>
    </div>
  )
}
