// src/pages/Dashboard.jsx

import React, { useState,useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import {
  BarChart3,
  FileText,
  Users,
  Brain,
  Mic,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // get logged-in user
  const userName = user?.displayName || "User";

  return (
    <div className="p-6 space-y-10">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">
          Welcome back, <span className="text-blue-600">{userName}</span>
        </h1>
        <p className="text-gray-500">
          Your personalized dashboard to career growth and excellence.
        </p>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md rounded-2xl hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-600" size={28} />
              <h2 className="font-semibold text-lg">LeetCode Stats</h2>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Track and showcase your coding journey.
            </p>
            <Button
              className="mt-3 w-full"
              variant="outline"
              onClick={() => navigate("/leetcode")}
            >Launch</Button>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="text-green-600" size={28} />
              <h2 className="font-semibold text-lg">GitHub Activity</h2>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Keep a record of your contributions and growth.
            </p>
            <Button
              className="mt-3 w-full"
              variant="outline"
              onClick={() => navigate("/github")}
            >Launch</Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow rounded-2xl hover:shadow-md transition">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 text-sm">Interviews Completed</p>
              <h3 className="text-3xl font-bold mt-2">0</h3>
              <span className="text-xs text-green-500">+3 this week</span>
            </CardContent>
          </Card>

          <Card className="shadow rounded-2xl hover:shadow-md transition">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 text-sm">Resume Score</p>
              <h3 className="text-3xl font-bold mt-2">0%</h3>
              <span className="text-xs text-gray-400">Excellent rating</span>
            </CardContent>
          </Card>

          <Card className="shadow rounded-2xl hover:shadow-md transition">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 text-sm">Skills Improved</p>
              <h3 className="text-3xl font-bold mt-2">0</h3>
              <span className="text-xs text-gray-400">Key areas this month</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Explore & Practice Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Explore & Practice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition">
            <Brain className="mx-auto mb-3 text-blue-500" size={36} />
            <h3 className="font-semibold">AI Interview</h3>
            <p className="text-xs text-gray-500 mt-1">
              Practice with a smart AI interviewer.
            </p>
            <Button className="mt-3 w-full" variant="outline" onClick={() => navigate("/dashboard/interviews")}>
              Launch
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition">
            <FileText className="mx-auto mb-3 text-green-500" size={36} />
            <h3 className="font-semibold">Resume Builder</h3>
            <p className="text-xs text-gray-500 mt-1">
              Craft and optimize your resume.
            </p>
            <Button className="mt-3 w-full" variant="outline" onClick={() => navigate("/dashboard/resume")}>
              Launch
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition">
            <BarChart3 className="mx-auto mb-3 text-orange-500" size={36} />
            <h3 className="font-semibold">Aptitude Test</h3>
            <p className="text-xs text-gray-500 mt-1">
              Sharpen your problem-solving skills.
            </p>
            <Button className="mt-3 w-full" variant="outline" onClick={() => navigate("/dashboard/aptitude")}>
              Launch
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition">
            <Users className="mx-auto mb-3 text-purple-500" size={36} />
            <h3 className="font-semibold">Group Discussion</h3>
            <p className="text-xs text-gray-500 mt-1">
              Hone communication and leadership skills.
            </p>
            <Button className="mt-3 w-full" variant="outline" onClick={() => navigate("/dashboard/gd")}>
              Launch
            </Button>
          </Card>
        </div>
      </div>

      {/* Insights + Voice Interview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-md rounded-2xl">
          <h2 className="font-semibold text-lg">Insights & Tips</h2>
          <p className="text-gray-500 text-sm mt-2">
            Discover expert tips and insights to boost your preparation.
          </p>
          <Button className="mt-4" variant="secondary" onClick={() => navigate("/dashboard/tips")}>
            Explore Tips
          </Button>
        </Card>

        <Card className="p-6 border-2 border-blue-200 bg-blue-50 rounded-2xl">
          <div className="flex items-center gap-4">
            <Mic className="text-blue-600" size={44} />
            <div>
              <h2 className="font-semibold text-lg">Voice Interview</h2>
              <p className="text-gray-600 text-sm">
                Experience a fully interactive, AI-driven mock interview.
              </p>
            </div>
          </div>
          <Button className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate("/dashboard/voice-interview")}>
            Start Your Voice Interview
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
