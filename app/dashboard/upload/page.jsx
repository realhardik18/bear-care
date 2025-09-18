"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, ImageIcon, Clock, X, Brain, Zap, Shield } from "lucide-react"
import { toast } from "sonner" // Replace useToast with sonner
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [dataType, setDataType] = useState("record") // Default to "record"
  const [isUploading, setIsUploading] = useState(false)

  // Fetch existing uploads on component mount
  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    try {
      const response = await fetch("/api/uploads")
      if (response.ok) {
        const data = await response.json()
        const formattedUploads = data.map((upload) => ({
          id: upload._id,
          name: `${upload.type}_upload_${new Date(upload.date).toLocaleDateString()}.json`,
          size: upload.itemCount * 1024, // Rough estimation
          type: "application/json",
          status: upload.status,
          progress: 100,
          uploadedAt: new Date(upload.createdAt),
          processedData: {
            recordsFound: upload.itemCount,
            patientsAffected: upload.itemCount,
            dataType: upload.type === "patient" ? "Patient Demographics" : "Medical Records",
          },
        }))
        setUploadedFiles(formattedUploads)
      }
    } catch (error) {
      console.error("Error fetching uploads:", error)
    }
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  // Define handleFiles before it's used in handleDrop
  const handleFiles = async (files) => {
    setIsUploading(true)
    const fileArray = Array.from(files)

    // Only process JSON files - strictly check for .json extension
    const jsonFiles = fileArray.filter(file => file.name.endsWith('.json'))

    if (jsonFiles.length === 0) {
      toast.error("Invalid file format", {
        description: "Please upload only .json files",
      })
      setIsUploading(false)
      return
    }

    // Validate data type selection
    if (!dataType || (dataType !== "patient" && dataType !== "record")) {
      toast.error("Invalid data type", {
        description: "Please select either 'Patient Data' or 'Medical Records' type",
      })
      setIsUploading(false)
      return
    }

    // Create temporary file records
    const tempFiles = jsonFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      originalName: file.name, // Store original filename
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
      uploadedAt: new Date(),
      file: file, // Store the actual file
    }))

    setUploadedFiles((prev) => [...tempFiles, ...prev])

    // Process each file
    for (const fileData of tempFiles) {
      try {
        // Update progress to 25% - Reading file
        updateFileProgress(fileData.id, 25, "uploading")

        // Read the file content
        const fileContent = await readFileAsJson(fileData.file)

        // Validate the file content
        if (!Array.isArray(fileContent)) {
          throw new Error("File must contain a JSON array")
        }

        // Update progress to 50% - Validating data
        updateFileProgress(fileData.id, 50, "processing")

        // Prepare upload data
        const uploadData = {
          date: new Date().toISOString(),
          type: dataType,
          filename: fileData.originalName, // Include original filename
          items: fileContent,
        }

        // Update progress to 75% - Sending to server
        updateFileProgress(fileData.id, 75, "processing")

        // Send to server
        const response = await fetch("/api/uploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to upload file")
        }

        const result = await response.json()

        // Update file status to complete
        updateFileProgress(fileData.id, 100, "completed", {
          recordsFound: result.totalItems,
          patientsAffected: result.processedItems,
          dataType: dataType === "patient" ? "Patient Demographics" : "Medical Records",
          filename: fileData.originalName, // Include filename in processed data
        })

        // Show appropriate success or partial success message
        if (result.failedItems > 0) {
          toast.warning("Upload partially successful", {
            description: `Processed ${result.processedItems} of ${result.totalItems} items. ${result.failedItems} items failed.`,
          })
        } else {
          toast.success("Upload successful", {
            description: `Processed ${result.processedItems} items of type ${result.type}`,
          })
        }
      } catch (error) {
        console.error("Error processing file:", error)
        updateFileProgress(fileData.id, 100, "error")

        toast.error("Upload failed", {
          description: error.message,
        })
      }
    }

    setIsUploading(false)
    // Refresh the uploads list
    fetchUploads()
  }

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [], // Remove handleFiles from dependency array since it's now defined above
  )

  const readFileAsJson = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          resolve(data)
        } catch (error) {
          reject(new Error("Invalid JSON file"))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const updateFileProgress = (id, progress, status, processedData = null) => {
    setUploadedFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            progress,
            status,
            ...(processedData ? { processedData } : {}),
          }
        }
        return f
      }),
    )
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
        return <Shield className="h-5 w-5 text-green-400" />
      case "processing":
      case "uploading":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "error":
        return <X className="h-5 w-5 text-red-400" />
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
    { name: "JSON Files", extension: ".json", description: "JSON arrays of patient or record data" },
  ]

  const processingFeatures = [
    {
      icon: Brain,
      title: "Smart Processing",
      description: "Intelligent data parsing and validation",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Track upload progress in real-time",
    },
    {
      icon: Shield,
      title: "Data Validation",
      description: "Automatic format and structure verification",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Upload Data</h1>
          <p className="text-white/60 mt-1">Import and process your data files</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Type Selection */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardContent className="pt-6">
              <label className="text-white mb-2 block font-medium">
                Select Data Type <span className="text-red-400">*</span>
              </label>
              <p className="text-white/60 text-sm mb-3">You must select the type of data you are uploading</p>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Data Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="record">Medical Records</SelectItem>
                  <SelectItem value="patient">Patient Data</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Drag & Drop Zone */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-white/40 bg-white/5 scale-[0.99] transform"
                    : "border-white/20 hover:border-white/30 hover:bg-white/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Drop JSON files here or click to upload</h3>
                <p className="text-white/60 mb-2">Only .json files containing arrays of {dataType} data are supported</p>
                <p className="text-yellow-300/80 text-sm mb-6">Make sure you've selected the correct data type above</p>
                <Button
                  className="bg-white text-black hover:bg-white/90"
                  onClick={() => document.getElementById("file-input")?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Choose Files"}
                </Button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  accept=".json"
                  disabled={isUploading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
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
                          <div className="text-xs text-white/60">Items Processed</div>
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
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Upload Features
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
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
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
        </div>
      </div>
    </div>
  )
}
