import { type NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("stackit");
    const answersCollection = db.collection("answers");
    const questionsCollection = db.collection("questions");

    // Get user's answers with question details
    const userAnswers = await answersCollection
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "questions",
            localField: "questionId",
            foreignField: "_id",
            as: "question",
          },
        },
        { $unwind: "$question" },
      ])
      .toArray();

    const answeredQuestions = userAnswers.map((answer) => ({
      id: answer.question._id.toString(),
      title: answer.question.title,
      description: answer.question.description,
      tags: answer.question.tags || [],
      timeAgo: getTimeAgo(answer.createdAt),
      answeredByUser: true,
      answerContent: answer.content,
    }));

    return NextResponse.json({ answeredQuestions });
  } catch (error) {
    console.error("Error fetching answered questions:", error);
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
