import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Admin from './pages/Admin.jsx'

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <div style={{ minHeight: '100vh', background: '#ffffff', position: 'relative' }}>
      <ChakraProvider value={defaultSystem}>
        <Admin />
      </ChakraProvider>
    </div>
  </React.StrictMode>,
)
