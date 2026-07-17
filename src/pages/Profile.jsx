import { useState } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { Button } from "@/components/ui/button"

export default function Profile() {
  const { user, updateUserProfile } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateUserProfile({ displayName })
      setMessage("Profile updated successfully!")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleUpdate}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
        {message && <p className="text-green-400 mb-4">{message}</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Display Name"
          className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  )
}
