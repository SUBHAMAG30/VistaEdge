import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/auth/AuthProvider"

export default function Landing() {
  const { user } = useAuth()

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-700 to-indigo-900 text-white px-6">
      <h1 className="text-5xl font-bold text-center mb-6">
        Master Every Aspect of{" "}
        <span className="text-blue-300">Interview Success</span>
      </h1>

      <p className="text-lg text-center max-w-xl mb-8 text-gray-200">
        AI-powered mock interviews, coding practice, resume builder, and much
        more — all in one platform designed to help you land your dream job.
      </p>

      {user ? (
        // Already logged in → Go straight to dashboard
        <Link to="/dashboard">
          <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
            🚀 Go to Dashboard
          </Button>
        </Link>
      ) : (
        // Not logged in → Go to login/signup
        <Link to="/signup">
          <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
            🚀 Start Your Journey
          </Button>
        </Link>
      )}
    </section>
  )
}
