import connectDB from "@/lib/mongodb"
import Questions from "@/models/Questions"
import { NextResponse, type NextRequest } from "next/server"

/* mongoose schema/model (create once) */
export const runtime = "nodejs"
  
export async function POST(req: NextRequest) {
  try {
    const { title, description, tags, user } = await req.json()

    if (!title || !description || !tags?.length) {
      return NextResponse.json(
        { message: "Title, description and at least one tag are required" },
        { status: 400 }
      )
    }

    await connectDB()

    const newQuestion = await Questions.create({
      title,
      description,
      tags,
      user, // e.g. current username; replace with auth session
    })

    return NextResponse.json(newQuestion, { status: 201 })
  } catch (err) {
    console.error("Question POST error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const questions = await Questions.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(questions, { status: 200 })
  } catch (err) {
    console.error("Question GET error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
