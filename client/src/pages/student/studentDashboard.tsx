"use client"

import { useState } from "react"
import { Award, Calendar, CheckCircle, ChevronDown, Clock, Code, FileText, LogOut, Moon, Settings, Sun, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceChart } from "./performanceChart"
import { StudentSidebar } from "./student-sidebbar"

// Mock data
const studentData = {
  name: "Alex Johnson",
  totalSubmissions: 42,
  bestScore: 98,
  nextTest: "2023-05-15T10:00:00",
  passRate: 87,
  performanceData: [
    { date: "Jan 5", score: 75 },
    { date: "Jan 12", score: 82 },
    { date: "Jan 19", score: 78 },
    { date: "Jan 26", score: 85 },
    { date: "Feb 2", score: 90 },
    { date: "Feb 9", score: 88 },
    { date: "Feb 16", score: 92 },
    { date: "Feb 23", score: 86 },
    { date: "Mar 2", score: 94 },
    { date: "Mar 9", score: 98 },
  ],
  upcomingTests: [
    { id: 1, name: "Data Structures Quiz", date: "2023-05-15T10:00:00", duration: "1 hour" },
    { id: 2, name: "Algorithms Midterm", date: "2023-05-22T14:00:00", duration: "2 hours" },
    { id: 3, name: "Web Development Project", date: "2023-06-01T09:00:00", duration: "3 hours" },
  ],
  recentSubmissions: [
    { id: 1, problem: "Binary Search Tree", date: "2023-04-28T15:30:00", score: 92, status: "Pass" },
    { id: 2, problem: "Dijkstra's Algorithm", date: "2023-04-25T11:45:00", score: 88, status: "Pass" },
    { id: 3, problem: "Linked List Implementation", date: "2023-04-20T09:15:00", score: 75, status: "Pass" },
    { id: 4, problem: "Recursive Fibonacci", date: "2023-04-15T14:20:00", score: 65, status: "Fail" },
    { id: 5, problem: "Hash Table Implementation", date: "2023-04-10T16:00:00", score: 95, status: "Pass" },
  ],
  leaderboard: [
    { rank: 1, name: "Emma Wilson", score: 98 },
    { rank: 2, name: "Alex Johnson", score: 96 },
    { rank: 3, name: "Michael Brown", score: 94 },
    { rank: 4, name: "Sophia Davis", score: 92 },
    { rank: 5, name: "James Miller", score: 90 },
  ]
}

export default function StudentDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }
  
  // Function to calculate time remaining
  const getTimeRemaining = (dateString: string) => {
    const testDate = new Date(dateString).getTime()
    const currentDate = new Date().getTime()
    const distance = testDate - currentDate
    
    if (distance < 0) return "Started"
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`flex min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}>
      <div>

      <StudentSidebar />
      </div>
      
      <div className="flex-1 p-4 md:p-6 bg-background w-full">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {studentData.name}!</h1>
            <p className="text-muted-foreground">Here's an overview of your progress</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={studentData.name} />
                    <AvatarFallback>{studentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">Codes submitted</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.bestScore}/100</div>
              <p className="text-xs text-muted-foreground">Highest achievement</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Test</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(studentData.nextTest).split(',')[0]}</div>
              <p className="text-xs text-muted-foreground">{getTimeRemaining(studentData.nextTest)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.passRate}%</div>
              <Progress value={studentData.passRate} className="h-2" />
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Graph */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Your score history over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PerformanceChart data={studentData.performanceData} isDarkMode={isDarkMode} />
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Tests & Leaderboard Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Tests</CardTitle>
              <CardDescription>Scheduled evaluations and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.upcomingTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{test.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{formatDate(test.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{test.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant={new Date(test.date) < new Date() ? "default" : "outline"}
                      size="sm"
                    >
                      {new Date(test.date) < new Date() ? "Join Now" : "View Details"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>Top performers in your course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.leaderboard.map((student) => (
                  <div 
                    key={student.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      student.name === studentData.name ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        student.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        {student.rank}
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <span className="font-semibold">{student.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Your latest code evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Problem</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData.recentSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.problem}</TableCell>
                    <TableCell>{formatDate(submission.date)}</TableCell>
                    <TableCell>{submission.score}/100</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === "Pass" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}>
                        {submission.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View Code</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Evaluation Portal v1.0.0 | © 2023 All Rights Reserved</p>
        </footer>
      </div>
    </div>
  )
}
