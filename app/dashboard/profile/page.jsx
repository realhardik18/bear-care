"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Stethoscope, Award, Bell, Shield, Save, Edit, Camera, Activity, TrendingUp, Clock } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@bearcare.com",
    phone: "+1 (555) 123-4567",
    specialty: "Cardiology",
    license: "MD-12345-CA",
    hospital: "BearCare Medical Center",
    department: "Cardiovascular Medicine",
    yearsExperience: 12,
    bio: "Experienced cardiologist specializing in interventional procedures and heart disease prevention. Passionate about using technology to improve patient outcomes.",
    address: "123 Medical Plaza, San Francisco, CA 94102",
    emergencyContact: "+1 (555) 987-6543",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    patientUpdates: true,
    systemMaintenance: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "colleagues",
    shareAnalytics: true,
    dataRetention: "5years",
    twoFactorAuth: true,
  })

  const achievements = [
    {
      title: "Patient Care Excellence",
      description: "Maintained 98% patient satisfaction rate",
      date: "2025-02-15",
      icon: Award,
      color: "text-yellow-400",
    },
    {
      title: "Research Contributor",
      description: "Published 3 papers on cardiovascular health",
      date: "2025-01-20",
      icon: Activity,
      color: "text-blue-400",
    },
    {
      title: "Technology Adopter",
      description: "Early adopter of AI-assisted diagnostics",
      date: "2024-12-10",
      icon: TrendingUp,
      color: "text-green-400",
    },
  ]

  const recentActivity = [
    {
      action: "Updated patient record",
      patient: "John Doe (P001)",
      timestamp: "2 hours ago",
      type: "record_update",
    },
    {
      action: "Reviewed lab results",
      patient: "Sarah Johnson (P002)",
      timestamp: "4 hours ago",
      type: "lab_review",
    },
    {
      action: "Scheduled follow-up",
      patient: "Mike Chen (P003)",
      timestamp: "1 day ago",
      type: "appointment",
    },
    {
      action: "Prescribed medication",
      patient: "Emily Davis (P004)",
      timestamp: "2 days ago",
      type: "prescription",
    },
  ]

  const stats = [
    { label: "Patients Treated", value: "1,247", change: "+12%", period: "this month" },
    { label: "Avg. Satisfaction", value: "4.8/5", change: "+0.2", period: "this quarter" },
    { label: "Response Time", value: "< 2hrs", change: "-15min", period: "this week" },
    { label: "Cases Resolved", value: "98.5%", change: "+1.2%", period: "this month" },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
    console.log("Profile saved:", profileData)
  }

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (setting, value) => {
    setNotifications((prev) => ({ ...prev, [setting]: value }))
  }

  const handlePrivacyChange = (setting, value) => {
    setPrivacy((prev) => ({ ...prev, [setting]: value }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-white/60 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-white text-black hover:bg-white/90">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-white text-black hover:bg-white/90">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white/20 text-white">
            Profile
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white/20 text-white">
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/caring-doctor.png" />
                        <AvatarFallback className="bg-white/20 text-white text-xl">
                          {profileData.firstName[0]}
                          {profileData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-white text-black hover:bg-white/90"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Dr. {profileData.firstName} {profileData.lastName}
                      </h2>
                      <p className="text-white/60">{profileData.specialty}</p>
                      <p className="text-white/60 text-sm">{profileData.hospital}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty" className="text-white">
                        Specialty
                      </Label>
                      <Input
                        id="specialty"
                        value={profileData.specialty}
                        onChange={(e) => handleInputChange("specialty", e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license" className="text-white">
                        License Number
                      </Label>
                      <Input
                        id="license"
                        value={profileData.license}
                        onChange={(e) => handleInputChange("license", e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-60"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Stats */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-white/60 mb-1">{stat.label}</div>
                        <div className="text-xs text-green-400">
                          {stat.change} {stat.period}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                        <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm">{achievement.title}</h4>
                        <p className="text-xs text-white/60 mt-1">{achievement.description}</p>
                        <p className="text-xs text-white/40 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Experience</span>
                    <span className="text-white font-medium">{profileData.yearsExperience} years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Department</span>
                    <span className="text-white font-medium">{profileData.department}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Hospital</span>
                    <span className="text-white font-medium">{profileData.hospital}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-white/60 text-sm mb-1">Emergency Contact</div>
                    <div className="text-white font-medium text-sm">{profileData.emergencyContact}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-white/60">Your recent actions and interactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Clock className="h-4 w-4 text-white/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-white/60 text-sm">{activity.patient}</p>
                  </div>
                  <div className="text-white/60 text-sm">{activity.timestamp}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notifications */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-white/60">Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={key} className="text-white capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                      <p className="text-xs text-white/60">
                        {key === "emailAlerts" && "Receive important updates via email"}
                        {key === "smsAlerts" && "Get urgent notifications via SMS"}
                        {key === "pushNotifications" && "Browser and mobile push notifications"}
                        {key === "weeklyReports" && "Weekly summary of your activity"}
                        {key === "patientUpdates" && "Notifications about patient status changes"}
                        {key === "systemMaintenance" && "System maintenance and update notifications"}
                      </p>
                    </div>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-white/60">Control your privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility" className="text-white">
                    Profile Visibility
                  </Label>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="public" className="text-white hover:bg-white/10">
                        Public
                      </SelectItem>
                      <SelectItem value="colleagues" className="text-white hover:bg-white/10">
                        Colleagues Only
                      </SelectItem>
                      <SelectItem value="private" className="text-white hover:bg-white/10">
                        Private
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shareAnalytics" className="text-white">
                      Share Analytics
                    </Label>
                    <p className="text-xs text-white/60">Help improve BearCare with usage data</p>
                  </div>
                  <Switch
                    id="shareAnalytics"
                    checked={privacy.shareAnalytics}
                    onCheckedChange={(checked) => handlePrivacyChange("shareAnalytics", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention" className="text-white">
                    Data Retention
                  </Label>
                  <Select
                    value={privacy.dataRetention}
                    onValueChange={(value) => handlePrivacyChange("dataRetention", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="1year" className="text-white hover:bg-white/10">
                        1 Year
                      </SelectItem>
                      <SelectItem value="3years" className="text-white hover:bg-white/10">
                        3 Years
                      </SelectItem>
                      <SelectItem value="5years" className="text-white hover:bg-white/10">
                        5 Years
                      </SelectItem>
                      <SelectItem value="indefinite" className="text-white hover:bg-white/10">
                        Indefinite
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth" className="text-white">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-xs text-white/60">Add an extra layer of security</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={privacy.twoFactorAuth}
                    onCheckedChange={(checked) => handlePrivacyChange("twoFactorAuth", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
