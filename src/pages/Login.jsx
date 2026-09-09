import { useState } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { useNavigate, Link } from "react-router-dom"
// Using lucide-react for the sleek UI icons
import { Eye, EyeOff, Loader2, Github } from "lucide-react"

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      navigate("/dashboard")
    } catch (err) {
      setError("Google sign-in failed.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4 font-sans text-gray-800">
      
      {/* Platform Branding (Replaces InterviewTalent) */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">V</span>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          VistaEdge
        </h1>
      </div>

      {/* Main Login Card */}
      <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Sign In</h2>
          <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold mb-2 ml-1">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full p-4 rounded-2xl border border-gray-200 bg-transparent focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-gray-700 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold mb-2 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-4 rounded-2xl border border-gray-200 bg-transparent focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-gray-700 placeholder-gray-400 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/reset-password" className="text-sm text-blue-500 hover:text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-[#C084FC] to-[#818CF8] text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all flex justify-center items-center h-14"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Or continue with</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#C084FC] to-[#818CF8] text-white font-medium hover:opacity-90 transition-all shadow-sm"
          >
            {/* Custom Google G SVG for precision */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <Github size={20} />
            GitHub
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}