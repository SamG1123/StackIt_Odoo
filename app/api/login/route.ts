import connectDB from "@/lib/mongodb"
import Users from "@/models/Users"
import bcrypt from "bcryptjs"
import { NextResponse, type NextRequest } from "next/server"

/* Optional: enforce Node.js runtime */
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await Users.findOne({ username })
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
