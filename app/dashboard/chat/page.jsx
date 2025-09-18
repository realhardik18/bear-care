"use client"

import React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Shield, Zap, User, Bot, Database, Loader2, BookOpen, Info, Plus, Send, AtSign } from "lucide-react"
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
  const [showTagInput, setShowTagInput] = React.useState(false)
  const [patientId, setPatientId] = React.useState("")
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

  const handleExplain = () => {
    if (messages.length === 0) return
    const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
    if (lastAssistantMessage) {
      sendMessage({ text: "Please explain your previous response in more detail with medical reasoning and context." })
    }
  }

  const handleCite = () => {
    if (messages.length === 0) return
    const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
    if (lastAssistantMessage) {
      sendMessage({ text: "Please provide medical sources, references, and evidence for your previous response." })
    }
  }

  const handleTag = () => {
    if (showTagInput && patientId.trim()) {
      const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
      if (lastAssistantMessage) {
        sendMessage({
          text: `Please format your previous response as a message to be sent to patient @${patientId}. Make it patient-friendly and include relevant care instructions.`,
        })
        setPatientId("")
        setShowTagInput(false)
      }
    } else {
      setShowTagInput(true)
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
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">BearCare AI Chat</h1>
            <p className="text-white/60 text-sm">Your intelligent medical assistant for patient care insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-xs font-medium">HIPAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area - Takes remaining space */}
      <div className="flex-1 flex min-h-0">
        {/* Chat Messages - Takes most of the space */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages Container - Scrollable */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.3) transparent",
            }}
          >
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
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
                    "max-w-[80%] rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-[1.01]",
                    message.role === "user"
                      ? "bg-white text-black shadow-lg"
                      : "bg-white/10 text-white border border-white/20 backdrop-blur-sm",
                  )}
                >
                  <div className="flex items-center mb-3 space-x-2">
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-blue-400" />}
                    <span className="text-xs font-medium">{message.role === "user" ? "You" : "BearCare AI"}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed text-sm">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <div key={index}>{part.text}</div>
                      }
                      return null
                    })}
                  </div>
                </div>
              </div>
            ))}

            {status === "in_progress" && (
              <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-white/10 text-white border border-white/20 backdrop-blur-sm flex items-center gap-3">
                  <Bot className="h-4 w-4 text-blue-400" />
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-xs">BearCare AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} className="h-4" />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-white/10 bg-black/80 backdrop-blur-sm space-y-3">
            {/* Tag Input Row */}
            {showTagInput && (
              <div className="flex items-center space-x-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <AtSign className="h-4 w-4 text-white/60" />
                <Input
                  className="flex-1 bg-white/10 text-white border-white/20 placeholder:text-white/40 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  placeholder="Enter patient ID (e.g., 12345)"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTag()
                    } else if (e.key === "Escape") {
                      setShowTagInput(false)
                      setPatientId("")
                    }
                  }}
                  autoFocus
                />
                <Button
                  onClick={handleTag}
                  className="bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-2 text-sm"
                  disabled={!patientId.trim()}
                >
                  Send to Patient
                </Button>
                <Button
                  onClick={() => {
                    setShowTagInput(false)
                    setPatientId("")
                  }}
                  variant="outline"
                  className="border-white/20 text-white/80 hover:bg-white/10 rounded-xl px-4 py-2 text-sm"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Main Input Row */}
            <div className="flex items-center space-x-3">
              <form
                className="flex-1 flex items-center space-x-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
              >
                <Input
                  className="flex-1 bg-white/10 text-white border-white/20 placeholder:text-white/40 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  placeholder="Ask about patient care, diagnostics, treatments..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status === "in_progress"}
                  autoFocus={!showTagInput}
                />
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
                  disabled={status === "in_progress" || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleExplain}
                  disabled={messages.filter((m) => m.role === "assistant").length === 0}
                  className="bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-xl px-3 py-3"
                  title="Explain the last AI response in detail"
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleCite}
                  disabled={messages.filter((m) => m.role === "assistant").length === 0}
                  className="bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-xl px-3 py-3"
                  title="Show sources and references"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleTag}
                  disabled={messages.filter((m) => m.role === "assistant").length === 0}
                  className="bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-200 rounded-xl px-3 py-3"
                  title="Tag and send to patient"
                >
                  <AtSign className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Fixed width and scrollable */}
        <div className="w-72 flex-shrink-0 border-l border-white/10 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* AI Features */}
            <Card className="bg-black/80 border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center text-sm">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Capabilities
                </CardTitle>
                <CardDescription className="text-white/60 text-xs">What BearCare AI can help with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                      <feature.icon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-xs">{feature.title}</h4>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
