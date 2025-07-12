// app/api/notifications/read/route.ts
import Notification from "@/models/Notification";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectDB();
  const { userId } = await req.json();

  await Notification.updateMany({ userId, read: false }, { $set: { read: true } });

  return new Response("OK");
}
