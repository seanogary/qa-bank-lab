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
      <div style={{
        minHeight: '100vh',
        // Curved, non-linear dark-to-light matte gradient across the whole app
        // Layered gradients: conic + radial overlays to introduce curvature, over a non-linear linear-gradient base
        background: [
          // subtle curved sheen (conic) centered slightly right to curve the boundary
          'conic-gradient(from 250deg at 62% 50%, rgba(255,255,255,0.035) 0deg, rgba(255,255,255,0.018) 60deg, transparent 120deg)',
          // curved brightening on the right side (radial)
          'radial-gradient(120% 100% at 78% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)',
          // base non-linear linear gradient (ease-in brightness)
          'linear-gradient(112deg, #0a0a0a 0%, #0b0b0b 18%, #101010 32%, #151515 46%, #1c1c1c 58%, #242424 70%, #2f2f2f 82%, #3b3b3b 92%, #454545 100%)'
        ].join(', '),
        position: 'relative'
      }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // very subtle soft lights for matte feel (kept minimal)
          background: 'radial-gradient(ellipse at 24% 28%, rgba(255,255,255,0.028) 0%, transparent 52%), radial-gradient(ellipse at 80% 78%, rgba(255,255,255,0.018) 0%, transparent 56%)',
          pointerEvents: 'none',
          zIndex: -1
        }} />
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
