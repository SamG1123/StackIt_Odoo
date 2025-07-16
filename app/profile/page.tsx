import { type NextRequest, NextResponse } from "next/server";

const mockActivity = [
  {
    id: "1",
    type: "answer",
    title: "Answered a question",
    description: "How to implement authentication in Next.js?",
    questionId: 3,
    answerId: 1,
    createdAt: "2024-01-08T16:20:00Z",
    metadata: { votes: 12, accepted: true },
  },
  {
    id: "2",
    type: "question",
    title: "Asked a question",
    description: "Best practices for React state management?",
    questionId: 2,
    createdAt: "2024-01-12T09:15:00Z",
    metadata: { votes: 3, views: 89 },
  },
  {
    id: "3",
    type: "vote",
    title: "Received upvote",
    description: "Your answer was helpful",
    answerId: 1,
    createdAt: "2024-01-09T14:30:00Z",
    metadata: { voteType: "up" },
  },
  {
    id: "4",
    type: "badge",
    title: "Earned a badge",
    description: "First Answer - Provided your first answer",
    createdAt: "2024-01-08T16:25:00Z",
    metadata: { badgeName: "First Answer", badgeType: "bronze" },
  },
];

const getCurrentUserId = async (
  request: NextRequest
): Promise<string | null> => {
  // Mock auth - replace with your actual auth system
  return "1";
};

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Sort activity by date (most recent first)
    const sortedActivity = mockActivity.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: sortedActivity,
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
