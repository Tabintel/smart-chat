"use client"

import { useState, useEffect } from "react"

interface Message {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: Date
}

interface SmartReplyBarProps {
  onSelectReply: (reply: string) => void
  messages: Message[]
}

export function SmartReplyBar({ onSelectReply, messages }: SmartReplyBarProps) {
  const [replies, setReplies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [isAI, setIsAI] = useState(false)

  useEffect(() => {
    if (messages.length === 0) return
    const t = setTimeout(() => {
      void generateReplies()
    }, 400)
    return () => clearTimeout(t)
  }, [messages])

  const generateReplies = async () => {
    setLoading(true)
    try {
      const formattedMessages = messages.slice(-5).map((msg) => ({
        user: msg.userName,
        text: msg.text,
      }))

      const response = await fetch("/api/smart-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMessages }),
      })

      if (response.ok) {
        const data = await response.json()
        setReplies(data.replies || [])
        setIsAI(data.isAI || false)
      } else {
        setReplies([])
        setIsAI(false)
      }
    } catch (error) {
      setReplies([])
      setIsAI(false)
    } finally {
      setLoading(false)
    }
  }

  if (replies.length === 0 && !loading) return null

  return (
    <div className="px-4 py-2 bg-[#2b2d31] border-t border-[#1e1f22]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-[#949ba4] shrink-0">
          <div
            className={`w-5 h-5 rounded flex items-center justify-center ${
              isAI ? "bg-gradient-to-br from-purple-500 to-blue-500" : "bg-gradient-to-br from-gray-600 to-gray-700"
            }`}
          >
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="font-medium">{isAI ? "AI Suggestions" : "Quick Replies"}</span>
          {isAI && (
            <div className="flex items-center gap-1 ml-1 px-2 py-0.5 bg-purple-500/10 rounded border border-purple-500/20">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-purple-400 text-xs">Live</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-[#949ba4]">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              <span>Crafting suggestions...</span>
            </div>
          ) : (
            replies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onSelectReply(reply)}
                className={`shrink-0 text-sm px-3 py-1.5 rounded text-[#dbdee1] hover:text-white transition-all duration-150 border ${
                  isAI
                    ? "bg-[#383a40] hover:bg-[#404249] border-purple-500/20 hover:border-purple-500/40"
                    : "bg-[#383a40] hover:bg-[#404249] border-gray-600/20 hover:border-gray-500/40"
                }`}
              >
                {reply}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
