"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  TestTube,
  Pill,
  Activity,
  Brain,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from "lucide-react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const mockSearchResults = {
    patients: [
      {
        id: "P001",
        name: "John Doe",
        age: 45,
        condition: "Diabetes Type 2",
        lastVisit: "2025-03-10",
        relevance: 95,
        matchedFields: ["name", "condition", "medications"],
      },
      {
        id: "P002",
        name: "Sarah Johnson",
        age: 32,
        condition: "Hypertension",
        lastVisit: "2025-03-08",
        relevance: 87,
        matchedFields: ["name", "vital signs"],
      },
    ],
    records: [
      {
        id: "R001",
        patientName: "John Doe",
        type: "Lab Result",
        title: "HbA1c Test",
        date: "2025-03-05",
        content: "HbA1c level: 7.2% (elevated)",
        relevance: 92,
        matchedFields: ["test results", "diabetes markers"],
      },
      {
        id: "R002",
        patientName: "Mike Chen",
        type: "Prescription",
        title: "Albuterol Inhaler",
        date: "2025-03-03",
        content: "Prescribed for asthma management",
        relevance: 78,
        matchedFields: ["medications", "respiratory"],
      },
    ],
    medications: [
      {
        id: "M001",
        name: "Metformin",
        type: "Diabetes Medication",
        patients: ["John Doe", "Mary Smith"],
        interactions: ["Alcohol", "Contrast dye"],
        relevance: 89,
      },
      {
        id: "M002",
        name: "Lisinopril",
        type: "ACE Inhibitor",
        patients: ["John Doe", "Robert Wilson"],
        interactions: ["Potassium supplements", "NSAIDs"],
        relevance: 82,
      },
    ],
    conditions: [
      {
        id: "C001",
        name: "Diabetes Type 2",
        patients: 15,
        prevalence: "High",
        relatedConditions: ["Hypertension", "Obesity"],
        relevance: 94,
      },
      {
        id: "C002",
        name: "Hypertension",
        patients: 23,
        prevalence: "Very High",
        relatedConditions: ["Diabetes", "Heart Disease"],
        relevance: 88,
      },
    ],
  }

  const aiRecommendations = [
    {
      type: "pattern",
      title: "Medication Adherence Pattern",
      description: "Patients on Metformin show 85% better glucose control when combined with lifestyle modifications",
      confidence: 92,
      evidence: "Based on 156 patient records",
    },
    {
      type: "risk",
      title: "Risk Factor Correlation",
      description: "Patients with both diabetes and hypertension have 3x higher cardiovascular risk",
      confidence: 88,
      evidence: "Based on clinical guidelines and 89 patient cases",
    },
    {
      type: "treatment",
      title: "Treatment Optimization",
      description: "Consider ACE inhibitor for diabetic patients with BP >130/80",
      confidence: 95,
      evidence: "Based on ADA guidelines and patient outcomes",
    },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock search results based on query
    const results = []
    if (searchType === "all" || searchType === "patients") {
      results.push(...mockSearchResults.patients)
    }
    if (searchType === "all" || searchType === "records") {
      results.push(...mockSearchResults.records)
    }
    if (searchType === "all" || searchType === "medications") {
      results.push(...mockSearchResults.medications)
    }
    if (searchType === "all" || searchType === "conditions") {
      results.push(...mockSearchResults.conditions)
    }

    setSearchResults(results)
    setIsSearching(false)
  }

  const getRelevanceColor = (relevance) => {
    if (relevance >= 90) return "bg-green-500/20 text-green-300"
    if (relevance >= 80) return "bg-yellow-500/20 text-yellow-300"
    return "bg-red-500/20 text-red-300"
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 90) return <CheckCircle className="h-4 w-4 text-green-400" />
    if (confidence >= 80) return <TrendingUp className="h-4 w-4 text-yellow-400" />
    return <AlertCircle className="h-4 w-4 text-red-400" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Smart Search</h1>
          <p className="text-white/60 mt-1">AI-powered search across patient records and medical data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-white/60" />
          <span className="text-white/60 text-sm">AI Enhanced</span>
        </div>
      </div>

      {/* Search Interface */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <Input
                  placeholder="Search patients, records, medications, conditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/60 text-lg py-6"
                />
              </div>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-white/10">
                    All Types
                  </SelectItem>
                  <SelectItem value="patients" className="text-white hover:bg-white/10">
                    Patients
                  </SelectItem>
                  <SelectItem value="records" className="text-white hover:bg-white/10">
                    Records
                  </SelectItem>
                  <SelectItem value="medications" className="text-white hover:bg-white/10">
                    Medications
                  </SelectItem>
                  <SelectItem value="conditions" className="text-white hover:bg-white/10">
                    Conditions
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="bg-white text-black hover:bg-white/90 px-8"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-white/60 text-sm">Quick searches:</span>
              {["diabetes patients", "high blood pressure", "metformin", "recent lab results"].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(suggestion)
                    handleSearch()
                  }}
                  className="border-white/20 text-white/80 hover:bg-white/10 bg-transparent text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Search Results ({searchResults.length})</h2>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {searchResults.map((result, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {result.name ? (
                          <User className="h-5 w-5 text-white" />
                        ) : result.type === "Lab Result" ? (
                          <TestTube className="h-5 w-5 text-purple-400" />
                        ) : result.type === "Prescription" ? (
                          <Pill className="h-5 w-5 text-green-400" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {result.name || result.title || result.patientName}
                        </h3>
                        <p className="text-white/60 text-sm">{result.condition || result.type || result.content}</p>
                      </div>
                    </div>
                    <Badge className={getRelevanceColor(result.relevance)}>{result.relevance}% match</Badge>
                  </div>

                  {result.matchedFields && (
                    <div className="mb-4">
                      <div className="text-sm text-white/60 mb-2">Matched fields:</div>
                      <div className="flex flex-wrap gap-2">
                        {result.matchedFields.map((field, i) => (
                          <Badge key={i} variant="outline" className="border-white/20 text-white/80 text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      {result.age && (
                        <span>
                          <User className="h-4 w-4 inline mr-1" />
                          {result.age} years
                        </span>
                      )}
                      {result.date && (
                        <span>
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {result.date}
                        </span>
                      )}
                      {result.patients && (
                        <span>
                          <User className="h-4 w-4 inline mr-1" />
                          {Array.isArray(result.patients) ? result.patients.length : result.patients} patients
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Insights
                </CardTitle>
                <CardDescription className="text-white/60">
                  AI-powered recommendations based on your search
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-white capitalize">{rec.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getConfidenceIcon(rec.confidence)}
                        <span className="text-xs text-white/60">{rec.confidence}%</span>
                      </div>
                    </div>
                    <h4 className="font-medium text-white mb-2">{rec.title}</h4>
                    <p className="text-sm text-white/80 mb-2">{rec.description}</p>
                    <p className="text-xs text-white/60">{rec.evidence}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Search History */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["diabetes management", "blood pressure readings", "medication interactions", "lab results"].map(
                  (search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-white/80 hover:bg-white/10 text-sm"
                      onClick={() => {
                        setSearchQuery(search)
                        handleSearch()
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {search}
                    </Button>
                  ),
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !isSearching && (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Start Your Search</h3>
            <p className="text-white/60 mb-6">
              Use our AI-powered search to find patients, records, medications, and medical insights instantly.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <User className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Patients</div>
                <div className="text-xs text-white/60">1,247 records</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <FileText className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Records</div>
                <div className="text-xs text-white/60">3,891 entries</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <Pill className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Medications</div>
                <div className="text-xs text-white/60">156 types</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <Activity className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Conditions</div>
                <div className="text-xs text-white/60">89 tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
