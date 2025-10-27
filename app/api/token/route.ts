import { type NextRequest, NextResponse } from "next/server"
import { StreamChat } from "stream-chat"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

export async function POST(request: NextRequest) {
  try {
    if (!apiKey || !apiSecret) {
      console.error("Missing Stream credentials - STREAM_API_KEY or STREAM_API_SECRET not set")
      return NextResponse.json(
        {
          error:
            "Stream credentials not configured. Please add STREAM_API_KEY and STREAM_API_SECRET environment variables.",
        },
        { status: 500 },
      )
    }

    const { userId, userName } = await request.json()

    if (!userId || !userName) {
      return NextResponse.json({ error: "userId and userName are required" }, { status: 400 })
    }

    console.log("Generating token for user:", userId)

    // Use Stream official server client to create a user token
    const serverClient = StreamChat.getInstance(apiKey, apiSecret)
    // Ensure the user exists/updated on Stream
    await serverClient.upsertUser({ id: userId, name: userName })
    const token = serverClient.createToken(userId)

    console.log("Token generated successfully")

    return NextResponse.json({
      token,
      userId,
      userName,
    })
  } catch (error) {
    console.error("Token generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate token" },
      { status: 500 },
    )
  }
}
