"use client"

import { useState, useEffect } from "react"
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
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 5

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true)
      try {
        const res = await fetch("/api/records")
        const data = await res.json()
        setRecords(data)
      } catch (e) {
        setRecords([])
      }
      setLoading(false)
    }
    fetchRecords()
  }, [])

  // Helper for resourceType badge color
  const getResourceColor = (type) => {
    switch (type) {
      case "Observation":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "Condition":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Procedure":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "AllergyIntolerance":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getTestStatusIcon = (status) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "elevated":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "improved":F
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredRecords = records.filter(
    (record) =>
      (record.description && record.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.resourceType && record.resourceType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.value && String(record.value).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.unit && record.unit.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.date && record.date.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage,
  )

  const totalPages = Math.ceil(filteredRecords.length / resultsPerPage)

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
            placeholder="Search by description, type, value, or date..."
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
          {loading ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center text-white/60">Loading records...</CardContent>
            </Card>
          ) : paginatedRecords.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center text-white/60">No records found.</CardContent>
            </Card>
          ) : (
            paginatedRecords.map((record) => (
              <Card
                key={record._id}
                className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer ${
                  selectedRecord?._id === record._id ? "ring-2 ring-white/30" : ""
                }`}
                onClick={() => setSelectedRecord(record)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/10 rounded-lg">
                        {/* Icon by resourceType */}
                        {record.resourceType === "Observation" && <Activity className="h-6 w-6 text-blue-300" />}
                        {record.resourceType === "Condition" && <Heart className="h-6 w-6 text-yellow-300" />}
                        {record.resourceType === "Procedure" && <FileText className="h-6 w-6 text-purple-300" />}
                        {record.resourceType === "AllergyIntolerance" && <AlertTriangle className="h-6 w-6 text-red-300" />}
                        {!["Observation", "Condition", "Procedure", "AllergyIntolerance"].includes(record.resourceType) && (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{record.description}</h3>
                        <p className="text-white/60">
                          {record.resourceType}
                          {record.value !== undefined && (
                            <>
                              {" • "}
                              <span className="font-medium text-white">{record.value}</span>
                              {record.unit && <span className="text-white/60"> {record.unit}</span>}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getResourceColor(record.resourceType)}>{record.resourceType}</Badge>
                      <div className="text-xs text-white/50">{record.date}</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Pagination */}
          {!loading && filteredRecords.length > 0 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Record Details */}
        <div className="space-y-6">
          {selectedRecord ? (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {/* Icon by resourceType */}
                  {selectedRecord.resourceType === "Observation" && <Activity className="h-5 w-5 mr-2 text-blue-300" />}
                  {selectedRecord.resourceType === "Condition" && <Heart className="h-5 w-5 mr-2 text-yellow-300" />}
                  {selectedRecord.resourceType === "Procedure" && <FileText className="h-5 w-5 mr-2 text-purple-300" />}
                  {selectedRecord.resourceType === "AllergyIntolerance" && <AlertTriangle className="h-5 w-5 mr-2 text-red-300" />}
                  {!["Observation", "Condition", "Procedure", "AllergyIntolerance"].includes(selectedRecord.resourceType) && (
                    <User className="h-5 w-5 mr-2 text-white" />
                  )}
                  {selectedRecord.resourceType}
                </CardTitle>
                <CardDescription className="text-white/60">Record Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-white/60">Description</div>
                  <div className="font-medium text-white">{selectedRecord.description}</div>
                </div>
                {selectedRecord.value !== undefined && (
                  <div>
                    <div className="text-sm text-white/60">Value</div>
                    <div className="font-medium text-white">
                      {selectedRecord.value} {selectedRecord.unit}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-white/60">Date</div>
                  <div className="font-medium text-white">{selectedRecord.date}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Record ID</div>
                  <div className="font-medium text-white">{selectedRecord._id}</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Select a record to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
