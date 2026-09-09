// src/layouts/DashboardLayout.jsx

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Importing icons for the mobile menu

const DashboardLayout = () => {
  // State to control whether the mobile sidebar is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden w-full">
      
      {/* 1. Desktop Sidebar (Hidden on mobile devices) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* 2. Mobile Sidebar Overlay (Only shows when Hamburger menu is clicked) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Dimmed background click-away to close */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar container sliding in */}
          <div className="relative z-50 w-64 h-full bg-white shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      {/* Added min-w-0 to prevent flex children from overflowing on mobile */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        
        {/* Topbar / Header */}
        <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex justify-between items-center z-10 relative">
          <div className="flex items-center gap-3">
            
            {/* Mobile Hamburger Menu Button (Hidden on Desktop) */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <h1 className="text-xl font-bold text-gray-800">VistaEdge</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-gray-100 text-xl">
              🔔
            </button>
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
              S
            </div>
          </div>
        </header>

        {/* Main Dashboard Area */}
        {/* Adjusted padding for mobile screens */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;