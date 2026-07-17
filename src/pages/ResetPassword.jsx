import { useState } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { Button } from "@/components/ui/button"

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleReset = async (e) => {
    e.preventDefault()
    try {
      await resetPassword(email)
      setMessage("Password reset email sent! Check your inbox.")
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleReset}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        {message && <p className="text-green-400 mb-4">{message}</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" className="w-full">
          Send Reset Email
        </Button>
      </form>
    </div>
  )
}
