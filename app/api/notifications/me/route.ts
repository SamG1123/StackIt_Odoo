// app/api/notifications/me/route.ts
import { getUserFromSession } from "@/lib/auth"; // your auth logic
import Notification from "@/models/Notification";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const user = await getUserFromSession(); // implement this
  if (!user) return new Response("Unauthorized", { status: 401 });

  const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });

  return Response.json({ notifications });
}
