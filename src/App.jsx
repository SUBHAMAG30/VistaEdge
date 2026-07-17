import { Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import Interviews from "./pages/Interviews"
import Resume from "./pages/Resume"
import ResumeBuilder from "./pages/ResumeBuilder"
import Coding from "./pages/Coding"
import LandingLayout from "./layouts/LandingLayout"
import DashboardLayout from "./layouts/DashboardLayout"
import ProtectedRoute from "./pages/ProtectedRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ResetPassword from "./pages/ResetPassword"
import Profile from "./pages/Profile"

function App() {
  return (
    <Routes>
      {/* Public Landing */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Protected Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/interviews" element={<Interviews />} />
        <Route path="/dashboard/resume" element={<ResumeBuilder />} />
        <Route path="/dashboard/coding" element={<Coding />} />
        <Route path="/profile" element={<Profile />} />

      </Route>

      {/* Auth Routes (should be outside protected) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default App
