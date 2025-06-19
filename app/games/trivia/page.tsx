"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy, Clock, CheckCircle, XCircle, RotateCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define trivia categories
type Category = "us-politics" | "world-leaders" | "political-history" | "government" | "current-events"

// Define trivia question structure
interface TriviaQuestion {
  id: number
  category: Category
  question: string
  options: string[]
  correctAnswer: string
  difficulty: "easy" | "medium" | "hard"
  explanation: string
}

// Trivia questions database
const triviaQuestions: TriviaQuestion[] = [
  // US Politics Category
  {
    id: 1,
    category: "us-politics",
    question: "Which U.S. President was impeached twice?",
    options: ["Bill Clinton", "Andrew Johnson", "Donald Trump", "Richard Nixon"],
    correctAnswer: "Donald Trump",
    difficulty: "easy",
    explanation:
      "Donald Trump was impeached by the House of Representatives twice: first in December 2019 and again in January 2021, making him the only U.S. President to be impeached twice.",
  },
  {
    id: 2,
    category: "us-politics",
    question: "What is the nickname for the presidential airplane?",
    options: ["Air Force One", "Marine One", "Executive One", "Presidential Eagle"],
    correctAnswer: "Air Force One",
    difficulty: "easy",
    explanation:
      "Air Force One is the official air traffic control call sign for a U.S. Air Force aircraft carrying the President of the United States.",
  },
  {
    id: 3,
    category: "us-politics",
    question: "How many U.S. Senators are there in total?",
    options: ["50", "100", "435", "538"],
    correctAnswer: "100",
    difficulty: "easy",
    explanation: "There are 100 U.S. Senators, with each of the 50 states electing two Senators to represent them.",
  },
  {
    id: 4,
    category: "us-politics",
    question: "Which amendment to the U.S. Constitution abolished slavery?",
    options: ["13th Amendment", "14th Amendment", "15th Amendment", "19th Amendment"],
    correctAnswer: "13th Amendment",
    difficulty: "medium",
    explanation:
      "The 13th Amendment, ratified in 1865, abolished slavery and involuntary servitude, except as punishment for a crime.",
  },
  {
    id: 5,
    category: "us-politics",
    question: "Who was the first woman to serve as Speaker of the House?",
    options: ["Hillary Clinton", "Nancy Pelosi", "Condoleezza Rice", "Elizabeth Warren"],
    correctAnswer: "Nancy Pelosi",
    difficulty: "medium",
    explanation:
      "Nancy Pelosi became the first woman to serve as Speaker of the House in 2007 and served until 2011, then again from 2019 to 2023.",
  },
  {
    id: 6,
    category: "us-politics",
    question: "Which political party is represented by a donkey?",
    options: ["Republican Party", "Democratic Party", "Green Party", "Libertarian Party"],
    correctAnswer: "Democratic Party",
    difficulty: "easy",
    explanation:
      "The donkey became associated with the Democratic Party during the 1828 presidential campaign of Andrew Jackson, whose opponents called him a 'jackass.'",
  },

  // World Leaders Category
  {
    id: 7,
    category: "world-leaders",
    question: "Who was the first female Prime Minister of the United Kingdom?",
    options: ["Theresa May", "Margaret Thatcher", "Angela Merkel", "Indira Gandhi"],
    correctAnswer: "Margaret Thatcher",
    difficulty: "easy",
    explanation:
      "Margaret Thatcher served as Prime Minister of the United Kingdom from 1979 to 1990, becoming the first woman to hold that office.",
  },
  {
    id: 8,
    category: "world-leaders",
    question: "Which country was Nelson Mandela the president of?",
    options: ["Nigeria", "Kenya", "South Africa", "Zimbabwe"],
    correctAnswer: "South Africa",
    difficulty: "easy",
    explanation: "Nelson Mandela was the President of South Africa from 1994 to 1999, following the end of apartheid.",
  },
  {
    id: 9,
    category: "world-leaders",
    question: "Who is the longest-serving current head of state in the world?",
    options: ["Queen Elizabeth II", "King Salman", "Paul Biya", "Teodoro Obiang"],
    correctAnswer: "Teodoro Obiang",
    difficulty: "hard",
    explanation:
      "Teodoro Obiang Nguema Mbasogo has been President of Equatorial Guinea since 1979, making him the longest-serving current head of state.",
  },
  {
    id: 10,
    category: "world-leaders",
    question: "Which leader is known for his 'Bolivarian Revolution'?",
    options: ["Fidel Castro", "Hugo Chávez", "Evo Morales", "Daniel Ortega"],
    correctAnswer: "Hugo Chávez",
    difficulty: "medium",
    explanation:
      "Hugo Chávez, President of Venezuela from 1999 until his death in 2013, led what he called the 'Bolivarian Revolution,' named after Simón Bolívar.",
  },
  {
    id: 11,
    category: "world-leaders",
    question: "Who was the first Chancellor of reunified Germany?",
    options: ["Helmut Kohl", "Angela Merkel", "Gerhard Schröder", "Helmut Schmidt"],
    correctAnswer: "Helmut Kohl",
    difficulty: "medium",
    explanation:
      "Helmut Kohl was Chancellor of West Germany from 1982 to 1990 and then of reunified Germany from 1990 to 1998.",
  },

  // Political History Category
  {
    id: 12,
    category: "political-history",
    question: "What was the name of the scandal that led to President Nixon's resignation?",
    options: ["Iran-Contra", "Teapot Dome", "Watergate", "Whitewater"],
    correctAnswer: "Watergate",
    difficulty: "easy",
    explanation:
      "The Watergate scandal began with the break-in at the Democratic National Committee headquarters in 1972 and eventually led to Nixon's resignation in 1974.",
  },
  {
    id: 13,
    category: "political-history",
    question: "Which U.S. President delivered the Gettysburg Address?",
    options: ["Thomas Jefferson", "Abraham Lincoln", "Andrew Jackson", "Ulysses S. Grant"],
    correctAnswer: "Abraham Lincoln",
    difficulty: "easy",
    explanation:
      "Abraham Lincoln delivered the Gettysburg Address on November 19, 1863, during the American Civil War.",
  },
  {
    id: 14,
    category: "political-history",
    question: "What was the name of the economic plan that helped rebuild Western Europe after World War II?",
    options: ["New Deal", "Marshall Plan", "Great Society", "NATO"],
    correctAnswer: "Marshall Plan",
    difficulty: "medium",
    explanation:
      "The Marshall Plan, named after Secretary of State George Marshall, provided economic assistance to Western Europe following World War II.",
  },
  {
    id: 15,
    category: "political-history",
    question: "Which treaty ended World War I?",
    options: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Westphalia", "Treaty of Tordesillas"],
    correctAnswer: "Treaty of Versailles",
    difficulty: "medium",
    explanation:
      "The Treaty of Versailles was signed on June 28, 1919, and officially ended World War I between Germany and the Allied Powers.",
  },
  {
    id: 16,
    category: "political-history",
    question: "What was the name of the period of tension between the Soviet Union and the United States?",
    options: ["Great Depression", "Cold War", "Great Recession", "World War III"],
    correctAnswer: "Cold War",
    difficulty: "easy",
    explanation:
      "The Cold War was a period of geopolitical tension between the Soviet Union and the United States and their respective allies from approximately 1947 to 1991.",
  },

  // Government Category
  {
    id: 17,
    category: "government",
    question: "How many branches of government exist in the United States?",
    options: ["Two", "Three", "Four", "Five"],
    correctAnswer: "Three",
    difficulty: "easy",
    explanation:
      "The U.S. government is divided into three branches: Executive (President), Legislative (Congress), and Judicial (Supreme Court and federal courts).",
  },
  {
    id: 18,
    category: "government",
    question: "What is the highest court in the United States?",
    options: ["District Court", "Court of Appeals", "Supreme Court", "International Court of Justice"],
    correctAnswer: "Supreme Court",
    difficulty: "easy",
    explanation:
      "The Supreme Court of the United States is the highest court in the federal judiciary and has ultimate appellate jurisdiction over all federal and state court cases.",
  },
  {
    id: 19,
    category: "government",
    question: "How many members are in the U.S. House of Representatives?",
    options: ["100", "435", "50", "538"],
    correctAnswer: "435",
    difficulty: "medium",
    explanation:
      "The U.S. House of Representatives has 435 voting members, with the number representing each state determined by population.",
  },
  {
    id: 20,
    category: "government",
    question: "What is the term length for a U.S. Senator?",
    options: ["2 years", "4 years", "6 years", "8 years"],
    correctAnswer: "6 years",
    difficulty: "easy",
    explanation:
      "U.S. Senators serve six-year terms, with about one-third of the Senate up for election every two years.",
  },
  {
    id: 21,
    category: "government",
    question: "Which document begins with 'We the People'?",
    options: ["Declaration of Independence", "Bill of Rights", "Constitution", "Emancipation Proclamation"],
    correctAnswer: "Constitution",
    difficulty: "easy",
    explanation:
      "The United States Constitution begins with the Preamble, which starts with the phrase 'We the People of the United States...'",
  },

  // Current Events Category
  {
    id: 22,
    category: "current-events",
    question: "Which country withdrew from the European Union in 2020?",
    options: ["France", "Germany", "United Kingdom", "Italy"],
    correctAnswer: "United Kingdom",
    difficulty: "easy",
    explanation:
      "The United Kingdom officially withdrew from the European Union on January 31, 2020, in what was commonly known as 'Brexit.'",
  },
  {
    id: 23,
    category: "current-events",
    question: "What is the name of the climate agreement signed in Paris in 2015?",
    options: ["Kyoto Protocol", "Paris Agreement", "Copenhagen Accord", "Montreal Protocol"],
    correctAnswer: "Paris Agreement",
    difficulty: "easy",
    explanation:
      "The Paris Agreement is an international treaty on climate change that was adopted in 2015 and aims to limit global warming.",
  },
  {
    id: 24,
    category: "current-events",
    question: "Which social movement gained prominence after the death of George Floyd in 2020?",
    options: ["Me Too", "Black Lives Matter", "Occupy Wall Street", "Tea Party"],
    correctAnswer: "Black Lives Matter",
    difficulty: "easy",
    explanation:
      "The Black Lives Matter movement gained significant momentum following the death of George Floyd during an arrest in Minneapolis in May 2020.",
  },
  {
    id: 25,
    category: "current-events",
    question: "What was the name of the pandemic that began in 2019?",
    options: ["SARS", "H1N1", "COVID-19", "Ebola"],
    correctAnswer: "COVID-19",
    difficulty: "easy",
    explanation:
      "COVID-19 (Coronavirus Disease 2019) was declared a pandemic by the World Health Organization in March 2020.",
  },
  {
    id: 26,
    category: "current-events",
    question: "Which country hosted the 2020 Summer Olympics (held in 2021)?",
    options: ["China", "Brazil", "Japan", "France"],
    correctAnswer: "Japan",
    difficulty: "easy",
    explanation: "Japan hosted the 2020 Summer Olympics, which were postponed to 2021 due to the COVID-19 pandemic.",
  },
]

// Category display information
const categoryInfo = {
  "us-politics": {
    name: "U.S. Politics",
    description: "Questions about American political figures, events, and systems",
    icon: "🇺🇸",
  },
  "world-leaders": {
    name: "World Leaders",
    description: "Questions about international political figures past and present",
    icon: "🌎",
  },
  "political-history": {
    name: "Political History",
    description: "Questions about significant political events throughout history",
    icon: "📜",
  },
  government: {
    name: "Government",
    description: "Questions about government structures, systems, and functions",
    icon: "⚖️",
  },
  "current-events": {
    name: "Current Events",
    description: "Questions about recent political developments and news",
    icon: "📰",
  },
}

export default function PoliticalTriviaPage() {
  const { toast } = useToast()
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20) // 20 seconds per question
  const [gameQuestions, setGameQuestions] = useState<TriviaQuestion[]>([])
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)

  // Get questions for the selected category
  const getQuestionsForCategory = (category: Category | "all") => {
    if (category === "all") {
      // Get 3 questions from each category for a total of 15 questions
      const questions: TriviaQuestion[] = []
      const categories: Category[] = [
        "us-politics",
        "world-leaders",
        "political-history",
        "government",
        "current-events",
      ]

      categories.forEach((cat) => {
        const categoryQuestions = triviaQuestions.filter((q) => q.category === cat)
        const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5)
        questions.push(...shuffled.slice(0, 3))
      })

      return questions.sort(() => Math.random() - 0.5)
    } else {
      // Get all questions for the specific category
      return triviaQuestions.filter((q) => q.category === category).sort(() => Math.random() - 0.5)
    }
  }

  // Start the game
  const startGame = (category: Category | "all") => {
    const questions = getQuestionsForCategory(category)
    setSelectedCategory(category)
    setGameQuestions(questions)
    setGameStarted(true)
    setGameOver(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswerSubmitted(false)
    setScore(0)
    setTimeLeft(20)
    setStreak(0)
    setLongestStreak(0)
    setQuestionsAnswered(0)
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameStarted && !gameOver && !answerSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !answerSubmitted && gameStarted) {
      // Time's up, auto-submit the current answer
      handleSubmitAnswer()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameStarted, gameOver, answerSubmitted, timeLeft])

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answer)
    }
  }

  // Submit the answer
  const handleSubmitAnswer = () => {
    if (answerSubmitted) return

    const currentQuestion = gameQuestions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    // Update score and streak
    if (isCorrect) {
      // Calculate points based on time left and difficulty
      let points = 10
      if (currentQuestion.difficulty === "medium") points = 20
      if (currentQuestion.difficulty === "hard") points = 30

      // Bonus points for answering quickly
      if (timeLeft > 15) points += 5
      else if (timeLeft > 10) points += 3
      else if (timeLeft > 5) points += 1

      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setLongestStreak((prev) => Math.max(prev, streak + 1))

      toast({
        title: "Correct!",
        description: `+${points} points! ${currentQuestion.explanation}`,
        variant: "default",
      })
    } else {
      setStreak(0)
      toast({
        title: "Incorrect!",
        description: `The correct answer was: ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`,
        variant: "destructive",
      })
    }

    setQuestionsAnswered((prev) => prev + 1)
    setAnswerSubmitted(true)
  }

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setAnswerSubmitted(false)
      setTimeLeft(20)
    } else {
      // Game completed
      setGameOver(true)
      toast({
        title: "Game Completed!",
        description: `Your final score is ${score} points.`,
      })
    }
  }

  // Get current question
  const currentQuestion = gameQuestions[currentQuestionIndex]

  // Calculate accuracy percentage
  const calculateAccuracy = () => {
    if (questionsAnswered === 0) return 0

    // Each correct answer is worth points based on difficulty (10, 20, or 30)
    // Plus potential time bonuses, so we can't simply divide score by 10
    // Instead, we'll use the questionsAnswered and the streak/score logic

    // Count correct answers based on the score history
    const correctAnswers = score > 0 ? Math.min(questionsAnswered, Math.ceil(score / 10)) : 0

    return Math.round((correctAnswers / questionsAnswered) * 100)
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/games">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Link>
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <img
              src="/images/political-trivia.png"
              alt="Political Trivia"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {!gameStarted && !gameOver ? (
          <Card>
            <CardHeader>
              <CardTitle>Test Your Political Knowledge</CardTitle>
              <CardDescription>
                Challenge yourself with trivia questions about politics, government, and current events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="us-politics">U.S. Politics</TabsTrigger>
                  <TabsTrigger value="world-leaders">World Leaders</TabsTrigger>
                  <TabsTrigger value="political-history">History</TabsTrigger>
                  <TabsTrigger value="government">Government</TabsTrigger>
                  <TabsTrigger value="current-events">Current Events</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-semibold mb-2">All Categories</h3>
                    <p>
                      Play with questions from all political categories. This mode includes 15 questions selected from
                      across all topics.
                    </p>
                  </div>
                  <Button onClick={() => startGame("all")} size="lg" className="w-full">
                    Start Game - All Categories
                  </Button>
                </TabsContent>

                {(
                  ["us-politics", "world-leaders", "political-history", "government", "current-events"] as Category[]
                ).map((category) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <span className="mr-2">{categoryInfo[category].icon}</span>
                        {categoryInfo[category].name}
                      </h3>
                      <p>{categoryInfo[category].description}</p>
                    </div>
                    <Button onClick={() => startGame(category)} size="lg" className="w-full">
                      Start Game - {categoryInfo[category].name}
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">How to Play:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Select a category or play with questions from all categories</li>
                  <li>You have 20 seconds to answer each question</li>
                  <li>Earn points based on difficulty and how quickly you answer</li>
                  <li>Build a streak by answering questions correctly in a row</li>
                  <li>Try to achieve the highest score possible!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : gameOver ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                Game Results
              </CardTitle>
              <CardDescription>
                Category: {selectedCategory === "all" ? "All Categories" : categoryInfo[selectedCategory].name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Final Score</p>
                  <p className="text-3xl font-bold">{score}</p>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <p className="text-3xl font-bold">{longestStreak}</p>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-3xl font-bold">{calculateAccuracy()}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Your Performance:</h3>
                <Progress value={calculateAccuracy()} className="h-3 w-full" />
                <p className="text-center text-sm text-muted-foreground">
                  You answered {questionsAnswered} questions with {calculateAccuracy()}% accuracy
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button onClick={() => startGame(selectedCategory)} className="w-full sm:w-auto">
                  <RotateCw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/games">Back to Games</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <Badge className="mb-2">
                    {selectedCategory === "all"
                      ? "All Categories"
                      : `${categoryInfo[selectedCategory].icon} ${categoryInfo[selectedCategory].name}`}
                  </Badge>
                  <CardTitle>
                    Question {currentQuestionIndex + 1} of {gameQuestions.length}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-1">
                    <Trophy className="mr-1 h-5 w-5 text-yellow-500" />
                    <span className="font-bold">{score}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <Clock className="mr-1 h-5 w-5 text-blue-500" />
                    <span className="font-bold">{timeLeft}s</span>
                  </div>
                </div>
              </div>
              <Progress value={(timeLeft / 20) * 100} className="h-2" />
              <div className="flex justify-between items-center text-sm">
                <Badge variant="outline" className="font-normal">
                  {currentQuestion?.difficulty.charAt(0).toUpperCase() + currentQuestion?.difficulty.slice(1)}
                </Badge>
                <div className="flex items-center">
                  <span className="mr-2">Streak:</span>
                  <Badge variant="secondary">{streak}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-6">{currentQuestion?.question}</h2>
                <div className="grid gap-3">
                  {currentQuestion?.options.map((option, index) => (
                    <button
                      key={index}
                      className={`p-4 border rounded-md text-left transition-colors ${
                        answerSubmitted
                          ? option === currentQuestion.correctAnswer
                            ? "bg-green-50 border-green-200"
                            : selectedAnswer === option && option !== currentQuestion.correctAnswer
                              ? "bg-red-50 border-red-200"
                              : "bg-muted"
                          : selectedAnswer === option
                            ? "bg-blue-50 border-blue-200"
                            : "hover:bg-muted"
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={answerSubmitted}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {answerSubmitted && option === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {answerSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!answerSubmitted ? (
                <div className="w-full flex gap-3">
                  <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="flex-1" variant="default">
                    Submit Answer
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedAnswer(null)
                      setAnswerSubmitted(true)
                      setStreak(0)
                      setQuestionsAnswered((prev) => prev + 1)
                      toast({
                        title: "Question Skipped",
                        description: `The correct answer was: ${currentQuestion.correctAnswer}`,
                      })
                    }}
                    className="flex-1"
                    variant="outline"
                  >
                    Skip Question
                  </Button>
                </div>
              ) : (
                <Button onClick={handleNextQuestion} className="w-full">
                  {currentQuestionIndex < gameQuestions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
