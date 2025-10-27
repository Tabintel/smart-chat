"use client"

import { useEffect, useMemo, useState } from "react"
import { StreamChat } from "stream-chat"
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react"
import "stream-chat-react/dist/css/v2/index.css"
import { SmartReplyBar } from "./smart-reply-bar"

interface StreamChatContainerProps {
  userId: string
  userName: string
}

export function StreamChatContainer({ userId, userName }: StreamChatContainerProps) {
  const [client, setClient] = useState<StreamChat | null>(null)
  const [channelId, setChannelId] = useState<string>("livestream")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

  useEffect(() => {
    const init = async () => {
      if (!apiKey) {
        setError("Stream API key is not configured. Please check your environment variables.")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        // Test the token endpoint first
        const res = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userName }),
        })
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to get authentication token")
        }
        
        const { token } = await res.json()
        const c = StreamChat.getInstance(apiKey)
        
        // Test connection
        await c.connectUser({ id: userId, name: userName }, token)
        
        // Verify connection
        if (!c.userID) {
          throw new Error("Failed to establish connection with Stream Chat")
        }
        
        setClient(c)
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Stream initialization error:", e)
        setError(`Failed to initialize chat: ${errorMessage}`)
        setClient(null)
      } finally {
        setIsLoading(false)
      }
    }
    init()

    return () => {
      if (client) client.disconnectUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userName, apiKey])

  const channel = useMemo(() => {
    if (!client) return null
    
    // Create a team channel type which is most common for group chats
    return client.channel("team", channelId, {
      name: "AI Smart Replies Demo",
      members: [userId],
      created_by_id: userId
    })
  }, [client, channelId, userId])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p>Initializing chat...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-red-900/30 border border-red-500 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="mb-4 text-red-200">{error}</p>
          <p className="text-sm text-gray-400 mb-4">
            Please check your internet connection and refresh the page to try again.
            If the problem persists, contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (!client || !channel) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p>Failed to initialize chat. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <Chat client={client} theme="str-chat__theme-dark">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader title="Live Stream Chat" live />
          <MessageList />
          {/* Map Stream messages to SmartReplyBar input shape */}
          <SmartReplyBridge />
          <MessageInput focus />
        </Window>
      </Channel>
    </Chat>
  )
}

function SmartReplyBridge() {
  // Use window stream chat store via DOM-less hook: we can access channel state through context
  // stream-chat-react exposes useChannelStateContext, useChatContext etc.
  // Import locally to avoid SSR issues in non-React environments
  const { useChannelStateContext } = require("stream-chat-react") as typeof import("stream-chat-react")
  const { messages } = useChannelStateContext()

  type SRMessage = { id: string; userId: string; userName: string; text: string; timestamp: Date }
  const simplified: SRMessage[] = (messages ?? []).slice(-10).map((m: any) => ({
    id: m.id,
    userId: m.user?.id ?? "",
    userName: m.user?.name ?? m.user?.id ?? "User",
    text: m.text ?? "",
    timestamp: new Date(m.created_at || Date.now()),
  }))

  const { useChatContext } = require("stream-chat-react") as typeof import("stream-chat-react")
  const { channel } = useChatContext()

  const handleSelect = async (reply: string) => {
    await channel?.sendMessage({ text: reply })
  }

  return <SmartReplyBar messages={simplified} onSelectReply={handleSelect} />
}
