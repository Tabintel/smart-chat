"use client"

import { useState, useEffect, useRef } from "react"
import { SmartReplyBar } from "./smart-reply-bar"

interface Message {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: Date
  avatar?: string
}

interface Channel {
  id: string
  name: string
  icon: string
}

interface DiscordChatLayoutProps {
  userId: string
  userName: string
}

export function DiscordChatLayout({ userId, userName }: DiscordChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userId: "bot",
      userName: "ChatBot",
      text: "Welcome to the AI-powered chat! Try sending a message and see intelligent reply suggestions appear.",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      userId: "user1",
      userName: "ProGamer",
      text: "Hey everyone! Thanks for joining today!",
      timestamp: new Date(Date.now() - 45000),
    },
    {
      id: "3",
      userId: "user2",
      userName: "ChatMaster",
      text: "This is awesome! The AI suggestions are really helpful.",
      timestamp: new Date(Date.now() - 30000),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("general")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const channels: Channel[] = [
    { id: "general", name: "general", icon: "#" },
    { id: "gaming", name: "gaming", icon: "#" },
    { id: "ai-chat", name: "ai-chat", icon: "🤖" },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      userId,
      userName,
      text: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Simulate a response after a delay
    setTimeout(() => {
      const responses = [
        "That's a great point!",
        "I totally agree with that.",
        "Interesting perspective!",
        "Thanks for sharing!",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        userId: "bot",
        userName: "ChatBot",
        text: randomResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 2000)
  }

  const handleSmartReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAvatarColor = (userId: string) => {
    const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-pink-500", "bg-indigo-500"]
    const index = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  return (
    <div className="flex h-screen bg-[#1e1f22]">
      {/* Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col">
        {/* Server Header */}
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-semibold text-white">AI Chat Hub</span>
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-2 px-2 text-xs font-semibold text-[#949ba4] uppercase">Text Channels</div>
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`w-full px-2 py-1.5 rounded flex items-center gap-2 text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1] transition-colors ${
                selectedChannel === channel.id ? "bg-[#404249] text-white" : ""
              }`}
            >
              <span className="text-lg">{channel.icon}</span>
              <span className="text-sm font-medium">{channel.name}</span>
            </button>
          ))}
        </div>

        {/* User Info */}
        <div className="h-14 px-2 bg-[#232428] flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full ${getAvatarColor(userId)} flex items-center justify-center text-white text-sm font-semibold`}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{userName}</div>
            <div className="text-xs text-[#949ba4]">Online</div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] shadow-sm bg-[#313338]">
          <div className="flex items-center gap-2">
            <span className="text-[#949ba4] text-xl">#</span>
            <span className="font-semibold text-white">{selectedChannel}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-purple-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Intelligent Replies Active</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3 hover:bg-[#2e3035] -mx-4 px-4 py-1 rounded">
              <div
                className={`w-10 h-10 rounded-full ${getAvatarColor(message.userId)} flex items-center justify-center text-white font-semibold flex-shrink-0`}
              >
                {message.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-white">{message.userName}</span>
                  <span className="text-xs text-[#949ba4]">{formatTime(message.timestamp)}</span>
                </div>
                <div className="text-[#dbdee1] text-sm mt-0.5 break-words">{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Smart Reply Bar */}
        <SmartReplyBar messages={messages} onSelectReply={handleSmartReply} />

        {/* Message Input */}
        <div className="p-4 bg-[#313338]">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }
              }}
              placeholder={`Message #${selectedChannel}`}
              className="w-full px-4 py-3 bg-[#383a40] border-none rounded-lg text-white placeholder:text-[#6d6f78] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#949ba4] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
