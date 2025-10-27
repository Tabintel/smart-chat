import { type NextRequest, NextResponse } from "next/server"
import { generateSmartReplies } from "@/lib/synthetic-ai"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 })
    }

    const result = await generateSmartReplies(messages)

    return NextResponse.json({
      replies: result.replies,
      isAI: result.isAI,
      model: result.model,
    })
  } catch (error) {
    console.error("Smart replies API error:", error)
    return NextResponse.json({ error: "Failed to generate smart replies" }, { status: 500 })
  }
}
