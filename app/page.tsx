"use client"

import { useState } from "react"
import { StreamChatContainer } from "@/components/stream-chat-container"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [inputUserId, setInputUserId] = useState("")
  const [inputUserName, setInputUserName] = useState("")

  const handleLogin = () => {
    if (inputUserId && inputUserName) {
      setUserId(inputUserId)
      setUserName(inputUserName)
      setIsLoggedIn(true)
    }
  }

  if (isLoggedIn) {
    return <StreamChatContainer userId={userId} userName={userName} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-purple-950/20 p-4">
      <div className="w-full max-w-md border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur-sm shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <svg className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <svg
                  className="h-4 w-4 text-purple-400 absolute -top-1 -right-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-white">Intelligent Live Chat</h1>
              <p className="text-sm text-gray-400 text-balance">
                Chat with AI-powered reply suggestions. Get instant, context-aware responses that keep conversations
                flowing naturally.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userId" className="text-sm font-medium text-gray-200">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                placeholder="Enter your user ID"
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-medium text-gray-200">
                Display Name
              </label>
              <input
                id="userName"
                type="text"
                placeholder="Enter your display name"
                value={inputUserName}
                onChange={(e) => setInputUserName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={!inputUserId || !inputUserName}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
            >
              Join Chat
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 justify-center">
              <svg className="h-3 w-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Powered by AI & Real-time Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
