import { type NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/stackit";

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db("stackit");
    const usersCollection = db.collection("users");

    // Find user by username or email
    const user = await usersCollection.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Get user stats from questions and answers collections
    const questionsCollection = db.collection("questions");
    const answersCollection = db.collection("answers");

    const [questionsAsked, answersGiven, userQuestions] = await Promise.all([
      questionsCollection.countDocuments({ userId: user._id }),
      answersCollection.countDocuments({ userId: user._id }),
      questionsCollection
        .find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray(),
    ]);

    // Calculate reputation (you can adjust this logic based on your needs)
    const reputation =
      questionsAsked * 5 + answersGiven * 10 + (user.helpfulVotes || 0) * 2;

    // Return user data without password
    const userData = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      location: user.location || "",
      profileImage: user.profileImage || "",
      joinedDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })
        : "Recently",
      reputation,
      questionsAsked,
      answersGiven,
      helpfulVotes: user.helpfulVotes || 0,
      questions: userQuestions.map((q) => ({
        id: q._id.toString(),
        title: q.title,
        description: q.description,
        tags: q.tags || [],
        answers: q.answerCount || 0,
        timeAgo: getTimeAgo(q.createdAt),
        createdAt: q.createdAt,
      })),
    };

    return NextResponse.json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInDays < 30)
    return `${Math.floor(diffInDays / 7)} week${
      Math.floor(diffInDays / 7) > 1 ? "s" : ""
    } ago`;
  return `${Math.floor(diffInDays / 30)} month${
    Math.floor(diffInDays / 30) > 1 ? "s" : ""
  } ago`;
}
