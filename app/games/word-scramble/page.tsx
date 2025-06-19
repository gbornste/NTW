"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Trophy, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

// List of Trump-related words for the game
const WORDS = [
  "DEPORTATION",
  "TARIFF",
  "HUGE",
  "TREMENDOUS",
  "DISASTER",
  "LOSER",
  "WINNING",
  "GREATEST",
  "WALL",
  "AMERICA",
  "FAKE",
  "BILLIONS",
  "DEAL",
  "CHINA",
  "BEAUTIFUL",
  "BORDER",
  "MAGA",
  "HOAX",
  "BIGLY",
  "COVFEFE",
]

// Function to shuffle a string
function shuffleWord(word: string): string {
  const array = word.split("")
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.join("")
}

// Function to ensure the shuffled word is different from the original
function getShuffledWord(word: string): string {
  let shuffled = shuffleWord(word)
  // Make sure the shuffled word is different from the original
  while (shuffled === word && word.length > 1) {
    shuffled = shuffleWord(word)
  }
  return shuffled
}

export default function WordScramblePage() {
  const { toast } = useToast()
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [shuffledWord, setShuffledWord] = useState("")
  const [userGuess, setUserGuess] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds game
  const [correctWords, setCorrectWords] = useState<string[]>([])
  const [incorrectWords, setIncorrectWords] = useState<string[]>([])
  const [skippedWords, setSkippedWords] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Shuffle the words array once when the component mounts
  const [gameWords, setGameWords] = useState<string[]>([])

  useEffect(() => {
    // Shuffle the words array to randomize the order
    const shuffledWords = [...WORDS].sort(() => Math.random() - 0.5)
    setGameWords(shuffledWords)
  }, [])

  // Start the game
  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setCurrentWordIndex(0)
    setScore(0)
    setTimeLeft(60)
    setCorrectWords([])
    setIncorrectWords([])
    setSkippedWords([])

    // Set the first shuffled word
    if (gameWords.length > 0) {
      setShuffledWord(getShuffledWord(gameWords[0]))
      setUserGuess("")
    }

    // Focus on the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameStarted) {
      endGame()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameStarted, gameOver, timeLeft])

  // End the game
  const endGame = () => {
    setGameStarted(false)
    setGameOver(true)
    toast({
      title: "Game Over!",
      description: `Your final score is ${score} points.`,
    })
  }

  // Check the user's guess
  const checkGuess = () => {
    const currentWord = gameWords[currentWordIndex]

    if (userGuess.toUpperCase() === currentWord) {
      // Correct guess
      setScore((prev) => prev + 10)
      setCorrectWords((prev) => [...prev, currentWord])
      toast({
        title: "Correct!",
        description: `+10 points`,
        variant: "default",
      })
    } else {
      // Incorrect guess
      setIncorrectWords((prev) => [...prev, currentWord])
      toast({
        title: "Incorrect!",
        description: `The correct word was ${currentWord}`,
        variant: "destructive",
      })
    }

    moveToNextWord()
  }

  // Skip the current word
  const skipWord = () => {
    const currentWord = gameWords[currentWordIndex]
    setSkippedWords((prev) => [...prev, currentWord])
    toast({
      title: "Word Skipped",
      description: `The word was ${currentWord}`,
    })
    moveToNextWord()
  }

  // Move to the next word
  const moveToNextWord = () => {
    if (currentWordIndex < gameWords.length - 1) {
      const nextIndex = currentWordIndex + 1
      setCurrentWordIndex(nextIndex)
      setShuffledWord(getShuffledWord(gameWords[nextIndex]))
      setUserGuess("")

      // Focus on the input field
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else {
      // No more words, end the game
      endGame()
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    checkGuess()
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/games">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Political Word Scramble</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {!gameStarted && !gameOver ? (
          <Card>
            <CardHeader>
              <CardTitle>Word Scramble Challenge</CardTitle>
              <CardDescription>
                Unscramble Trump-related words as quickly as you can. You have 60 seconds!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In this game, you'll be presented with scrambled words related to Trump and politics. Your goal is to
                unscramble as many words as possible within the time limit.
              </p>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">How to Play:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Each word will be shown with its letters scrambled</li>
                  <li>Type the correct unscrambled word in the input field</li>
                  <li>Press "Submit" or hit Enter to check your answer</li>
                  <li>You can skip difficult words, but you won't earn points</li>
                  <li>Each correct answer is worth 10 points</li>
                  <li>Try to get the highest score before time runs out!</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startGame} size="lg" className="w-full">
                Start Game
              </Button>
            </CardFooter>
          </Card>
        ) : gameOver ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                Game Over - Final Score: {score}
              </CardTitle>
              <CardDescription>
                You unscrambled {correctWords.length} out of{" "}
                {correctWords.length + incorrectWords.length + skippedWords.length} words.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Words You Got Right ({correctWords.length}):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {correctWords.map((word, index) => (
                    <Badge key={index} variant="outline" className="bg-green-100">
                      {word}
                    </Badge>
                  ))}
                  {correctWords.length === 0 && <span className="text-muted-foreground text-sm">None</span>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <XCircle className="mr-2 h-5 w-5 text-red-500" />
                  Words You Missed ({incorrectWords.length}):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {incorrectWords.map((word, index) => (
                    <Badge key={index} variant="outline" className="bg-red-100">
                      {word}
                    </Badge>
                  ))}
                  {incorrectWords.length === 0 && <span className="text-muted-foreground text-sm">None</span>}
                </div>
              </div>

              {skippedWords.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Words You Skipped ({skippedWords.length}):</h3>
                  <div className="flex flex-wrap gap-2">
                    {skippedWords.map((word, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button onClick={startGame} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/games">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Games
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Unscramble the Word</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Trophy className="mr-1 h-5 w-5 text-yellow-500" />
                    <span className="font-bold">{score}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-5 w-5 text-blue-500" />
                    <span className="font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
              <Progress value={(timeLeft / 60) * 100} className="h-2" />
              <CardDescription>
                Word {currentWordIndex + 1} of {gameWords.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold tracking-wider mb-2 py-4">{shuffledWord}</div>
                <p className="text-sm text-muted-foreground">Hint: Trump-related political term</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your answer here..."
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    className="text-center text-lg"
                    autoComplete="off"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Submit
                  </Button>
                  <Button type="button" variant="outline" onClick={skipWord} className="flex-1">
                    Skip
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
