import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function App() {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Redirect to login page
    navigate('/')
  }, [navigate])
  
  return null
}

export default App
