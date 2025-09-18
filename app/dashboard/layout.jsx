"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Clock, Search, Upload, Stethoscope, ChevronLeft, ChevronRight, Home, MessageCircle, PersonStandingIcon, Users } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs" // Add this import

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: MessageCircle, label: "Chat", href: "/dashboard/chat" },
  { icon: Users, label: "Patients", href: "/dashboard/patients" },
  { icon: Clock, label: "Timeline", href: "/dashboard/timeline" },
  { icon: Search, label: "Search", href: "/dashboard/search" },
  { icon: Upload, label: "Upload Data", href: "/dashboard/upload" },
]

export default function DashboardLayout({
  children,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, isLoaded } = useUser(); // Get user data and loading state
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/sign-in");
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div
        className={cn(
          "bg-black border-r border-white/20 transition-all duration-300 flex flex-col fixed left-0 top-0 h-full z-50",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2 transition-opacity duration-300">
              <Stethoscope className="h-6 w-6 text-white" />
              <span className="text-lg font-semibold">BearCare</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:translate-x-1",
                  pathname === item.href && "bg-white/20 scale-105 border border-white/20",
                  collapsed && "px-2",
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <item.icon className="h-5 w-5 transition-transform duration-300" />
                {!collapsed && <span className="ml-3 transition-opacity duration-300">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-white/20">
          <Link href="/dashboard/profile">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-white/10 transition-all duration-300 hover:scale-105",
                pathname === "/dashboard/profile" && "bg-white/20 scale-105 border border-white/20",
                collapsed && "px-2",
              )}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 transition-transform duration-300 hover:scale-110 border border-white/20">
                  <AvatarImage src={user?.imageUrl || "/caring-doctor.png"} />
                  <AvatarFallback className="bg-white/10 text-white border border-white/20">
                    {user?.firstName?.[0] || "U"}
                    {user?.lastName?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="text-left transition-opacity duration-300">
                    <div className="text-sm font-medium">
                      {user ? `${user.firstName}` : "Loading..."}
                    </div>
                    <div className="text-xs text-white/60">
                      {user?.primaryEmailAddress?.emailAddress || ""}
                    </div>
                  </div>
                )}
              </div>

            </Button>
          </Link>
        </div>
      </div>

      <div className={cn("flex-1 transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        <div className="h-screen overflow-y-auto bg-black">
          <div className="p-6 min-h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}