"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, ImageIcon, Database, CheckCircle, AlertCircle, Clock, X, Brain, Zap, Shield } from "lucide-react"

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: "1",
      name: "patient_records_march_2025.csv",
      size: 2048576,
      type: "text/csv",
      status: "completed",
      progress: 100,
      uploadedAt: new Date("2025-03-15T10:30:00"),
      processedData: {
        recordsFound: 156,
        patientsAffected: 89,
        dataType: "Patient Demographics",
      },
    },
    {
      id: "2",
      name: "lab_results_batch_1.json",
      size: 1536000,
      type: "application/json",
      status: "completed",
      progress: 100,
      uploadedAt: new Date("2025-03-14T14:20:00"),
      processedData: {
        recordsFound: 234,
        patientsAffected: 67,
        dataType: "Laboratory Results",
      },
    },
    {
      id: "3",
      name: "medication_history.xml",
      size: 3072000,
      type: "application/xml",
      status: "processing",
      progress: 65,
      uploadedAt: new Date("2025-03-15T11:45:00"),
    },
  ])

  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      const newFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
        uploadedAt: new Date(),
      }

      setUploadedFiles((prev) => [newFile, ...prev])

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === newFile.id) {
              const newProgress = Math.min(f.progress + Math.random() * 20, 100)
              const newStatus = newProgress === 100 ? "processing" : "uploading"
              return { ...f, progress: newProgress, status: newStatus }
            }
            return f
          }),
        )
      }, 500)

      // Simulate processing completion
      setTimeout(() => {
        clearInterval(interval)
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === newFile.id) {
              return {
                ...f,
                status: "completed",
                progress: 100,
                processedData: {
                  recordsFound: Math.floor(Math.random() * 200) + 50,
                  patientsAffected: Math.floor(Math.random() * 100) + 20,
                  dataType: getDataType(file.type),
                },
              }
            }
            return f
          }),
        )
      }, 8000)
    })
  }

  const getDataType = (fileType) => {
    if (fileType.includes("csv")) return "Patient Demographics"
    if (fileType.includes("json")) return "Laboratory Results"
    if (fileType.includes("xml")) return "Medical Records"
    return "Healthcare Data"
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "processing":
      case "uploading":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      default:
        return <ImageIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "processing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "uploading":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const supportedFormats = [
    { name: "CSV Files", extension: ".csv", description: "Patient demographics, vital signs" },
    { name: "JSON Files", extension: ".json", description: "Lab results, API responses" },
    { name: "XML Files", extension: ".xml", description: "FHIR records, medical documents" },
    { name: "PDF Files", extension: ".pdf", description: "Medical reports, prescriptions" },
    { name: "Excel Files", extension: ".xlsx", description: "Spreadsheet data, analytics" },
  ]

  const processingFeatures = [
    {
      icon: Brain,
      title: "AI Data Validation",
      description: "Automatically validates medical data integrity and identifies anomalies",
    },
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description: "End-to-end encryption and secure processing of sensitive health data",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant data parsing and integration into patient records",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Upload Data</h1>
          <p className="text-white/60 mt-1">Import patient records, lab results, and medical data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-400" />
          <span className="text-green-400 text-sm">HIPAA Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag & Drop Zone */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive ? "border-white/40 bg-white/5" : "border-white/20 hover:border-white/30 hover:bg-white/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Drop files here or click to upload</h3>
                <p className="text-white/60 mb-6">Support for CSV, JSON, XML, PDF, and Excel files up to 100MB</p>
                <Button
                  className="bg-white text-black hover:bg-white/90"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  accept=".csv,.json,.xml,.pdf,.xlsx,.xls"
                />
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Uploaded Files ({uploadedFiles.length})
              </CardTitle>
              <CardDescription className="text-white/60">Track upload progress and processing status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No files uploaded yet</p>
                </div>
              ) : (
                uploadedFiles.map((file) => (
                  <div key={file.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getStatusIcon(file.status)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{file.name}</p>
                          <p className="text-sm text-white/60">
                            {formatFileSize(file.size)} • {file.uploadedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(file.id)}
                          className="text-white/60 hover:text-white hover:bg-white/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {(file.status === "uploading" || file.status === "processing") && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-white/60 mb-1">
                          <span>{file.status === "uploading" ? "Uploading..." : "Processing..."}</span>
                          <span>{file.progress}%</span>
                        </div>
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}

                    {file.processedData && file.status === "completed" && (
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">{file.processedData.recordsFound}</div>
                          <div className="text-xs text-white/60">Records Found</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">{file.processedData.patientsAffected}</div>
                          <div className="text-xs text-white/60">Patients Affected</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-white">{file.processedData.dataType}</div>
                          <div className="text-xs text-white/60">Data Type</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Processing Features */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Processing
              </CardTitle>
              <CardDescription className="text-white/60">Advanced features for data handling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {processingFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
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

          {/* Supported Formats */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Supported Formats
              </CardTitle>
              <CardDescription className="text-white/60">File types we can process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {supportedFormats.map((format, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-white text-sm">{format.name}</div>
                    <div className="text-xs text-white/60">{format.description}</div>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
                    {format.extension}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upload Statistics */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Upload Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-lg font-semibold text-white">156</div>
                  <div className="text-xs text-white/60">Files This Month</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-lg font-semibold text-white">2.4GB</div>
                  <div className="text-xs text-white/60">Data Processed</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-lg font-semibold text-white">98.5%</div>
                  <div className="text-xs text-white/60">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-lg font-semibold text-white">1,247</div>
                  <div className="text-xs text-white/60">Records Added</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
