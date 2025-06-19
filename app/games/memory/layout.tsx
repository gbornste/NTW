import type React from "react"
import "../../../app/globals.css"
import "./styles.css"

export default function MemoryGameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
