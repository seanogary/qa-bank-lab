import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Admin from './pages/Admin.jsx'

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #ff0000 0%, #000000 20%, #0000ff 40%, #000000 60%, #00ff00 80%, #000000 100%)',
      position: 'relative'
    }}>
      <ChakraProvider value={defaultSystem}>
        <Admin />
      </ChakraProvider>
    </div>
  </React.StrictMode>,
)
