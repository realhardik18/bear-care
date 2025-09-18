"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  UserPlus,
  Eye,
  X,
  User,
  Calendar,
  Activity,
  Pill,
  FileText,
  ChevronRight,
  Phone,
  Clipboard,
  Clock,
  FileSymlink,
  Stethoscope,
  UserCheck,
  Copy,
  Check,
  SlidersHorizontal,
} from "lucide-react"

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientRecords, setPatientRecords] = useState([])
  const [newPatient, setNewPatient] = useState({
    id: Math.floor(Math.random() * 899) + 101,
    name: "",
    gender: "",
    birthDate: "",
    telecom: "",
  })
  const [hoveredCard, setHoveredCard] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [filters, setFilters] = useState({
    gender: "any", // Changed from empty string to "any"
    minAge: 0,
    maxAge: 100,
  })
  const resultsPerPage = 5

  // Helper functions (moved to the top before they're used)
  // Helper to calculate age from birthDate
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A"
    const dob = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  // Format birthDate to a more readable format
  const formatBirthDate = (birthDate) => {
    if (!birthDate) return "N/A"
    const date = new Date(birthDate)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  useEffect(() => {
    async function fetchPatients() {
      console.log("[v0] Fetching patients from API...")
      setLoading(true)
      try {
        const res = await fetch("/api/patients")
        const data = await res.json()
        setPatients(data)
        console.log("[v0] Successfully loaded patients:", data.length)
      } catch (e) {
        console.error("[v0] Error fetching patients:", e)
        setPatients([])
      }
      setLoading(false)
    }
    fetchPatients()
  }, [])

  const fetchPatientRecords = async (id) => {
    console.log(`[v0] Fetching records for patient ID: ${id}`)
    try {
      const res = await fetch(`/api/records?id=${id}`)
      const data = await res.json()
      setPatientRecords(data)
      console.log("[v0] Patient records loaded:", data.length)
    } catch (e) {
      console.error("[v0] Error fetching patient records:", e)
      setPatientRecords([])
    }
  }

  const handleAddPatient = async () => {
    console.log("[v0] Adding new patient:", newPatient.name)
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      })
      if (res.ok) {
        setPatients((prev) => [...prev, newPatient])
        setNewPatient({ id: Math.floor(Math.random() * 899) + 101, name: "", gender: "", birthDate: "", telecom: "" })
        setIsDialogOpen(false)
        console.log("[v0] Patient added successfully")
      }
    } catch (e) {
      console.error("[v0] Failed to add patient:", e)
    }
  }

  const handlePatientClick = (patient) => {
    console.log(`[v0] Selected patient: ${patient.name} (ID: ${patient.id})`)
    setSelectedPatient(patient)
    setIsSidebarOpen(true)
    fetchPatientRecords(patient.id)
  }

  const handleCopyId = (e, id) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id.toString())
      .then(() => {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
        console.log(`[v0] Copied patient ID: ${id} to clipboard`)
      })
      .catch(err => {
        console.error('[v0] Failed to copy ID:', err)
      })
  }

  const applyFilters = () => {
    setIsFilterDialogOpen(false)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const resetFilters = () => {
    setFilters({
      gender: "any", // Changed from empty string to "any"
      minAge: 0,
      maxAge: 100,
    })
  }

  const filteredPatients = patients.filter(
    (patient) => {
      // Text search filter
      const matchesSearch =
        (patient.name && patient.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (patient.id && String(patient.id).includes(searchQuery)) ||
        (patient.gender && patient.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (patient.telecom && patient.telecom.toLowerCase().includes(searchQuery.toLowerCase()))

      // Gender filter - updated to handle "any" value
      const matchesGender = filters.gender === "any" ||
        (patient.gender && patient.gender.toLowerCase() === filters.gender.toLowerCase())

      // Age filter
      const age = calculateAge(patient.birthDate)
      const matchesAge =
        (age === "N/A" || (age >= filters.minAge && age <= filters.maxAge))

      return matchesSearch && matchesGender && matchesAge
    }
  )

  const paginatedPatients = filteredPatients.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)

  const totalPages = Math.ceil(filteredPatients.length / resultsPerPage)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white flex items-center">
              <div className="p-2 bg-white/5 rounded-lg mr-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              Patient Records
              <Badge className="ml-4 bg-white/10 text-white border-white/20 px-3 py-1">
                {filteredPatients.length} Active
              </Badge>
            </h1>
            <p className="text-white/60 text-lg">Comprehensive patient management and medical records</p>
          </div>
          <div className="flex space-x-3">
            <Button
              className="bg-white text-black hover:bg-white/90 transition-all duration-300"
              onClick={() => setIsDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors duration-300" />
            <Input
              placeholder="Search by name, ID, gender, or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                console.log(`[v0] Search query updated: ${e.target.value}`)
              }}
              className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-lg"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 border-white/20 text-white hover:bg-white/10 bg-transparent transition-all duration-300 hover:border-white/40"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
            {(filters.gender || filters.minAge > 0 || filters.maxAge < 100) && (
              <Badge className="ml-2 bg-white text-black">Active</Badge>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 relative">
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white/5 border-white/10 animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="space-y-3">
                          <div className="h-6 bg-white/10 rounded w-48"></div>
                          <div className="h-4 bg-white/5 rounded w-64"></div>
                        </div>
                        <div className="h-6 bg-white/10 rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : paginatedPatients.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">No patients found matching your search or filters.</p>
                </CardContent>
              </Card>
            ) : (
              paginatedPatients.map((patient, index) => (
                <Card
                  key={patient.id}
                  className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                    selectedPatient?.id === patient.id ? "ring-1 ring-white" : ""
                  } ${hoveredCard === patient.id ? "border-white/30" : ""}`}
                  onClick={() => handlePatientClick(patient)}
                  onMouseEnter={() => setHoveredCard(patient.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img
                            src={patient.gender?.toLowerCase() === "f"
                              ? "https://avatar.iran.liara.run/public/girl"
                              : "https://avatar.iran.liara.run/public/boy"}
                            alt={patient.gender?.toLowerCase() === "f" ? "Female" : "Male"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold text-white">{patient.name}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-white/60 text-sm">
                              ID: {patient.id} • Gender: {patient.gender?.toUpperCase()}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full hover:bg-white/10"
                              onClick={(e) => handleCopyId(e, patient.id)}
                            >
                              {copiedId === patient.id ?
                                <Check className="h-3 w-3 text-white" /> :
                                <Copy className="h-3 w-3 text-white/60" />
                              }
                            </Button>
                          </div>
                          <div className="flex items-center mt-1 space-x-3">
                            <div className="flex items-center text-white/80">
                              <Calendar className="h-4 w-4 mr-1 text-white/60" />
                              <span>{formatBirthDate(patient.birthDate)}</span>
                            </div>
                            <div className="flex items-center text-white/80">
                              <Phone className="h-4 w-4 mr-1 text-white/60" />
                              <span>{patient.telecom || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-white/10 text-white border-white/30">
                        Age: {calculateAge(patient.birthDate)}
                      </Badge>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Records
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {/* Pagination controls */}
            {!loading && filteredPatients.length > 0 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50 transition-all duration-300 bg-transparent"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-white/60">Page</span>
                  <Badge className="bg-white/10 text-white border-white/20 px-3 py-1">
                    {currentPage} of {totalPages}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50 transition-all duration-300 bg-transparent"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {isSidebarOpen && (
            <div className="fixed top-0 right-0 h-screen w-1/3 bg-black border-l border-white/10 overflow-y-auto p-6 z-50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <div className="w-8 h-8 rounded-lg overflow-hidden mr-2">
                    <img
                      src={selectedPatient.gender?.toLowerCase() === "f"
                        ? "https://avatar.iran.liara.run/public/girl"
                        : "https://avatar.iran.liara.run/public/boy"}
                      alt={selectedPatient.gender?.toLowerCase() === "f" ? "Female" : "Male"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedPatient.name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log("[v0] Closing patient sidebar")
                    setIsSidebarOpen(false)
                  }}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <div className="w-5 h-5 rounded overflow-hidden mr-2">
                        <img
                          src={selectedPatient.gender?.toLowerCase() === "f"
                            ? "https://avatar.iran.liara.run/public/girl"
                            : "https://avatar.iran.liara.run/public/boy"}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/60">Patient ID</div>
                        <div className="font-medium text-white">{selectedPatient.id}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/60">Gender</div>
                        <div className="font-medium text-white">{selectedPatient.gender?.toUpperCase()}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/60">Birth Date</div>
                        <div className="font-medium text-white">{formatBirthDate(selectedPatient.birthDate)}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-white/60">Contact</div>
                        <div className="font-medium text-white">{selectedPatient.telecom || "N/A"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Clipboard className="h-5 w-5 mr-2 text-white" />
                      Medical Records
                    </CardTitle>
                    <Badge className="bg-white/10 text-white border-white/20">
                      {patientRecords.length} Records
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {patientRecords.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/60">No records found for this patient.</p>
                      </div>
                    ) : (
                      patientRecords.map((record) => (
                        <div
                          key={record._id}
                          className="p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center mb-2">
                            {record.type === "vitals" ? (
                              <Activity className="h-4 w-4 mr-2 text-white" />
                            ) : record.type === "medication" ? (
                              <Pill className="h-4 w-4 mr-2 text-white" />
                            ) : record.type === "diagnosis" ? (
                              <Stethoscope className="h-4 w-4 mr-2 text-white" />
                            ) : (
                              <FileSymlink className="h-4 w-4 mr-2 text-white" />
                            )}
                            <h3 className="text-lg font-semibold text-white">{record.description}</h3>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center text-white/60">
                              <Clock className="h-3 w-3 mr-1" />
                              {record.date}
                            </div>
                            <div className="flex items-center space-x-2">
                              {record.resourceType && (
                                <Badge variant="outline" className="border-white/20 text-white/70">
                                  {record.resourceType}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Add Patient Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-black text-white border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-white" />
                Add New Patient
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Patient ID"
                value={newPatient.id}
                disabled
                className="bg-white/5 border-white/10 text-white/60"
              />
              <Input
                placeholder="Full Name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white focus:border-white/50 focus:ring-white/20"
              />
              <Input
                placeholder="Gender (M/F)"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className="bg-white/5 border-white/10 text-white focus:border-white/50 focus:ring-white/20"
              />
              <Input
                placeholder="Birth Date (YYYY-MM-DD)"
                value={newPatient.birthDate}
                onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
                className="bg-white/5 border-white/10 text-white focus:border-white/50 focus:ring-white/20"
              />
              <Input
                placeholder="Phone Number"
                value={newPatient.telecom}
                onChange={(e) => setNewPatient({ ...newPatient, telecom: e.target.value })}
                className="bg-white/5 border-white/10 text-white focus:border-white/50 focus:ring-white/20"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddPatient}
                className="bg-white text-black hover:bg-white/90 transition-all duration-300"
              >
                Add Patient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogContent className="bg-black text-white border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2 text-white" />
                Filter Patients
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/80">Gender</h4>
                <Select
                  value={filters.gender}
                  onValueChange={(value) => setFilters({...filters, gender: value})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10 text-white">
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="m">Male</SelectItem>
                    <SelectItem value="f">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-white/80">Age Range</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-white/10 border-white/20 text-white">
                      {filters.minAge} - {filters.maxAge} years
                    </Badge>
                  </div>
                </div>
                <div className="py-4">
                  <div className="relative pt-5 pb-2">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[filters.minAge, filters.maxAge]}
                      onValueChange={(value) => {
                        setFilters({
                          ...filters,
                          minAge: value[0],
                          maxAge: value[1]
                        })
                      }}
                      className="[&_[role=slider]]:bg-white"
                    />
                    <div className="flex justify-between mt-2 text-xs text-white/60">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
              <Button
                className="bg-white text-black hover:bg-white/90 transition-all duration-300"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}