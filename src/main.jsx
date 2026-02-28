import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Public pages
import App from "./App"
import Chatbuddy from "./Chatbuddy"
import Appointments from "./Appointments"

// Admin pages
import AdminDashboard from "./AdminDashboard"
import AdminSettings from "./AdminSettings"


function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<App />} />
        <Route path="/chatbuddy" element={<Chatbuddy />} />
        <Route path="/appointments" element={<Appointments />} />
        {/* Admin Pages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </BrowserRouter>
  )
}
// Render the app
createRoot(document.getElementById('root')).render( <StrictMode><Router/></StrictMode>)