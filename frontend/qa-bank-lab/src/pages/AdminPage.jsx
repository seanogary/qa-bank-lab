import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminPage from "../components/AdminPage"

function AdminPageRoute() {
  const navigate = useNavigate()
  
  // Simple admin authentication check (hardcoded for now)
  useEffect(() => {
    // In a real app, you'd check for admin authentication
    // For now, we'll just allow access to the admin page
    console.log("Admin page accessed")
  }, [navigate])

  const handleLogout = () => {
    navigate('/')
  }

  return <AdminPage onLogout={handleLogout} />
}

export default AdminPageRoute
