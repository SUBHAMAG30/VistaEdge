// src/layouts/Sidebar.jsx

import React from "react";
import { Home, FileText, Users, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "AI Interview", icon: <Users size={20} />, path: "/dashboard/interviews" },
    { name: "Resume Builder", icon: <FileText size={20} />, path: "/dashboard/resume" },
    { name: "Aptitude Test", icon: <BarChart3 size={20} />, path: "/dashboard/aptitude" },
    { name: "Settings", icon: <Settings size={20} />, path: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">VistaEdge</h2>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
