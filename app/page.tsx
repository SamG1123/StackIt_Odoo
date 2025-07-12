import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Bell, User, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const questions = [
  {
    id: 1,
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine...",
    tags: ["SQL", "Tags"],
    user: "User Name",
    answers: 5,
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "Question.....",
    description: "Descriptions....",
    tags: ["SQL", "Tags"],
    user: "User Name",
    answers: 3,
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    title: "Question.....",
    description: "Descriptions....",
    tags: ["SQL", "Tags"],
    user: "User Name",
    answers: 2,
    timeAgo: "6 hours ago",
  },
]

export default function HomePage() {
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
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button>Login</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link href="/ask">
            <Button className="w-full sm:w-auto">Ask New Question</Button>
          </Link>

          <div className="flex flex-1 gap-4">
            <Select defaultValue="newest">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="more">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="more">More</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="votes">Votes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10" />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4 mb-8">
          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <Link href={`/questions/${question.id}`}>
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer">{question.title}</h3>
                    </Link>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{question.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{question.user}</span>
                      <span>{question.timeAgo}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-lg px-3 py-2">
                      <div className="text-lg font-semibold">{question.answers}</div>
                      <div className="text-xs text-muted-foreground">answers</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {[1, 2, 3, 4, 5, 6, 7].map((page) => (
            <Button key={page} variant={page === 1 ? "default" : "ghost"} size="icon" className="w-8 h-8">
              {page}
            </Button>
          ))}
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
