"use client"

import * as React from "react"
import { Book, FileText, GraduationCap, LayoutDashboard, LogOut, Settings, Upload, Users } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Sample data for assignments
const assignments = [
  {
    id: "1",
    title: "Essay on Climate Change",
    deadline: "2023-12-15",
    status: "Active",
  },
  {
    id: "2",
    title: "Math Problem Set 3",
    deadline: "2023-12-10",
    status: "Active",
  },
  {
    id: "3",
    title: "History Research Paper",
    deadline: "2023-11-30",
    status: "Closed",
  },
  {
    id: "4",
    title: "Science Lab Report",
    deadline: "2023-12-20",
    status: "Active",
  },
  {
    id: "5",
    title: "Literature Analysis",
    deadline: "2023-11-25",
    status: "Closed",
  },
]

// Sample data for student submissions
const studentSubmissions = [
  {
    id: "1",
    studentName: "Alice Johnson",
    submissionStatus: "Submitted",
    uploadedFile: "climate_essay_alice.docx",
    grade: null,
  },
  {
    id: "2",
    studentName: "Bob Smith",
    submissionStatus: "Submitted",
    uploadedFile: "climate_essay_bob.docx",
    grade: "B+",
  },
  {
    id: "3",
    studentName: "Charlie Brown",
    submissionStatus: "Late",
    uploadedFile: "climate_essay_charlie.docx",
    grade: null,
  },
  {
    id: "4",
    studentName: "Diana Prince",
    submissionStatus: "Not Submitted",
    uploadedFile: null,
    grade: null,
  },
  {
    id: "5",
    studentName: "Ethan Hunt",
    submissionStatus: "Submitted",
    uploadedFile: "climate_essay_ethan.pdf",
    grade: "A-",
  },
]

export default function TeacherDashboard() {
  const [selectedAssignment, setSelectedAssignment] = React.useState<string | null>(null)
  const [isGradingOpen, setIsGradingOpen] = React.useState(false)
  const [currentStudent, setCurrentStudent] = React.useState<any>(null)
  const [aiGradingResult, setAiGradingResult] = React.useState("")
  const [teacherFeedback, setTeacherFeedback] = React.useState("")
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prev) => [...prev, ...acceptedFiles])
    },
  })

  const handleViewStudents = (assignmentId: string) => {
    setSelectedAssignment(assignmentId)
  }

  const handleGradeStudent = (student: any) => {
    setCurrentStudent(student)
    // Simulate AI grading
    setAiGradingResult(
      "This essay demonstrates a good understanding of climate change concepts. The arguments are well-structured, but could use more supporting evidence. Grammar and spelling are excellent. Recommended grade: B+",
    )
    setTeacherFeedback("")
    setIsGradingOpen(true)
  }

  const handleSaveFeedback = () => {
    // Here you would save the feedback to your backend
    console.log("Saving feedback for student:", currentStudent?.id)
    console.log("AI Feedback:", aiGradingResult)
    console.log("Teacher Feedback:", teacherFeedback)
    setIsGradingOpen(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <GraduationCap className="h-6 w-6" />
              <div className="font-semibold">Teacher Portal</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a href="#">
                        <FileText className="h-4 w-4" />
                        <span>Assignments</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Users className="h-4 w-4" />
                        <span>Students</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Book className="h-4 w-4" />
                        <span>Courses</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] md:hidden">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Teacher Portal
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start bg-accent" onClick={() => setIsMobileMenuOpen(false)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Assignments
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Users className="mr-2 h-4 w-4" />
                  Students
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Book className="mr-2 h-4 w-4" />
                  Courses
                </Button>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="px-4 text-sm font-medium">Account</div>
                <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          {/* Top Navigation */}
          <header className="border-b">
            <div className="flex h-16 items-center px-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
              <h1 className="ml-2 text-xl font-semibold md:ml-0">Assignments</h1>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg" alt="User" className="h-8 w-8 rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Tabs defaultValue="assignments" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
              </TabsList>

              {/* Assignments Tab */}
              <TabsContent value="assignments" className="space-y-4 w-full">
                {selectedAssignment ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">
                        {assignments.find((a) => a.id === selectedAssignment)?.title} - Student Submissions
                      </h2>
                      <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                        Back to Assignments
                      </Button>
                    </div>
                    <div className="rounded-md border w-full overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Uploaded File</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentSubmissions.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.studentName}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    student.submissionStatus === "Submitted"
                                      ? "bg-green-100 text-green-800"
                                      : student.submissionStatus === "Late"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.submissionStatus}
                                </span>
                              </TableCell>
                              <TableCell>
                                {student.uploadedFile ? (
                                  <Button variant="link" className="p-0 h-auto">
                                    {student.uploadedFile}
                                  </Button>
                                ) : (
                                  "No file"
                                )}
                              </TableCell>
                              <TableCell>{student.grade || "Not graded"}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  disabled={student.submissionStatus === "Not Submitted"}
                                  onClick={() => handleGradeStudent(student)}
                                >
                                  Grade
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment Title</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>{formatDate(assignment.deadline)}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  assignment.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {assignment.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" onClick={() => handleViewStudents(assignment.id)}>
                                View Students
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Upload Files Tab */}
              <TabsContent value="upload" className="space-y-4 w-full">
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <h3 className="font-medium">Drag & drop files here</h3>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (accepts .txt, .doc, .docx, .pdf)
                      </p>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Uploaded Files</h3>
                      <div className="rounded-md border w-full overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>File Name</TableHead>
                              <TableHead>Size</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {uploadedFiles.map((file, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{file.name}</TableCell>
                                <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                                <TableCell>{file.type}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex justify-end">
                        <Button>Process Files</Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Grading Dialog */}
      <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Grade Assignment</DialogTitle>
            <DialogDescription>
              {currentStudent?.studentName} - {currentStudent?.uploadedFile}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ai-feedback">AI Evaluation</Label>
              <div className="rounded-md border p-4 text-sm">{aiGradingResult}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-feedback">Teacher Feedback</Label>
              <Textarea
                id="teacher-feedback"
                placeholder="Add your feedback or edit the AI evaluation..."
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Final Grade</Label>
              <Select defaultValue="b-plus">
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a-plus">A+</SelectItem>
                  <SelectItem value="a">A</SelectItem>
                  <SelectItem value="a-minus">A-</SelectItem>
                  <SelectItem value="b-plus">B+</SelectItem>
                  <SelectItem value="b">B</SelectItem>
                  <SelectItem value="b-minus">B-</SelectItem>
                  <SelectItem value="c-plus">C+</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="c-minus">C-</SelectItem>
                  <SelectItem value="d">D</SelectItem>
                  <SelectItem value="f">F</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFeedback}>Save Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

