/**
 * Synthetic AI integration for generating smart reply suggestions
 * Uses Synthetic's inference API for context-aware responses
 *
 * Get your API key from: https://synthetic.new/settings/api-keys
 * Set SYNTHETIC_API_KEY environment variable
 */

interface SimpleMessage {
  user: string
  text: string
}

export interface SmartReplyResult {
  replies: string[]
  isAI: boolean // Track whether using real API or fallback
  model?: string
}

export async function generateSmartReplies(messages: SimpleMessage[]): Promise<SmartReplyResult> {
  try {
    const apiKey = process.env.SYNTHETIC_API_KEY

    if (!apiKey) {
      return {
        replies: getContextualReplies(messages),
        isAI: false,
      }
    }

    const conversationContext = messages
      .slice(-10)
      .map((msg) => `${msg.user}: ${msg.text}`)
      .join("\n")

    const systemPrompt = `You are a smart reply assistant for a live chat application. Your job is to generate 3 short, contextually relevant, and natural reply suggestions based on the conversation.

Guidelines:
- Each reply should be 5-50 characters
- Make them casual, friendly, and conversational
- Match the tone of the conversation
- Use emojis sparingly and naturally
- Avoid generic responses
- Be authentic and human-like

Return ONLY a valid JSON array of 3 strings, nothing else. Example: ["That's awesome!", "Let's go!", "I'm down"]`

    const response = await fetch("https://api.synthetic.new/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "hf:meta-llama/Llama-3.3-70B-Instruct",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Recent conversation:\n${conversationContext}\n\nGenerate 3 smart reply suggestions as a JSON array.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Synthetic API error (HTTP ${response.status}):`, errorData)

      if (response.status === 401) {
        console.error("Authentication failed (401). Verify SYNTHETIC_API_KEY is valid and configured.")
      } else if (response.status === 429) {
        console.error("Rate limit exceeded - try again later")
      } else if (response.status === 500) {
        console.error("Synthetic API server error - try again later")
      }

      return {
        replies: getContextualReplies(messages),
        isAI: false,
      }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return {
        replies: getContextualReplies(messages),
        isAI: false,
      }
    }

    try {
      const replies = JSON.parse(content)
      if (Array.isArray(replies) && replies.length > 0) {
        return {
          replies: replies.slice(0, 3),
          isAI: true,
          model: "hf:meta-llama/Llama-3.3-70B-Instruct",
        }
      }
    } catch (parseError) {
      console.log("Failed to parse API response:", content)
    }

    return {
      replies: getContextualReplies(messages),
      isAI: false,
    }
  } catch (error) {
    console.error("Synthetic API error:", error)
    return {
      replies: getContextualReplies(messages),
      isAI: false,
    }
  }
}

function getContextualReplies(messages: SimpleMessage[]): string[] {
  if (messages.length === 0) {
    return ["Hey there! 👋", "What's up?", "How's it going?"]
  }

  const lastMessage = messages[messages.length - 1].text.toLowerCase()

  // Question detection
  if (lastMessage.includes("?")) {
    return ["Good question!", "Let me think...", "Not sure tbh"]
  }

  // Excitement detection
  if (lastMessage.includes("!") || lastMessage.includes("wow") || lastMessage.includes("amazing")) {
    return ["That's awesome! 🔥", "So cool!", "Let's gooo!"]
  }

  // Agreement/positive
  if (
    lastMessage.includes("yes") ||
    lastMessage.includes("yeah") ||
    lastMessage.includes("agree") ||
    lastMessage.includes("right")
  ) {
    return ["Totally agree!", "For sure!", "100%"]
  }

  // Gaming related
  if (
    lastMessage.includes("game") ||
    lastMessage.includes("play") ||
    lastMessage.includes("win") ||
    lastMessage.includes("gg")
  ) {
    return ["GG! 🎮", "Nice play!", "W gaming"]
  }

  // Laughing/funny
  if (
    lastMessage.includes("lol") ||
    lastMessage.includes("haha") ||
    lastMessage.includes("funny") ||
    lastMessage.includes("😂")
  ) {
    return ["Haha nice! 😂", "So funny!", "LMAO"]
  }

  // Thanks/appreciation
  if (lastMessage.includes("thank") || lastMessage.includes("appreciate")) {
    return ["No problem!", "Anytime!", "Happy to help!"]
  }

  // Default varied responses
  const defaultSets = [
    ["Sounds good! 👍", "Let's do it!", "I'm down!"],
    ["Nice one!", "That's cool!", "Love it!"],
    ["Interesting!", "Tell me more", "Go on..."],
    ["For real!", "No way!", "That's wild!"],
    ["Facts!", "True that!", "Agreed!"],
    ["Let's gooo!", "W chat", "Based"],
  ]

  return defaultSets[Math.floor(Math.random() * defaultSets.length)]
}
