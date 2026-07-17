import { useState } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Signup() {
  const { signup } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    console.log("Trying signup with:", email, password) // debug log
    try {
      await signup(email, password)
      console.log("Signup successful ✅")
      navigate("/dashboard")
    } catch (err) {
      console.error("Signup failed ❌:", err.message)
      setError(err.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSignup}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Create an Account</h2>
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

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  )
}
