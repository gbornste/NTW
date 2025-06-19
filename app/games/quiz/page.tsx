"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Trophy, CheckCircle, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Quiz questions about Trump
const quizQuestions = [
  {
    id: 1,
    question: "In what year did Donald Trump first announce his candidacy for President of the United States?",
    options: ["2012", "2014", "2015", "2016"],
    correctAnswer: "2015",
    explanation:
      "Donald Trump announced his candidacy for President on June 16, 2015, at Trump Tower in New York City.",
  },
  {
    id: 2,
    question: "Which reality TV show did Donald Trump host before becoming president?",
    options: ["Survivor", "The Apprentice", "Big Brother", "American Idol"],
    correctAnswer: "The Apprentice",
    explanation:
      "Donald Trump hosted the reality TV show 'The Apprentice' from 2004 to 2015, where his catchphrase was 'You're fired!'",
  },
  {
    id: 3,
    question: "What was the name of Trump's campaign slogan in 2016?",
    options: ["America First", "Make America Great Again", "Yes We Can", "Stronger Together"],
    correctAnswer: "Make America Great Again",
    explanation: "Trump's 2016 campaign slogan was 'Make America Great Again,' often abbreviated as MAGA.",
  },
  {
    id: 4,
    question: "Which country did Trump propose building a border wall with, claiming they would pay for it?",
    options: ["Canada", "Mexico", "China", "Russia"],
    correctAnswer: "Mexico",
    explanation:
      "Trump promised to build a wall along the U.S.-Mexico border and repeatedly claimed that Mexico would pay for it.",
  },
  {
    id: 5,
    question: "How many times has Donald Trump been impeached by the House of Representatives?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "2",
    explanation:
      "Trump was impeached twice: first in December 2019 for abuse of power and obstruction of Congress, and again in January 2021 for incitement of insurrection.",
  },
  {
    id: 6,
    question: "Before entering politics, Trump's primary business was in which industry?",
    options: ["Technology", "Pharmaceuticals", "Real Estate", "Oil and Gas"],
    correctAnswer: "Real Estate",
    explanation:
      "Trump's primary business before politics was real estate development, with properties including hotels, casinos, and residential buildings.",
  },
  {
    id: 7,
    question: "What social media platform did Trump frequently use during his presidency until he was banned in 2021?",
    options: ["Facebook", "Instagram", "Twitter", "TikTok"],
    correctAnswer: "Twitter",
    explanation:
      "Trump was known for his frequent use of Twitter during his presidency until he was permanently suspended from the platform on January 8, 2021.",
  },
  {
    id: 8,
    question:
      "Which Trump administration policy separated migrant children from their parents at the U.S.-Mexico border?",
    options: ["Dream Act", "Zero Tolerance Policy", "Border Security Act", "Immigration Reform Plan"],
    correctAnswer: "Zero Tolerance Policy",
    explanation:
      "The 'Zero Tolerance Policy' implemented in 2018 led to the separation of thousands of migrant children from their parents at the border.",
  },
  {
    id: 9,
    question: "What was the name of the investigation into Russian interference in the 2016 U.S. election?",
    options: ["Clinton Investigation", "Mueller Investigation", "Trump Investigation", "Russia Gate"],
    correctAnswer: "Mueller Investigation",
    explanation:
      "The Mueller Investigation, led by Special Counsel Robert Mueller, investigated Russian interference in the 2016 election and possible links with the Trump campaign.",
  },
  {
    id: 10,
    question: "Which Trump family member served as a Senior Advisor to the President during his administration?",
    options: ["Donald Trump Jr.", "Ivanka Trump", "Eric Trump", "Tiffany Trump"],
    correctAnswer: "Ivanka Trump",
    explanation:
      "Ivanka Trump served as a Senior Advisor to her father during his presidency, focusing on education and economic empowerment of women.",
  },
  {
    id: 11,
    question: "What was the name of Trump's third wife, who served as First Lady during his presidency?",
    options: ["Ivana Trump", "Marla Maples", "Melania Trump", "Tiffany Trump"],
    correctAnswer: "Melania Trump",
    explanation:
      "Melania Trump, born in Slovenia, was Donald Trump's third wife and served as First Lady from 2017 to 2021.",
  },
  {
    id: 12,
    question:
      "Which international agreement did Trump withdraw the United States from in 2017, calling it a 'bad deal'?",
    options: ["NATO", "NAFTA", "Paris Climate Agreement", "Iran Nuclear Deal"],
    correctAnswer: "Paris Climate Agreement",
    explanation:
      "In June 2017, Trump announced that the U.S. would withdraw from the Paris Climate Agreement, though the withdrawal wasn't officially completed until November 2020.",
  },
  {
    id: 13,
    question: "What was the name of Trump's social media platform launched after his ban from Twitter?",
    options: ["Truth Social", "Trump Talk", "Freedom Speak", "Patriot Platform"],
    correctAnswer: "Truth Social",
    explanation:
      "Truth Social was launched by Trump Media & Technology Group in 2022 after Trump was banned from major social media platforms.",
  },
  {
    id: 14,
    question: "Which Trump-appointed Supreme Court Justices were confirmed during his presidency?",
    options: [
      "Gorsuch, Kavanaugh, and Barrett",
      "Roberts, Alito, and Gorsuch",
      "Kavanaugh, Barrett, and Sotomayor",
      "Gorsuch, Thomas, and Kavanaugh",
    ],
    correctAnswer: "Gorsuch, Kavanaugh, and Barrett",
    explanation:
      "Trump appointed three Supreme Court Justices during his presidency: Neil Gorsuch (2017), Brett Kavanaugh (2018), and Amy Coney Barrett (2020).",
  },
  {
    id: 15,
    question: "What was the name of the tax cut legislation passed during Trump's presidency in 2017?",
    options: ["American Recovery Act", "Tax Cuts and Jobs Act", "Fair Tax Plan", "Economic Growth Initiative"],
    correctAnswer: "Tax Cuts and Jobs Act",
    explanation:
      "The Tax Cuts and Jobs Act was signed into law by President Trump in December 2017, representing the largest overhaul of the tax code in decades.",
  },
]

export default function PoliticalQuizPage() {
  const { toast } = useToast()
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<
    {
      questionId: number
      userAnswer: string
      correct: boolean
    }[]
  >([])
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds per question
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof quizQuestions>([])

  // Shuffle questions when the component mounts
  useEffect(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [])

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswerSubmitted(false)
    setScore(0)
    setAnswers([])
    setTimeLeft(30)
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (quizStarted && !quizCompleted && !answerSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !answerSubmitted && quizStarted) {
      // Time's up, auto-submit the current answer
      handleSubmitAnswer()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [quizStarted, quizCompleted, answerSubmitted, timeLeft])

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answer)
    }
  }

  // Submit the answer
  const handleSubmitAnswer = () => {
    if (answerSubmitted) return

    const currentQuestion = shuffledQuestions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    // Record the answer
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer || "No answer",
        correct: isCorrect,
      },
    ])

    // Update score if correct
    if (isCorrect) {
      setScore((prev) => prev + 1)
      toast({
        title: "Correct!",
        description: currentQuestion.explanation,
        variant: "default",
      })
    } else {
      toast({
        title: "Incorrect!",
        description: `The correct answer was: ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`,
        variant: "destructive",
      })
    }

    setAnswerSubmitted(true)
  }

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setAnswerSubmitted(false)
      setTimeLeft(30)
    } else {
      // Quiz completed
      setQuizCompleted(true)
      toast({
        title: "Quiz Completed!",
        description: `Your final score is ${score} out of ${shuffledQuestions.length}.`,
      })
    }
  }

  // Calculate percentage score
  const calculatePercentage = () => {
    return Math.round((score / shuffledQuestions.length) * 100)
  }

  // Get feedback based on score
  const getFeedback = () => {
    const percentage = calculatePercentage()
    if (percentage >= 90) return "Excellent! You're a Trump expert!"
    if (percentage >= 70) return "Great job! You know your Trump facts well."
    if (percentage >= 50) return "Good effort! You know the basics about Trump."
    if (percentage >= 30) return "Not bad, but you might want to brush up on your Trump knowledge."
    return "Looks like you need to learn more about Trump's history and policies."
  }

  // Get current question
  const currentQuestion = shuffledQuestions[currentQuestionIndex]

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/games">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Trump Political Quiz</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {!quizStarted && !quizCompleted ? (
          <Card>
            <CardHeader>
              <CardTitle>Test Your Trump Knowledge</CardTitle>
              <CardDescription>
                How well do you know Donald Trump's political career, policies, and controversies?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This quiz contains {quizQuestions.length} questions about Donald Trump, covering his business career,
                presidency, policies, and recent events. See how many you can answer correctly!
              </p>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">Quiz Rules:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You have 30 seconds to answer each question</li>
                  <li>Each correct answer is worth 1 point</li>
                  <li>You'll get immediate feedback after each question</li>
                  <li>No changing your answer once submitted</li>
                  <li>Your final score and analysis will be shown at the end</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startQuiz} size="lg" className="w-full">
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        ) : quizCompleted ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                Quiz Results
              </CardTitle>
              <CardDescription>
                You scored {score} out of {shuffledQuestions.length} ({calculatePercentage()}%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">{getFeedback()}</p>
                <Progress value={calculatePercentage()} className="h-3 w-full" />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Question Summary:</h3>
                {answers.map((answer, index) => {
                  const question = quizQuestions.find((q) => q.id === answer.questionId)
                  return (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-start">
                        {answer.correct ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{question?.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your answer:{" "}
                            <span className={answer.correct ? "text-green-600" : "text-red-600"}>
                              {answer.userAnswer}
                            </span>
                          </p>
                          {!answer.correct && (
                            <p className="text-sm text-green-600 mt-1">Correct answer: {question?.correctAnswer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button onClick={startQuiz} className="w-full sm:w-auto">
                Take Quiz Again
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/games">Back to Games</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
                </CardTitle>
                <div className="flex items-center">
                  <Clock className="mr-1 h-5 w-5 text-blue-500" />
                  <span className="font-bold">{timeLeft}s</span>
                </div>
              </div>
              <Progress value={(timeLeft / 30) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">{currentQuestion?.question}</h2>
                <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                  {currentQuestion?.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer ${
                        answerSubmitted
                          ? option === currentQuestion.correctAnswer
                            ? "bg-green-50 border-green-200"
                            : selectedAnswer === option && option !== currentQuestion.correctAnswer
                              ? "bg-red-50 border-red-200"
                              : ""
                          : selectedAnswer === option
                            ? "bg-blue-50 border-blue-200"
                            : ""
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`option-${index}`}
                        disabled={answerSubmitted}
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className={`cursor-pointer w-full ${
                          answerSubmitted && option === currentQuestion.correctAnswer ? "font-medium" : ""
                        }`}
                      >
                        {option}
                      </Label>
                      {answerSubmitted && option === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {answerSubmitted && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!answerSubmitted ? (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full">
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="w-full">
                  {currentQuestionIndex < shuffledQuestions.length - 1 ? (
                    <>
                      Next Question <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "See Results"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
