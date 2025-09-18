"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Heart,
  Activity,
  Pill,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react"

export default function RecordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState(null)

  const patientRecords = [
    {
      id: "P001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      lastVisit: "2025-03-10",
      condition: "Diabetes Type 2",
      status: "stable",
      riskLevel: "medium",
      vitals: {
        bloodPressure: "130/85",
        heartRate: "72 bpm",
        temperature: "98.6°F",
        weight: "185 lbs",
      },
      medications: ["Metformin 500mg", "Lisinopril 10mg"],
      allergies: ["Penicillin", "Shellfish"],
      recentTests: [
        { name: "HbA1c", value: "7.2%", date: "2025-03-05", status: "elevated" },
        { name: "Cholesterol", value: "195 mg/dL", date: "2025-03-05", status: "normal" },
      ],
    },
    {
      id: "P002",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      lastVisit: "2025-03-08",
      condition: "Hypertension",
      status: "improving",
      riskLevel: "low",
      vitals: {
        bloodPressure: "125/80",
        heartRate: "68 bpm",
        temperature: "98.4°F",
        weight: "140 lbs",
      },
      medications: ["Amlodipine 5mg"],
      allergies: ["None known"],
      recentTests: [
        { name: "Blood Pressure", value: "125/80", date: "2025-03-08", status: "improved" },
        { name: "Kidney Function", value: "Normal", date: "2025-03-01", status: "normal" },
      ],
    },
    {
      id: "P003",
      name: "Mike Chen",
      age: 28,
      gender: "Male",
      lastVisit: "2025-03-12",
      condition: "Asthma",
      status: "monitoring",
      riskLevel: "medium",
      vitals: {
        bloodPressure: "118/75",
        heartRate: "75 bpm",
        temperature: "98.2°F",
        weight: "165 lbs",
      },
      medications: ["Albuterol Inhaler", "Fluticasone"],
      allergies: ["Dust mites", "Pollen"],
      recentTests: [
        { name: "Peak Flow", value: "450 L/min", date: "2025-03-12", status: "normal" },
        { name: "Chest X-ray", value: "Clear", date: "2025-02-28", status: "normal" },
      ],
    },
    {
      id: "P004",
      name: "Emily Davis",
      age: 38,
      gender: "Female",
      lastVisit: "2025-03-07",
      condition: "Migraine",
      status: "stable",
      riskLevel: "low",
      vitals: {
        bloodPressure: "115/70",
        heartRate: "65 bpm",
        temperature: "98.1°F",
        weight: "128 lbs",
      },
      medications: ["Sumatriptan", "Propranolol"],
      allergies: ["Aspirin"],
      recentTests: [
        { name: "MRI Brain", value: "Normal", date: "2025-02-15", status: "normal" },
        { name: "Blood Work", value: "Normal", date: "2025-03-01", status: "normal" },
      ],
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "stable":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "improving":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "monitoring":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low":
        return "bg-green-500/20 text-green-300"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300"
      case "high":
        return "bg-red-500/20 text-red-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getTestStatusIcon = (status) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "elevated":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "improved":
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredRecords = patientRecords.filter(
    (record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.condition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Patient Records</h1>
          <p className="text-white/60 mt-1">Manage and view patient medical records</p>
        </div>
        <Button className="bg-white text-black hover:bg-white/90">
          <FileText className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search patients by name, ID, or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/60"
          />
        </div>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Records List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer ${
                selectedRecord?.id === record.id ? "ring-2 ring-white/30" : ""
              }`}
              onClick={() => setSelectedRecord(record)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{record.name}</h3>
                      <p className="text-white/60">
                        {record.id} • {record.age} years • {record.gender}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    <Badge className={getRiskColor(record.riskLevel)}>{record.riskLevel} risk</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Heart className="h-5 w-5 text-red-400 mx-auto mb-1" />
                    <div className="text-sm text-white/60">BP</div>
                    <div className="text-sm font-medium text-white">{record.vitals.bloodPressure}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-sm text-white/60">HR</div>
                    <div className="text-sm font-medium text-white">{record.vitals.heartRate}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-400 mx-auto mb-1" />
                    <div className="text-sm text-white/60">Last Visit</div>
                    <div className="text-sm font-medium text-white">{record.lastVisit}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-sm text-white/60">Condition</div>
                    <div className="text-sm font-medium text-white">{record.condition}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {record.medications.slice(0, 2).map((med, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/80">
                        {med}
                      </Badge>
                    ))}
                    {record.medications.length > 2 && (
                      <Badge variant="outline" className="text-xs border-white/20 text-white/80">
                        +{record.medications.length - 2} more
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Record Details */}
        <div className="space-y-6">
          {selectedRecord ? (
            <>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {selectedRecord.name}
                  </CardTitle>
                  <CardDescription className="text-white/60">Patient Details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-white/60">Patient ID</div>
                      <div className="font-medium text-white">{selectedRecord.id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Age</div>
                      <div className="font-medium text-white">{selectedRecord.age} years</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Gender</div>
                      <div className="font-medium text-white">{selectedRecord.gender}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Last Visit</div>
                      <div className="font-medium text-white">{selectedRecord.lastVisit}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(selectedRecord.vitals).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium text-white">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Pill className="h-5 w-5 mr-2" />
                    Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedRecord.medications.map((med, index) => (
                    <div key={index} className="p-2 bg-white/5 rounded-lg">
                      <span className="text-white text-sm">{med}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Tests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedRecord.recentTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTestStatusIcon(test.status)}
                        <div>
                          <div className="text-sm font-medium text-white">{test.name}</div>
                          <div className="text-xs text-white/60">{test.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{test.value}</div>
                        <Badge className={`text-xs ${getStatusColor(test.status)}`}>{test.status}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Select a patient record to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
