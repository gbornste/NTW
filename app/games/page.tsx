import Link from "next/link"
import Image from "next/image"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Define a simple type for our games
type Game = {
  id: string
  title: string
  description: string
  image: string
  link: string
}

// Use a simple array of game objects instead of complex objects
const games: Game[] = [
  {
    id: "quiz",
    title: "Political Quiz",
    description: "Test your knowledge of political history and current events.",
    image: "/images/political-quiz.png",
    link: "/games/quiz",
  },
  {
    id: "word-scramble",
    title: "Word Scramble",
    description: "Unscramble political terms and phrases against the clock.",
    image: "/images/word-scramble.png",
    link: "/games/word-scramble",
  },
  {
    id: "memory",
    title: "Memory Match",
    description: "Match pairs of political figures and symbols in this memory game.",
    image: "/images/memory-match.png",
    link: "/games/memory",
  },
  {
    id: "trivia",
    title: "Political Trivia",
    description: "Challenge your friends with political trivia questions.",
    image: "/images/political-trivia.png",
    link: "/games/trivia",
  },
]

export default function GamesPage() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Political Games</h1>
        <p className="text-muted-foreground max-w-[700px]">
          Have fun with our collection of political games. Challenge your friends and test your knowledge!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="overflow-hidden">
            <div className="w-full h-48 bg-muted relative">
              <Image
                src={game.image || "/placeholder.svg"}
                alt={game.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={game.id === "quiz" || game.id === "word-scramble"}
              />
            </div>
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={game.link}>Play Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
