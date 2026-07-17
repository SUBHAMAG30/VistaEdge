// src/layouts/DashboardLayout.jsx

import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";



const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar / Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">VistaEdge</h1>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-gray-100">
              🔔
            </button>
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
              S
            </div>
          </div>
        </header>

        {/* Main Dashboard Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
