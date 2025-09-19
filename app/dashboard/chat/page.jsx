"use client"

import React, { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Shield, Zap, User, Bot, Database, Loader2, BookOpen, Info, Plus, Send, AtSign, Clipboard, Calendar, HeartPulse, FileText, CheckCircle } from "lucide-react"
import clsx from "clsx"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"
import dynamic from "next/dynamic"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components to avoid "not a registered scale" error
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Dynamically import Chart to avoid SSR issues
const Chart = dynamic(() => import("react-chartjs-2").then(mod => mod.Chart), { ssr: false });

const aiFeatures = [
  {
    icon: Brain,
    title: "Medical AI Assistant",
    description: "Get instant insights from patient FHIR records and medical data.",
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
  const [patientResults, setPatientResults] = React.useState([])
  const [mentioning, setMentioning] = React.useState(false)
  const [cursorPosition, setCursorPosition] = React.useState(0)
  const [fetchingContext, setFetchingContext] = React.useState(false)
  const [activePatient, setActivePatient] = React.useState(null)
  const [showPatientSummary, setShowPatientSummary] = React.useState(false)
  const [mentionedPatients, setMentionedPatients] = React.useState([]);
  const [loadingPatients, setLoadingPatients] = React.useState(false);
  const [showRecordsModal, setShowRecordsModal] = React.useState(false); // <-- Add this line
  const [collapsedPatientPanel, setCollapsedPatientPanel] = React.useState(false);
  const [notes, setNotes] = useState([]);
  const [formatting, setFormatting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [formattedNotes, setFormattedNotes] = useState("");
  const inputRef = React.useRef(null)
  const messagesContainerRef = React.useRef(null)
  const chatEndRef = React.useRef(null)
  const { toast } = useToast()

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  React.useEffect(() => {
    // Handle @ mention detection
    const atIndex = input.lastIndexOf('@', cursorPosition);
    if (atIndex !== -1 && (atIndex === 0 || input[atIndex - 1] === ' ')) {
      const searchText = input.substring(atIndex + 1, cursorPosition).trim();
      if (searchText) {
        setMentioning(true);
        searchPatients(searchText);
      } else {
        setMentioning(false);
        setPatientResults([]);
      }
    } else {
      setMentioning(false);
      setPatientResults([]);
    }
  }, [input, cursorPosition]);

  const searchPatients = async (searchText) => {
    try {
      const response = await fetch(`/api/patients?search=${encodeURIComponent(searchText)}`);
      if (response.ok) {
        const data = await response.json();
        setPatientResults(data.slice(0, 5)); // Limit to 5 results
      }
    } catch (error) {
      console.error("Failed to search patients:", error);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Remove handleTag and tag input logic

  // Extract all @int mentions from all messages
  React.useEffect(() => {
    const regex = /@(\d+)/g;
    const ids = new Set();
    messages.forEach(msg => {
      msg.parts?.forEach(part => {
        if (part.type === "text") {
          let match;
          while ((match = regex.exec(part.text)) !== null) {
            ids.add(match[1]);
          }
        }
      });
    });
    if (ids.size === 0) {
      setMentionedPatients([]);
      return;
    }
    setLoadingPatients(true);
    // Fetch all mentioned patients and their records
    Promise.all(
      Array.from(ids).map(async id => {
        const patientRes = await fetch(`/api/patients?id=${id}`);
        let patient = { id };
        if (patientRes.ok) {
          patient = await patientRes.json();
        }
        const recordsRes = await fetch(`/api/records?id=${id}`);
        if (recordsRes.ok) {
          patient.records = await recordsRes.json();
        } else {
          patient.records = [];
        }
        return patient;
      })
    ).then(setMentionedPatients).finally(() => setLoadingPatients(false));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput("")
  }

  // Remove handleExplain and handleCite, add handleSuggest
  const handleSuggest = () => {
    sendMessage({ text: "suggest: suggest 3 ways to fix this issue" });
  }

  const handleSuggestedQuestion = (question) => {
    sendMessage({ text: question })
  }

  // Add missing createPatientSummary function
  function createPatientSummary(patient) {
    if (!patient) return "";
    let summary = `Patient ID: ${patient.id}\n`;
    summary += `Name: ${patient.name || "Unknown"}\n`;
    summary += `Age: ${patient.age || "Unknown"} years\n`;
    summary += `Gender: ${patient.gender || "Unknown"}\n`;
    if (patient.conditions && patient.conditions.length > 0) {
      summary += `\nMedical Conditions:\n`;
      patient.conditions.forEach(condition => {
        summary += `- ${condition}\n`;
      });
    }
    if (patient.medications && patient.medications.length > 0) {
      summary += `\nCurrent Medications:\n`;
      patient.medications.forEach(med => {
        summary += `- ${med}\n`;
      });
    }
    if (patient.records && patient.records.length > 0) {
      summary += `\nMedical Records: ${patient.records.length} records available\n`;
      const recentRecords = [...patient.records]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
      summary += `\nRecent Medical History:\n`;
      recentRecords.forEach(record => {
        const date = record.date ? new Date(record.date).toLocaleDateString() : "Unknown date";
        summary += `- ${date}: ${record.type || "Visit"} - ${record.summary || record.description || "No details available"}\n`;
      });
    }
    return summary;
  }

  // Add missing handlePatientClick function
  function handlePatientClick(patient) {
    setActivePatient(patient);
    setShowPatientSummary(true);
  }

  // Add missing handleCloseSummary function
  function handleCloseSummary() {
    setShowPatientSummary(false);
  }

  // Format message text to highlight patient mentions in blue
  const formatMessageText = (text) => {
    if (!text) return text;
    const parts = [];
    let lastIndex = 0;
    const regex = /@(\d+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>);
      }
      const patientIdMatch = match[1];
      parts.push(
        <span
          key={`mention-${match.index}`}
          className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium mx-0.5 bg-blue-700/60 text-blue-200 font-bold"
        >
          @{patientIdMatch}
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(<span key={'text-end'}>{text.substring(lastIndex)}</span>);
    }
    return parts;
  };

  // Handle dismissing the welcome popup without importing
  const handleDismissWelcome = () => {
    setShowWelcomePopup(false);
    toast({
      title: "Welcome to BearCare AI",
      description: "You can mention patients using @ in your messages",
      variant: "default",
    });
  };

  // Handle importing the patient from the welcome popup
  const handleImportPatient = async () => {
    setFetchingContext(true);
    try {
      const response = await fetch(`/api/context?id=${importedPatient.id}`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setMentionedPatients([importedPatient]);
        setShowWelcomePopup(false);
        toast({
          title: "Patient context loaded",
          description: `Patient #${importedPatient.id} data has been loaded for context`,
          variant: "default",
        });
        sendMessage({
          text: `Patient #${importedPatient.id} data has been loaded for context.\n\n${data.context}`,
        });
      } else {
        throw new Error("Failed to import patient context");
      }
    } catch (error) {
      console.error("Failed to import patient context:", error);
      toast({
        title: "Error importing patient context",
        description: "Failed to import patient data",
        variant: "destructive",
      });
    } finally {
      setFetchingContext(false);
    }
  };

  // Helper to get all records for the first mentioned patient
  const getLoadedPatientRecords = () => {
    if (mentionedPatients.length > 0 && mentionedPatients[0].records) {
      return mentionedPatients[0].records;
    }
    return [];
  };

  // Helper to render chartjs code blocks
  function renderChartJsBlock(code) {
    try {
      const config = JSON.parse(code);
      if (!config || !config.type || !config.data) return <pre>{code}</pre>;
      // Chart.js expects type, data, options
      return (
        <div className="my-4 bg-black/40 rounded-lg p-4 border border-blue-700/30">
          <Chart type={config.type} data={config.data} options={config.options || {}} />
        </div>
      );
    } catch (e) {
      return <pre>{code}</pre>;
    }
  }

  // Markdown rendering for chat, with chartjs code block support
  const renderMarkdown = (text) => (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          // Detect chartjs code block
          if (!inline && className && className.startsWith("language-chartjs")) {
            // Fix: children can be undefined, string, or array
            let codeString = "";
            if (Array.isArray(children)) {
              codeString = children.join("");
            } else if (typeof children === "string") {
              codeString = children;
            } else if (children) {
              codeString = String(children);
            }
            return renderChartJsBlock(codeString);
          }
          return (
            <code
              {...props}
              className={className ? className : "bg-gray-800 text-green-400 px-1 rounded"}
            >
              {children}
            </code>
          );
        },
        a: props => <a {...props} className="underline text-blue-400" target="_blank" rel="noopener noreferrer" />,
        pre: props => <pre {...props} className="bg-gray-900 text-green-300 p-2 rounded overflow-x-auto" />,
        ul: props => <ul {...props} className="list-disc ml-6" />,
        ol: props => <ol {...props} className="list-decimal ml-6" />,
        li: props => <li {...props} className="mb-1" />,
        blockquote: props => <blockquote {...props} className="border-l-4 border-blue-400 pl-4 text-blue-200" />,
        strong: props => <strong {...props} className="font-semibold" />,
        em: props => <em {...props} className="italic" />,
        h1: props => <h1 {...props} className="text-xl font-bold mt-4 mb-2" />,
        h2: props => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
        h3: props => <h3 {...props} className="text-base font-bold mt-2 mb-1" />,
      }}
    >
      {text}
    </ReactMarkdown>
  );

  // Notes state

  // Add message to notes
  const handleAddToNotes = (message) => {
    setNotes((prev) => [...prev, message]);
  };

  // Format notes with AI
  const handleFormatWithAI = async () => {
    setFormatting(true);
    try {
      const res = await fetch("/api/enhance/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.map(m => m.parts.map(p => p.text).join("\n")) }),
      });
      if (res.ok) {
        // Assume markdown text is returned as plain text for preview
        const blob = await res.blob();
        const text = await blob.text();
        setFormattedNotes(text);
      }
    } finally {
      setFormatting(false);
    }
  };

  // Export notes as PDF
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.map(m => m.parts.map(p => p.text).join("\n")) }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "BearCare-Notes.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">BearCare AI Chat</h1>
            <p className="text-white/60 text-sm">Your intelligent medical assistant for patient care insights</p>
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
                        // Render markdown for all messages
                        return <div key={index}>{renderMarkdown(part.text)}</div>
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

            {fetchingContext && (
              <div className="flex justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-blue-600/20 text-white border border-blue-500/30 backdrop-blur-sm flex items-center gap-3">
                  <Database className="h-4 w-4 text-blue-400" />
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-xs">Loading patient data for context...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} className="h-4" />
          </div>

          {/* Floating button for patient records modal */}
          {/* Remove duplicate buttons: only show one if there are records */}
          {mentionedPatients.length > 0 &&
            mentionedPatients.some(p => p.records && p.records.length > 0) && !showRecordsModal && (
            <button
              className="fixed bottom-6 right-6 z-40 bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
              onClick={() => setShowRecordsModal(true)}
              title="View loaded patient records"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium text-sm">View Patient Records</span>
            </button>
          )}

          {/* Modal for patient records */}
          {showRecordsModal && mentionedPatients.length > 0 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
              <div className="bg-black border border-white/20 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button
                  className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/10 rounded-full p-2"
                  onClick={() => setShowRecordsModal(false)}
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="p-8">
                  <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-400" />
                    Patient Records
                  </h2>
                  {mentionedPatients.every(p => !p.records || p.records.length === 0) ? (
                    <div className="text-white/70">No records available.</div>
                  ) : (
                    <div className="space-y-8">
                      {mentionedPatients.filter(p => p.records && p.records.length > 0).map((patient, idx) => (
                        <div key={patient.id}>
                          <div className="mb-2 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-300" />
                            <span className="text-white font-semibold">{patient.name || `Patient #${patient.id}`}</span>
                            <span className="ml-2 text-xs text-blue-300 bg-blue-600/30 rounded px-2 py-0.5 font-bold">@{patient.id}</span>
                          </div>
                          <div className="space-y-6">
                            {patient.records.map((record, ridx) => (
                              <div key={ridx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-blue-300 mr-2" />
                                    <span className="text-white/80 text-xs">{record.date ? new Date(record.date).toLocaleDateString() : "Unknown date"}</span>
                                  </div>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-200">
                                    {record.type || "Visit"}
                                  </span>
                                </div>
                                <h4 className="text-white font-semibold mb-1">{record.title || record.type || "Medical Record"}</h4>
                                <div className="text-white/80 text-xs mb-2">
                                  {record.summary || record.description || "No details available"}
                                </div>
                                <pre className="bg-black/40 text-green-200 text-xs rounded p-2 overflow-x-auto">
                                  {JSON.stringify(record, null, 2)}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-white/10 bg-black/80 backdrop-blur-sm space-y-3">
            {/* Patient Search Results */}
            {mentioning && patientResults.length > 0 && (
              <div className="absolute bottom-24 left-4 right-4 max-h-48 overflow-y-auto bg-black/90 border border-white/20 rounded-xl shadow-lg z-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                <div className="p-2 text-xs text-white/60 border-b border-white/10">
                  Patient matches
                </div>
                <div className="p-1">
                  {patientResults.map(patient => (
                    <div
                      key={patient.id}
                      className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-200"
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <div className="p-1.5 bg-blue-600/30 rounded-lg">
                        <User className="h-3 w-3 text-blue-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {patient.name || `Patient #${patient.id}`}
                        </div>
                        <div className="text-xs text-white/60">
                          ID: {patient.id} • {patient.age} y/o • {patient.gender}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  ref={inputRef}
                  className="flex-1 bg-white/10 text-white border-white/20 placeholder:text-white/40 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  placeholder="Ask about patient care, diagnostics, treatments... (use @ to mention a patient)"
                  value={input}
                  onChange={handleInputChange}
                  onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
                  onClick={(e) => setCursorPosition(e.target.selectionStart)}
                  disabled={status === "in_progress" || fetchingContext}
                  autoFocus
                />
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-200 rounded-xl px-4 py-3"
                  disabled={status === "in_progress" || fetchingContext || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSuggest}
                  disabled={status === "in_progress" || fetchingContext}
                  className="bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 hover:scale-105 transition-all duration-200 rounded-xl px-3 py-3"
                  title="Suggest 3 ways to fix this issue"
                >
                  <Info className="h-4 w-4" />
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
            {/* Patient Context Section */}
            {mentionedPatients.length > 0 && (
              <Card className="bg-black/80 border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-sm">
                    <Database className="h-4 w-4 mr-2" />
                    Patient Context
                  </CardTitle>
                  <CardDescription className="text-white/60 text-xs">
                    {mentionedPatients.length} patient{mentionedPatients.length > 1 ? 's' : ''} in this conversation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mentionedPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        activePatient?.id === patient.id
                          ? "bg-blue-900/30 border border-blue-500/30"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                      onClick={() => handlePatientClick(patient)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded-lg mr-2 ${
                            activePatient?.id === patient.id ? "bg-blue-600/50" : "bg-blue-600/30"
                          }`}>
                            <User className="h-3 w-3 text-blue-300" />
                          </div>
                          <span className="text-white text-xs font-medium">
                            {patient.name || `Patient #${patient.id}`}
                          </span>
                        </div>
                        <span className="inline-flex items-center rounded bg-blue-600/30 px-1.5 py-0.5 text-xs font-medium text-blue-300">
                          <AtSign className="h-3 w-3 mr-1" />
                          {patient.id}
                        </span>
                      </div>
                      <div className="text-xs text-white/60 space-y-1 mt-2">
                        <p>{patient.age} years • {patient.gender}</p>
                        {patient.records && (
                          <div className="flex items-center mt-1">
                            <FileText className="h-3 w-3 mr-1 text-white/40" />
                            <span>{patient.records.length} records</span>
                          </div>
                        )}
                        {activePatient?.id === patient.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2 h-6 text-xs text-blue-300 hover:text-blue-200 hover:bg-blue-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPatientSummary(true);
                            }}
                          >
                            View details
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Patient Summary Modal */}
      {showPatientSummary && activePatient && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
          <div className="bg-black/90 border border-white/20 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600/30 rounded-lg mr-3">
                  <User className="h-4 w-4 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {activePatient.name || `Patient #${activePatient.id}`}
                  </h3>
                  <div className="flex items-center text-white/60 text-xs mt-1">
                    <AtSign className="h-3 w-3 mr-1" />
                    <span>{activePatient.id}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 h-auto"
                onClick={handleCloseSummary}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
                  <Clipboard className="h-4 w-4 mr-2 text-blue-400" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-xs">Age</div>
                    <div className="text-white mt-1">{activePatient.age || "Unknown"} years</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-xs">Gender</div>
                    <div className="text-white mt-1">{activePatient.gender || "Unknown"}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-xs">Birth Date</div>
                    <div className="text-white mt-1">{activePatient.birthDate || "Unknown"}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-xs">Blood Type</div>
                    <div className="text-white mt-1">{activePatient.bloodType || "Unknown"}</div>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              {activePatient.conditions && activePatient.conditions.length > 0 && (
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
                    <HeartPulse className="h-4 w-4 mr-2 text-blue-400" />
                    Medical Conditions
                  </h4>
                  <div className="bg-white/5 rounded-lg p-3">
                    <ul className="space-y-2">
                      {activePatient.conditions.map((condition, index) => (
                        <li key={index} className="text-white text-sm flex items-start">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 mr-2"></div>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Medications */}
              {activePatient.medications && activePatient.medications.length > 0 && (
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                      <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"></path>
                      <path d="m5 19 4 4"></path>
                      <path d="M14 5 9 1"></path>
                      <path d="M14 12 7 19"></path>
                    </svg>
                    Current Medications
                  </h4>
                  <div className="bg-white/5 rounded-lg p-3">
                    <ul className="space-y-2">
                      {activePatient.medications.map((medication, index) => (
                        <li key={index} className="text-white text-sm flex items-start">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 mr-2"></div>
                          {medication}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Medical Records */}
              {activePatient.records && activePatient.records.length > 0 && (
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-400" />
                    Medical Records
                  </h4>
                  <div className="space-y-3">
                    {activePatient.records
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 5)
                      .map((record, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 text-white/60 mr-2" />
                              <span className="text-white/80 text-xs">{new Date(record.date).toLocaleDateString()}</span>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                              {record.type || "Visit"}
                            </span>
                          </div>
                          <h5 className="text-white text-sm font-medium mb-1">
                            {record.title || record.type || "Medical Record"}
                          </h5>
                          <p className="text-white/70 text-xs">
                            {record.summary || record.description || "No details available"}
                          </p>
                        </div>
                      ))}

                    {activePatient.records.length > 5 && (
                      <div className="text-center text-xs text-white/60 mt-2">
                        +{activePatient.records.length - 5} more records available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex justify-end space-x-3 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white/80 border-white/20 hover:bg-white/10"
                  onClick={handleCloseSummary}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    handleCloseSummary();

                    // Prepare a message to ask about this patient
                    const newMessage = `Please tell me more about patient @${activePatient.id}'s medical history and current status.`;

                    // Set the input to this message
                    setInput(newMessage);

                    // Focus the input
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 100);
                  }}
                >
                  Ask about this patient
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
