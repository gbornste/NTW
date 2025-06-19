"use client"

import { useState } from "react"

export function TemplateCard({ template, isSelected, onClick }) {
  const [imageStatus, setImageStatus] = useState("loading")
  const [imageError, setImageError] = useState(false)
  const [loadTimeout, setLoadTimeout] = useState(false)

  // ... (rest of the TemplateCard logic)

  return (
    // ... (JSX for rendering the template card)
  )
}
