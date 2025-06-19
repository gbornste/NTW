"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CardTemplateProps {
  id: number
  title: string
  image: string
  description: string
  slug: string
}

export function CardTemplate({ id, title, image, description, slug }: CardTemplateProps) {
  const router = useRouter()

  const handleSelect = () => {
    router.push(`/create-card/${slug}`)
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-all hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleSelect} className="w-full">
          Select Template
        </Button>
      </CardFooter>
    </Card>
  )
}
