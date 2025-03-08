import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import TeacherDashboard from "./pages/teacher/teacherDashboard";
import StudentDashboard from "./pages/student/studentDashBoard";
import LoginPage from "./pages/default/loginPage";
import ProtectedRoute from "./middleware/protectedRoute";
import Home from "./pages/default/Home";
import RegisterPage from "./pages/default/RegisterPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Teacher/dashboard" element={<ProtectedRoute element={<TeacherDashboard />} role="Teacher" />} />
          {/* <Route path="/Student/dashboard" element={<ProtectedRoute element={<StudentDashboard />} role="Student" />} /> */}
          <Route path="/Student/dashboard" element={<StudentDashboard />} />          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;