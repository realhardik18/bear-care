"use client"

import React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Shield, Zap, User, Bot, Database, Loader2, BookOpen, Info, Plus, Send } from "lucide-react"
import clsx from "clsx"

const aiFeatures = [
  {
    icon: Brain,
    title: "Medical AI Assistant",
    description: "Get instant insights from patient FHIR records and medical data.",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "All conversations are encrypted and privacy-protected.",
  },
  {
    icon: Zap,
    title: "Evidence-Based",
    description: "Recommendations backed by medical literature and guidelines.",
  },
]

const quickActions = [
  {
    label: "Cite Sources",
    icon: BookOpen,
    action: "cite",
    tooltip: "Show medical sources and references",
  },
  {
    label: "Explain",
    icon: Info,
    action: "explain",
    tooltip: "Get detailed explanation",
  },
  {
    label: "Add to Notes",
    icon: Plus,
    action: "add",
    tooltip: "Save to patient notes",
  },
]

const suggestedQuestions = [
  "Analyze patient symptoms for differential diagnosis",
  "Recommend treatment options for hypertension",
  "Explain lab results interpretation",
  "Suggest care plan for diabetic patient",
]

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const [input, setInput] = React.useState("")
  const [quickActionMsgId, setQuickActionMsgId] = React.useState(null)
  const chatEndRef = React.useRef(null)
  const messagesContainerRef = React.useRef(null)

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput("")
  }

  const handleQuickAction = (msgId, action) => {
    setQuickActionMsgId(msgId + action)
    setTimeout(() => setQuickActionMsgId(null), 600)

    // Send follow-up message based on action
    const actionPrompts = {
      cite: "Please provide sources and references for your previous response.",
      explain: "Can you explain your previous response in more detail?",
      add: "Please format your previous response for adding to patient notes.",
    }

    if (actionPrompts[action]) {
      sendMessage({ text: actionPrompts[action] })
    }
  }

  const handleSuggestedQuestion = (question) => {
    sendMessage({ text: question })
  }

  // Chat statistics (mock data)
  const chatStats = [
    { label: "Conversations", value: "156" },
    { label: "AI Responses", value: "892" },
    { label: "Avg. Response", value: "0.8s" },
    { label: "Accuracy", value: "98%" },
  ]

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">BearCare AI Chat</h1>
            <p className="text-white/60 mt-1">Your intelligent medical assistant for patient care insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">HIPAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area - Takes remaining space */}
      <div className="flex-1 flex min-h-0">
        {/* Chat Messages - Takes most of the space */}
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-black via-black/90 to-black/80">
          {/* Messages Container - Scrollable */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth custom-scrollbar"
            style={{
              scrollBehavior: "smooth",
              minHeight: 0,
              maxHeight: "calc(100vh - 180px)",
              transition: "box-shadow 0.2s",
            }}
          >
            {messages.length === 0 && (
              <div className="text-center py-12 animate-in fade-in-0 duration-500">
                <Bot className="h-16 w-16 text-white/40 mx-auto mb-6" />
                <p className="text-white/60 mb-8 text-lg">Start a conversation with BearCare AI</p>
                <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                  {suggestedQuestions.map((question, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="text-left justify-start bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:scale-[1.02] transition-all duration-200 text-sm py-3 h-auto"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={clsx(
                  "flex animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={clsx(
                    "max-w-[85%] rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-[1.01]",
                    message.role === "user"
                      ? "bg-white text-black shadow-lg"
                      : "bg-white/10 text-white border border-white/20 backdrop-blur-sm",
                  )}
                >
                  <div className="flex items-center mb-3 space-x-2">
                    {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-blue-400" />}
                    <span className="text-sm font-medium">{message.role === "user" ? "You" : "BearCare AI"}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <div key={index}>{part.text}</div>
                      }
                      return null
                    })}
                  </div>

                  {/* Quick Actions for AI messages */}
                  {message.role === "assistant" && (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                      {quickActions.map((action) => (
                        <button
                          key={action.action}
                          type="button"
                          title={action.tooltip}
                          onClick={() => handleQuickAction(message.id, action.action)}
                          className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white/10 text-white/80 hover:bg-white/20 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30",
                            quickActionMsgId === message.id + action.action && "scale-105 bg-white/30",
                          )}
                        >
                          <action.icon className="h-4 w-4" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {status === "in_progress" && (
              <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                <div className="max-w-[85%] rounded-2xl px-6 py-4 bg-white/10 text-white border border-white/20 backdrop-blur-sm flex items-center gap-3">
                  <Bot className="h-5 w-5 text-blue-400" />
                  <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                  <span className="text-sm">BearCare AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} className="h-4" />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="flex-shrink-0 p-6 border-t border-white/10 bg-black/70 backdrop-blur-sm shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.5)] z-10">
            <form
              className="flex items-center space-x-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
            >
              <Input
                className="flex-1 bg-white/10 text-white border-white/20 placeholder:text-white/40 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-white/30 transition-all duration-200"
                placeholder="Ask about patient care, diagnostics, treatments..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={status === "in_progress"}
                autoFocus
              />
              <Button
                type="submit"
                className="bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-200 rounded-xl px-6 py-3"
                disabled={status === "in_progress" || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar - Fixed width */}
        <div className="w-80 flex-shrink-0 p-6 border-l border-white/10 space-y-6 overflow-y-auto">
          {/* AI Features */}
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Capabilities
              </CardTitle>
              <CardDescription className="text-white/60">What BearCare AI can help with</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{feature.title}</h4>
                    <p className="text-xs text-white/60 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat Statistics */}
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {chatStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="text-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="text-xl font-semibold text-white">{stat.value}</div>
                    <div className="text-xs text-white/60 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
