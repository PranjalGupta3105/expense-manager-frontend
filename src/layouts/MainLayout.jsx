// import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full px-0 py-4">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
