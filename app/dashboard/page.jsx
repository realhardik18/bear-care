"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, FileText, TrendingUp, Clock, AlertCircle, CheckCircle, Activity } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    { icon: Users, label: "Total Patients", value: "1,247", change: "+12%", trend: "up" },
    { icon: Calendar, label: "Today's Appointments", value: "18", change: "+3", trend: "up" },
    { icon: FileText, label: "Records Processed", value: "3,891", change: "+156", trend: "up" },
    { icon: TrendingUp, label: "AI Recommendations", value: "89%", change: "+5%", trend: "up" },
  ]

  const recentPatients = [
    { name: "John Doe", id: "P001", condition: "Diabetes Type 2", status: "stable", lastVisit: "2 days ago" },
    { name: "Sarah Johnson", id: "P002", condition: "Hypertension", status: "improving", lastVisit: "1 week ago" },
    { name: "Mike Chen", id: "P003", condition: "Asthma", status: "monitoring", lastVisit: "3 days ago" },
    { name: "Emily Davis", id: "P004", condition: "Migraine", status: "stable", lastVisit: "5 days ago" },
  ]

  const upcomingAppointments = [
    { time: "9:00 AM", patient: "Alice Brown", type: "Consultation", duration: "30 min" },
    { time: "10:30 AM", patient: "Robert Wilson", type: "Follow-up", duration: "15 min" },
    { time: "2:00 PM", patient: "Lisa Garcia", type: "Check-up", duration: "45 min" },
    { time: "3:30 PM", patient: "David Lee", type: "Consultation", duration: "30 min" },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "stable":
        return "bg-green-500/20 text-green-300"
      case "improving":
        return "bg-blue-500/20 text-blue-300"
      case "monitoring":
        return "bg-yellow-500/20 text-yellow-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/60 mt-1">Welcome back, Dr. Wilson</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/60">Today</div>
          <div className="text-lg font-semibold text-white">March 15, 2025</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">{stat.change}</span>
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Recent Patients
            </CardTitle>
            <CardDescription className="text-white/60">Latest patient interactions and status updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPatients.map((patient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-white">{patient.name}</p>
                      <p className="text-sm text-white/60">
                        {patient.id} • {patient.condition}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                  <p className="text-xs text-white/60 mt-1">{patient.lastVisit}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Schedule
            </CardTitle>
            <CardDescription className="text-white/60">Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{appointment.patient}</p>
                    <p className="text-sm text-white/60">
                      {appointment.type} • {appointment.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{appointment.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription className="text-white/60">Recent AI-powered insights for your patients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="font-medium text-green-400">Treatment Success</span>
              </div>
              <p className="text-sm text-white/80">Patient John Doe&apos;s diabetes management showing 15% improvement</p>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span className="font-medium text-yellow-400">Attention Needed</span>
              </div>
              <p className="text-sm text-white/80">3 patients require medication dosage adjustments</p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-blue-400">Trending Up</span>
              </div>
              <p className="text-sm text-white/80">Overall patient satisfaction increased by 8% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
