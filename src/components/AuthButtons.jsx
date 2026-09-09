import { useAuth } from "@/auth/AuthProvider"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function AuthButtons() {
  const { user, logout, loginWithGoogle } = useAuth()

  if (user) {
    return (
      <div className="flex items-center justify-end gap-2 sm:gap-4 flex-wrap">
        {/* Avatar */}
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="profile"
            className="w-8 h-8 rounded-full border border-gray-600"
          />
        )}

        {/* User Email - Hidden on mobile (sm) to prevent layout breaking */}
        <span className="text-sm hidden sm:inline-block truncate max-w-[150px]">
          {user.displayName || user.email}
        </span>
        
        <Link to="/profile">
          {/* Make button smaller on mobile using Tailwind padding text classes */}
          <Button variant="outline" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm h-auto">
            Profile
          </Button>
        </Link>
        
        {/* Logout */}
        <Button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm h-auto"
        >
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      <Link to="/login">
        <Button variant="outline" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm h-auto">
          Login
        </Button>
      </Link>
      
      <Link to="/signup">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm h-auto">
          Sign Up
        </Button>
      </Link>

      {/* Optional: Quick Google login */}
      <Button
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm h-auto"
        onClick={loginWithGoogle}
      >
        Google
      </Button>
    </div>
  )
}