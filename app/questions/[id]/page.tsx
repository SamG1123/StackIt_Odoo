"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, User, ChevronUp, ChevronDown, Check, MessageSquare } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/rich-text-editor"

const question = {
  id: 1,
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description:
    "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine both columns to make a separate column containing full name.",
  tags: ["SQL", "Tags"],
  user: "User Name",
  timeAgo: "2 hours ago",
  votes: 5,
}

const answers = [
  {
    id: 1,
    content: "The || Operator.\nThe + Operator.\nThe CONCAT Function.",
    user: "Answer User 1",
    votes: 3,
    isAccepted: false,
    timeAgo: "1 hour ago",
  },
  {
    id: 2,
    content: "Details",
    user: "Answer User 2",
    votes: 1,
    isAccepted: false,
    timeAgo: "30 minutes ago",
  },
]

export default function QuestionDetailPage() {
  const [newAnswer, setNewAnswer] = useState("")
  const [answerVotes, setAnswerVotes] = useState<{ [key: number]: number }>({
    1: 3,
    2: 1,
  })

  const handleVote = (answerId: number, direction: "up" | "down") => {
    setAnswerVotes((prev) => ({
      ...prev,
      [answerId]: prev[answerId] + (direction === "up" ? 1 : -1),
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              StackIt
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Question
          </Link>
          <span className="mx-2">{">"}</span>
          <span>How to join 2...</span>
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">{question.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground mb-4 leading-relaxed">{question.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{question.user}</span>
              <span>{question.timeAgo}</span>
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Answers ({answers.length})</h2>

          <div className="space-y-6">
            {answers.map((answer) => (
              <Card key={answer.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Voting */}
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVote(answer.id, "up")}
                        className="h-8 w-8"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">{answerVotes[answer.id]}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVote(answer.id, "down")}
                        className="h-8 w-8"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      {answer.isAccepted && <Check className="h-5 w-5 text-green-600 mt-2" />}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      <div className="prose prose-sm max-w-none mb-4">
                        {answer.content.split("\n").map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{answer.user}</span>
                        <span>{answer.timeAgo}</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submit Answer */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Submit Your Answer</h3>

            <div className="space-y-4">
              <RichTextEditor value={newAnswer} onChange={setNewAnswer} placeholder="Write your answer here..." />

              <div className="flex justify-end">
                <Button size="lg" className="px-8">
                  Submit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
