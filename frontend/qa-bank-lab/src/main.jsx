import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login.jsx'
import AppPage from './pages/AppPage.jsx'
import AdminPageRoute from './pages/AdminPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/admin" element={<AdminPageRoute />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>
  </StrictMode>,
)
