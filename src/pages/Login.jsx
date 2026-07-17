import { useState } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Log In</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full mb-3">
          Log In
        </Button>

        <Button
          type="button"
          className="w-full bg-red-500 hover:bg-red-600"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>

        <p className="mt-2 text-sm text-center">
          <Link to="/reset-password" className="text-yellow-400 hover:underline">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  )
}
