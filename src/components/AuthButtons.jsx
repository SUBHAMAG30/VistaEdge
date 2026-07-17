import { useAuth } from "@/auth/AuthProvider"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function AuthButtons() {
  const { user, logout, loginWithGoogle } = useAuth()

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {/* Avatar */}
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="profile"
            className="w-8 h-8 rounded-full border border-gray-600"
          />
        )}

        {/* User Email */}
        <span className="text-sm">{user.displayName || user.email}</span>
        <Link to="/profile">
          <Button variant="outline">Profile</Button>
        </Link>
        {/* Logout */}
        <Button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/login">
        <Button variant="outline">Login</Button>
      </Link>
      <Link to="/signup">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Sign Up
        </Button>
      </Link>

      {/* Optional: Quick Google login */}
      <Button
        className="bg-red-500 hover:bg-red-600 text-white"
        onClick={loginWithGoogle}
      >
        Google
      </Button>
    </div>
  )
}
