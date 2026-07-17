import { Navigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthProvider"

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If logged in → render children
  return children
}
