"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  User,
  FileText,
  Pill,
  Activity,
  TestTube,
  AlertCircle,
  CheckCircle,
  Filter,
} from "lucide-react"

export default function TimelinePage() {
  const [selectedPatient, setSelectedPatient] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days")

  const timelineEvents = [
    {
      id: 1,
      patientId: "P001",
      patientName: "John Doe",
      type: "appointment",
      title: "Follow-up Consultation",
      description: "Diabetes management review and medication adjustment",
      date: "2025-03-15",
      time: "10:30 AM",
      status: "completed",
      details: {
        provider: "Dr. Sarah Wilson",
        duration: "30 minutes",
        notes: "Patient showing good glucose control. Continue current medication regimen.",
      },
    },
    {
      id: 2,
      patientId: "P002",
      patientName: "Sarah Johnson",
      type: "test_result",
      title: "Blood Pressure Reading",
      description: "Routine BP monitoring",
      date: "2025-03-14",
      time: "2:15 PM",
      status: "normal",
      details: {
        result: "125/80 mmHg",
        provider: "Nurse Jennifer",
        notes: "Significant improvement from last reading. Continue current treatment.",
      },
    },
    {
      id: 3,
      patientId: "P001",
      patientName: "John Doe",
      type: "medication",
      title: "Medication Prescribed",
      description: "Metformin dosage increased",
      date: "2025-03-13",
      time: "11:00 AM",
      status: "active",
      details: {
        medication: "Metformin 1000mg",
        frequency: "Twice daily",
        provider: "Dr. Sarah Wilson",
        notes: "Increased dosage due to elevated HbA1c levels.",
      },
    },
    {
      id: 4,
      patientId: "P003",
      patientName: "Mike Chen",
      type: "vital_signs",
      title: "Vital Signs Recorded",
      description: "Routine vital signs check",
      date: "2025-03-12",
      time: "9:45 AM",
      status: "normal",
      details: {
        bloodPressure: "118/75",
        heartRate: "75 bpm",
        temperature: "98.2°F",
        weight: "165 lbs",
        provider: "Nurse Michael",
      },
    },
    {
      id: 5,
      patientId: "P004",
      patientName: "Emily Davis",
      type: "lab_result",
      title: "Blood Work Results",
      description: "Complete metabolic panel",
      date: "2025-03-11",
      time: "8:30 AM",
      status: "normal",
      details: {
        tests: ["CBC", "CMP", "Lipid Panel"],
        provider: "Lab Tech",
        notes: "All values within normal range.",
      },
    },
    {
      id: 6,
      patientId: "P002",
      patientName: "Sarah Johnson",
      type: "appointment",
      title: "Initial Consultation",
      description: "New patient hypertension evaluation",
      date: "2025-03-08",
      time: "3:00 PM",
      status: "completed",
      details: {
        provider: "Dr. Sarah Wilson",
        duration: "45 minutes",
        notes: "Diagnosed with stage 1 hypertension. Started on Amlodipine 5mg daily.",
      },
    },
    {
      id: 7,
      patientId: "P001",
      patientName: "John Doe",
      type: "lab_result",
      title: "HbA1c Test Result",
      description: "Diabetes monitoring",
      date: "2025-03-05",
      time: "7:00 AM",
      status: "elevated",
      details: {
        result: "7.2%",
        target: "< 7.0%",
        provider: "Lab Tech",
        notes: "Slightly elevated. Medication adjustment recommended.",
      },
    },
    {
      id: 8,
      patientId: "P003",
      patientName: "Mike Chen",
      type: "medication",
      title: "Inhaler Refill",
      description: "Albuterol inhaler prescription renewed",
      date: "2025-03-03",
      time: "4:20 PM",
      status: "active",
      details: {
        medication: "Albuterol Inhaler",
        quantity: "2 inhalers",
        provider: "Dr. Sarah Wilson",
        notes: "Patient reports good symptom control.",
      },
    },
  ]

  const patients = [
    { id: "all", name: "All Patients" },
    { id: "P001", name: "John Doe" },
    { id: "P002", name: "Sarah Johnson" },
    { id: "P003", name: "Mike Chen" },
    { id: "P004", name: "Emily Davis" },
  ]

  const getEventIcon = (type) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-400" />
      case "medication":
        return <Pill className="h-5 w-5 text-green-400" />
      case "test_result":
      case "lab_result":
        return <TestTube className="h-5 w-5 text-purple-400" />
      case "vital_signs":
        return <Activity className="h-5 w-5 text-red-400" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "normal":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "active":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "elevated":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "active":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "elevated":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredEvents = timelineEvents.filter((event) => {
    if (selectedPatient === "all") return true
    return event.patientId === selectedPatient
  })

  const groupEventsByDate = (events) => {
    const grouped = events.reduce(
      (acc, event) => {
        const date = event.date
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(event)
        return acc
      },
      {},
    )

    // Sort dates in descending order
    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => ({
        date,
        events: grouped[date].sort((a, b) => b.time.localeCompare(a.time)),
      }))
  }

  const groupedEvents = groupEventsByDate(filteredEvents)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Patient Timeline</h1>
          <p className="text-white/60 mt-1">Track patient care history and events</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-white text-black hover:bg-white/90">
            <FileText className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id} className="text-white hover:bg-white/10">
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="7days" className="text-white hover:bg-white/10">
                Last 7 days
              </SelectItem>
              <SelectItem value="30days" className="text-white hover:bg-white/10">
                Last 30 days
              </SelectItem>
              <SelectItem value="90days" className="text-white hover:bg-white/10">
                Last 90 days
              </SelectItem>
              <SelectItem value="all" className="text-white hover:bg-white/10">
                All time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {groupedEvents.map((group) => (
          <div key={group.date} className="space-y-4">
            {/* Date Header */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-white/60" />
                <h2 className="text-xl font-semibold text-white">{formatDate(group.date)}</h2>
              </div>
              <div className="flex-1 h-px bg-white/10"></div>
              <Badge variant="outline" className="border-white/20 text-white/80">
                {group.events.length} events
              </Badge>
            </div>

            {/* Events */}
            <div className="space-y-4 ml-6">
              {group.events.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline Line */}
                  {index < group.events.length - 1 && (
                    <div className="absolute left-6 top-12 w-px h-16 bg-white/10"></div>
                  )}

                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className="p-3 bg-white/10 rounded-lg flex-shrink-0">{getEventIcon(event.type)}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                              <p className="text-white/60 text-sm">{event.description}</p>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                              {getStatusIcon(event.status)}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2 text-white/60 text-sm">
                              <User className="h-4 w-4" />
                              <span>{event.patientName}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/60 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="bg-white/5 rounded-lg p-4 space-y-2">
                            {Object.entries(event.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-start">
                                <span className="text-white/60 text-sm capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}:
                                </span>
                                <span className="text-white text-sm text-right max-w-xs">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-12 text-center">
              <Clock className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
              <p className="text-white/60">No timeline events match your current filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
