"use client"

// import Link from "next/link"
import {Link } from "react-router-dom"
import { BarChart, BookOpen, Calendar, Code, FileText, Home, Menu, MessageSquare, Settings, Users } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export function StudentSidebar() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/student/dashboard" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: Calendar, label: "Schedule", href: "/student/schedule" },
    { icon: Code, label: "Submissions", href: "/student/submissions" },
    { icon: BarChart, label: "Progress", href: "/student/progress" },
    { icon: BookOpen, label: "Courses", href: "/student/courses" },
    { icon: MessageSquare, label: "Messages", href: "/student/messages" },
    { icon: Users, label: "Classmates", href: "/student/classmates" },
    { icon: Settings, label: "Settings", href: "/student/settings" },
  ]

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 md:hidden" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0">
          <div className="space-y-4 py-4">
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">Evaluation Portal</h2>
              <p className="text-sm text-muted-foreground">Student Dashboard</p>
            </div>
            <div className="px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex flex-col flex-grow border-r bg-card">
          <div className="flex items-center h-16 px-4 border-b">
            <h1 className="text-lg font-semibold">Evaluation Portal</h1>
          </div>
          <div className="flex-grow flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                    item.href === "/student/dashboard"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

