// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  const newNotif = await Notification.create(data);

  return NextResponse.json({ success: true, notification: newNotif });
}
