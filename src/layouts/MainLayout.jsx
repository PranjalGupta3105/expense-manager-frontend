// import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
            <Outlet />
        </main>
    </div>
  )
}

export default MainLayout
