"use client"

import { useEffect, useRef, useState } from "react"
import { StreamChat } from "stream-chat"
import { Chat, Channel, MessageList, MessageInput, useChatContext, useChannelStateContext } from "stream-chat-react"
import { SmartReplyBar } from "./smart-reply-bar"

interface DiscordChatLayoutProps {
  userId: string
  userName: string
  client: StreamChat
  channel: any // Using any to avoid type issues with Stream's Channel type
}

// Component to bridge Stream messages to SmartReplyBar
function MessageBridge() {
  const { messages = [] } = useChannelStateContext()
  const { channel } = useChatContext()
  
  const handleSelectReply = (reply: string) => {
    if (channel) {
      void channel.sendMessage({
        text: reply,
      })
    }
  }

  // Transform Stream messages to SmartReplyBar format
  const simplifiedMessages = messages.map((m: any) => ({
    id: m.id,
    userId: m.user?.id || '',
    userName: m.user?.name || m.user?.id || 'User',
    text: m.text || '',
    timestamp: m.created_at ? new Date(m.created_at) : new Date(),
  }))

  return <SmartReplyBar messages={simplifiedMessages} onSelectReply={handleSelectReply} />
}

export function DiscordChatLayout({ userId, userName, client, channel }: DiscordChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [channel?.state?.messages])

  // Use Stream's MessageList and MessageInput components
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4">
        <div className="p-2 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">S</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center space-y-4">
          <button className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors">
            <span className="text-xl">#</span>
          </button>
          <button className="w-12 h-12 bg-gray-700 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors">
            <span className="text-xl">+</span>
          </button>
        </div>
        <div className="mt-auto">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-lg">{userName?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-14 border-b border-gray-200 bg-white flex items-center px-4">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">#</span>
            <h2 className="font-semibold">general</h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <MessageInput />
          <MessageBridge />
        </div>
      </div>
    </div>
  )
}
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
