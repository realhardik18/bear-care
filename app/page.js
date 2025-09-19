"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Brain, Database, FileText, ArrowRight, Stethoscope } from "lucide-react"
import Link from "next/link"
import { Dithering } from '@paper-design/shaders-react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  const features = [
    {
      icon: Database,
      title: "Local FHIR Knowledge Base",
      description: "Access and analyze patient records from your local FHIR database seamlessly.",
      visual: (
        <div className="space-y-2">
          <div className="bg-white/5 rounded-lg p-3 border border-white/20">
            <div className="text-sm font-medium text-white">Local FHIR Database</div>
            <div className="text-xs text-white/70 mt-1">
              <Badge variant="outline" className="mr-1 border-white/20 text-white bg-white/5">
                1000+ Records
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white bg-white/5">
                Real-time Sync
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Brain,
      title: "AI-Powered Patient Analysis",
      description: "Extract meaningful insights from patient histories automatically.",
      visual: (
        <div className="space-y-2">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-3">
              <div className="text-sm font-medium text-white mb-2">Patient Insights</div>
              <div className="text-xs text-white/70">
                • Treatment effectiveness patterns<br />
                • Risk factor analysis<br />
                • Outcome predictions
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      icon: FileText,
      title: "Smart Documentation",
      description: "AI-assisted medical documentation with citation support.",
      visual: (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-3">
            <div className="text-sm font-medium text-white mb-2">Recent Citations</div>
            <div className="text-xs text-white/70">
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="outline" className="border-white/20 text-white bg-white/5">NEJM</Badge>
                <span>2024 Treatment Guidelines</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-white/20 text-white bg-white/5">Lancet</Badge>
                <span>Clinical Trial Results</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      icon: Search,
      title: "Contextual Search",
      description: "Find relevant patient information with natural language queries.",
      visual: (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2 border border-white/10">
            <Search className="h-4 w-4 text-white/70" />
            <Input
              placeholder="Search patient history..."
              className="border-0 bg-transparent text-sm text-white placeholder:text-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 border-b border-white/10">
        <div className="flex items-center space-x-2 animate-fade-in-up">
          <Stethoscope className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold">BearCare</span>
        </div>
        <div className="flex items-center space-x-4 animate-fade-in-up animate-delay-100">
          <Button variant="ghost" className="text-white hover:bg-purple-800/30 transition-all duration-300">
            Features
          </Button>
          <Button variant="ghost" className="text-white hover:bg-purple-800/30 transition-all duration-300">
            Pricing
          </Button>
          <Link href="/dashboard">
            <Button className="bg-purple-600 text-white hover:bg-purple-500 transition-all duration-300 hover:scale-105">
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Dithering
            height={500}
            colorBack="#000000"
            colorFront="#f2f2f2"
            shape="warp"
            type="4x4"
            pxSize={2}
            offsetX={0}
            offsetY={0}
            scale={0.6}
            rotation={0}
            speed={1}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 text-balance animate-fade-in-up">
            Deep Patient Insights
            <span className="block text-white/80">Powered by AI</span>
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto text-pretty animate-fade-in-up animate-delay-100">
            Leverage your local FHIR database with AI-powered analysis for deeper understanding of patient histories,
            treatment patterns, and evidence-based insights.
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in-up animate-delay-200">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-purple-600 text-white hover:bg-purple-500 transition-all duration-300 hover:scale-105"
              >
                Try Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-400/20 text-white hover:bg-purple-800/30 bg-transparent transition-all duration-300 hover:scale-105"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">Top 4 Features</h2>
            <p className="text-white/70 text-lg">Everything you need for modern healthcare management</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 group hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 border border-white/10">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/70 text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/40 rounded-lg p-4 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    {feature.visual}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of healthcare professionals using BearCare to deliver better patient outcomes.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-purple-600 text-white hover:bg-purple-500 transition-all duration-300 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-white" />
            <span className="text-lg font-semibold">BearCare</span>
          </div>
          <div className="text-white/50 text-sm">© 2025 BearCare. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}