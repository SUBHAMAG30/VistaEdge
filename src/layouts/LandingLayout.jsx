import { Outlet, Link } from "react-router-dom"
import AuthButtons from "@/components/AuthButtons"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function LandingLayout() {
  // State to manage mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    // Added overflow-hidden and w-full to prevent any horizontal scrolling
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <header className="bg-gray-900 text-white px-4 md:px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">
            <Link to="/">VistaEdge</Link>
          </h1>
          
          {/* Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-blue-400">Home</Link>
            <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <AuthButtons />
          </nav>

          {/* Mobile Menu Toggle Button (Hidden on Desktop) */}
          <button 
            className="md:hidden text-white hover:text-blue-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <nav className="md:hidden flex flex-col items-center gap-4 pt-4 pb-2 border-t border-gray-800 mt-4">
            <Link 
              to="/" 
              className="hover:text-blue-400 w-full text-center py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="hover:text-blue-400 w-full text-center py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="flex justify-center w-full pt-2">
              <AuthButtons />
            </div>
          </nav>
        )}
      </header>

      {/* Added w-full to main to ensure it respects screen boundaries */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-4 w-full">
        © {new Date().getFullYear()} VistaEdge. All rights reserved.
      </footer>
    </div>
  )
}