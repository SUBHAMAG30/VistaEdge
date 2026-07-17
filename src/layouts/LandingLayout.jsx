import { Outlet, Link } from "react-router-dom"
import AuthButtons from "@/components/AuthButtons"

export default function LandingLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">VistaEdge</Link>
        </h1>
        <nav className="space-x-6 flex items-center">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <AuthButtons />
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-4">
        © {new Date().getFullYear()} VistaEdge. All rights reserved.
      </footer>
    </div>
  )
}
