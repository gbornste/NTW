import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function CreateCardPage() {
  const templates = [
    {
      id: "birthday",
      name: "Birthday",
      image: "/images/trump-underwear.png",
      description: "Anti-Trump birthday cards with humorous messages",
      href: "/create-card/birthday",
    },
    {
      id: "fathers-day",
      name: "Father's Day",
      image: "/images/trump-fathers-day.jpg",
      description: "Mock Trump's parenting with these Father's Day cards",
      href: "/create-card/fathers-day",
    },
    {
      id: "holiday",
      name: "Holiday",
      image: "/political-holiday-card.png",
      description: "Political holiday cards with anti-Trump themes",
      href: "/create-card/holiday",
    },
    {
      id: "graduation",
      name: "Graduation",
      image: "/images/trump-graduation.jpg",
      description: "Celebrate real achievements with anti-Trump graduation cards",
      href: "/create-card/graduation",
    },
    {
      id: "congratulations",
      name: "Congratulations",
      image: "/images/Donald-Trump-Recount.jpg",
      description: "Who needs a recount for real congratulations?",
      href: "/create-card/congratulations",
    },
    {
      id: "thank-you",
      name: "Thank You",
      image: "/images/trump-qatar-plane.png",
      description: "Express gratitude with a political twist",
      href: "/create-card/thank-you",
    },
    {
      id: "fourth-of-july",
      name: "4th of July",
      image: "/images/Trump 4th of July.png",
      description: "How patriotic, Independence Day",
      href: "/create-card/fourth-of-july",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Anti-Trump Cards</h1>
        <p className="text-muted-foreground">Select a template to get started</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Link href={template.href} key={template.id}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image src={template.image || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
