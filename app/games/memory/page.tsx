"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shuffle, Timer, RotateCcw } from "lucide-react"
import confetti from "canvas-confetti"

// Types for our game
type CardType = {
  id: number
  name: string
  image: string
  matched: boolean
  flipped: boolean
}

export default function MemoryGame() {
  // Game state
  const [cards, setCards] = useState<CardType[]>([])
  const [turns, setTurns] = useState(0)
  const [firstChoice, setFirstChoice] = useState<CardType | null>(null)
  const [secondChoice, setSecondChoice] = useState<CardType | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")

  // Card data - political figures and symbols with actual image paths
  const cardImages = [
    { name: "American Flag", image: "/american-flag.png" },
    { name: "White House", image: "/white-house.png" },
    { name: "Capitol Building", image: "/us-capitol-building.png" },
    { name: "Statue of Liberty", image: "/statue-of-liberty.png" },
    { name: "Liberty Bell", image: "/liberty-bell.png" },
    { name: "Presidential Seal", image: "/presidential-seal.png" },
    { name: "Uncle Sam", image: "/uncle-sam.png" },
    { name: "Bald Eagle", image: "/bald-eagle.png" },
    { name: "Democratic Donkey", image: "/democratic-donkey.png" },
    { name: "Republican Elephant", image: "/republican-elephant.png" },
    { name: "Supreme Court", image: "/supreme-court.png" },
    { name: "Constitution", image: "/constitution.png" },
  ]

  // Get number of pairs based on difficulty
  const getPairsCount = () => {
    switch (difficulty) {
      case "easy":
        return 6
      case "medium":
        return 8
      case "hard":
        return 12
      default:
        return 8
    }
  }

  // Shuffle cards
  const shuffleCards = () => {
    const pairsCount = getPairsCount()
    const selectedCards = cardImages.slice(0, pairsCount)

    // Create pairs and shuffle
    const cardPairs = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        matched: false,
        flipped: false,
      }))

    setFirstChoice(null)
    setSecondChoice(null)
    setCards(cardPairs)
    setTurns(0)
    setGameWon(false)
    setTimeElapsed(0)
    setGameStarted(true)
  }

  // Handle card selection
  const handleChoice = (card: CardType) => {
    if (disabled) return

    // Flip the selected card
    setCards((prevCards) => prevCards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)))

    firstChoice ? setSecondChoice(card) : setFirstChoice(card)
  }

  // Check for matches
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true)

      if (firstChoice.name === secondChoice.name) {
        // Match found
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.name === firstChoice.name) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        // No match
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstChoice.id || card.id === secondChoice.id ? { ...card, flipped: false } : card,
            ),
          )
          resetTurn()
        }, 1000)
      }
    }
  }, [firstChoice, secondChoice])

  // Check if all pairs are matched
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setGameWon(true)
      setGameStarted(false)
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [cards])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [gameStarted, gameWon])

  // Reset choices and increment turn
  const resetTurn = () => {
    setFirstChoice(null)
    setSecondChoice(null)
    setTurns((prevTurns) => prevTurns + 1)
    setDisabled(false)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Preload images to prevent blank cards
  useEffect(() => {
    cardImages.forEach((card) => {
      const img = new Image()
      img.src = card.image
    })
  }, [])

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-8">
        {/* Game title with graphic */}
        <div className="w-full max-w-md mb-4">
          <img src="/images/memory-match.png" alt="Memory Match" className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <p className="text-muted-foreground max-w-[700px] mb-4">
          Test your memory by matching pairs of political symbols and icons. Find all pairs to win!
        </p>

        {/* Game controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              onClick={shuffleCards}
              className="flex items-center gap-2"
              variant={gameStarted ? "outline" : "default"}
            >
              <Shuffle className="h-4 w-4" />
              {gameStarted ? "Restart Game" : "Start Game"}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 rounded-md border border-input bg-background"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
              disabled={gameStarted}
            >
              <option value="easy">Easy (6 pairs)</option>
              <option value="medium">Medium (8 pairs)</option>
              <option value="hard">Hard (12 pairs)</option>
            </select>
          </div>
        </div>

        {/* Game stats */}
        {gameStarted || gameWon ? (
          <div className="flex flex-wrap gap-6 justify-center mb-6">
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
              <Timer className="h-4 w-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
              <RotateCcw className="h-4 w-4" />
              <span>{turns} Turns</span>
            </div>
          </div>
        ) : null}

        {/* Win message */}
        {gameWon && (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-lg mb-6 animate-bounce">
            <h2 className="text-xl font-bold">Congratulations!</h2>
            <p>
              You matched all pairs in {turns} turns and {formatTime(timeElapsed)}!
            </p>
          </div>
        )}
      </div>

      {/* Game board */}
      {cards.length > 0 ? (
        <div
          className={`grid gap-4 mx-auto max-w-4xl justify-center ${
            difficulty === "easy"
              ? "grid-cols-3 sm:grid-cols-4"
              : difficulty === "medium"
                ? "grid-cols-3 sm:grid-cols-4"
                : "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
          }`}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative cursor-pointer h-[100px] sm:h-[120px] w-full perspective-500 transition-transform ${
                card.matched ? "opacity-70" : ""
              }`}
              onClick={() => !card.flipped && !card.matched && handleChoice(card)}
            >
              <div
                className={`absolute inset-0 w-full h-full transition-all duration-500 preserve-3d ${
                  card.flipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Card back */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-red-500 rounded-lg border-2 border-white flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-white font-bold text-sm sm:text-base">Memory</span>
                  <span className="text-white font-bold text-sm sm:text-base">Match</span>
                </div>

                {/* Card front */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-lg border-2 border-gray-200 p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=100&width=100&query=" + encodeURIComponent(card.name)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-muted rounded-lg max-w-md mx-auto">
          <p>Select a difficulty level and click "Start Game" to begin!</p>
        </div>
      )}
    </div>
  )
}
