import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, VStack, HStack, Text, Button, Heading, Container, Center, Spinner } from "@chakra-ui/react"
import { api } from "../services/api"

function LoginPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true)
        const data = await api.getAllAccounts()
        setAccounts(data)
      } catch (err) {
        setError('Failed to load accounts')
        console.error('Error fetching accounts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const handleAccountSelect = (account) => {
    // Navigate to main app with account info
    navigate(`/app?accountId=${account.account_ID}&name=${encodeURIComponent(account.name)}&balance=${account.balance}`)
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="transparent" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.300" />
          <Text color="gray.200">Loading accounts...</Text>
        </VStack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box minH="100vh" bg="transparent" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text color="red.300" fontSize="lg">{error}</Text>
          <Button onClick={() => window.location.reload()} colorScheme="blue" variant="outline">
            Retry
          </Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box 
      minH="100vh" 
      bg="transparent"
      position="relative"
    >
      <Container maxW="container.md" py={12}>
        <VStack spacing={8} align="center">
          {/* Floating Hero Card */}
          <Box
            bgGradient="linear(112deg, rgba(20,20,20,0.9), rgba(30,30,30,0.9))"
            p={8}
            borderRadius="2xl"
            boxShadow="0 12px 32px rgba(0,0,0,0.45)"
            transform="rotate(-1deg)"
            position="relative"
            border="1px solid rgba(255,255,255,0.06)"
            _before={{
              content: '""',
              position: "absolute",
              inset: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 40%)',
              borderRadius: "2xl",
              pointerEvents: 'none'
            }}
          >
            <VStack spacing={4} textAlign="center">
              <Box 
                w={16} h={16} 
                bgGradient="linear(135deg, #1f6feb, #3b82f6)" 
                borderRadius="xl" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                boxShadow="0 8px 18px rgba(0,0,0,0.45)"
              >
                <Text color="white" fontWeight="bold" fontSize="2xl">$</Text>
              </Box>
              <Heading size="2xl" color="white" fontWeight="bold">Bank of Quality</Heading>
              <Text fontSize="lg" color="gray.300" fontWeight="medium">Select an account to continue</Text>
            </VStack>
          </Box>

          {/* ADMIN BUTTON - SEPARATE FROM ACCOUNTS */}
          <Button
            w="100%"
            maxW="md"
            h="80px"
            bgGradient="linear(135deg, red.500, red.600)"
            color="white"
            fontSize="2xl"
            fontWeight="bold"
            borderRadius="xl"
            shadow="xl"
            transform="rotate(0.5deg)"
            _hover={{ 
              bgGradient: "linear(135deg, red.600, red.700)",
              transform: "rotate(0.5deg) translateY(-2px)",
              shadow: "2xl"
            }}
            transition="all 0.2s ease"
            onClick={() => window.location.href = '/admin.html'}
          >
            🔧 ADMIN DASHBOARD 🔧
          </Button>

          {/* Divider */}
          <HStack w="100%" maxW="md" spacing={4}>
            <Box h="1px" bg="gray.600" flex="1" />
            <Text fontSize="sm" color="gray.400" px={2}>OR</Text>
            <Box h="1px" bg="gray.600" flex="1" />
          </HStack>

          {/* Account List */}
          <VStack spacing={4} w="100%" maxW="md">
            {accounts.length === 0 ? (
              <Text color="gray.500">No accounts found</Text>
            ) : (
              accounts.map((account, index) => (
                <Button
                  key={account.account_ID}
                  w="100%"
                  h="auto"
                  p={6}
                  bg="rgba(20,20,20,0.85)"
                  border="1px solid rgba(255,255,255,0.06)"
                  borderRadius="xl"
                  boxShadow="0 8px 20px rgba(0,0,0,0.35)"
                  transform={`rotate(${index % 2 === 0 ? '0.5deg' : '-0.5deg'})`}
                  _hover={{ 
                    bg: "rgba(28,28,28,0.9)",
                    transform: `rotate(${index % 2 === 0 ? '0.5deg' : '-0.5deg'}) translateY(-3px)`,
                    boxShadow: "0 12px 28px rgba(0,0,0,0.5)"
                  }}
                  transition="all 0.2s ease"
                  onClick={() => handleAccountSelect(account)}
                >
                  <VStack spacing={3} align="start" w="100%">
                    <HStack justify="space-between" w="100%">
                      <Text fontWeight="bold" fontSize="lg" color="white">{account.name}</Text>
                      <Text fontWeight="bold" color="green.300" fontSize="lg">
                        ${account.balance.toLocaleString()}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.300" fontFamily="mono" bg="rgba(255,255,255,0.06)" px={2} py={1} borderRadius="md">
                      {account.account_ID}
                    </Text>
                  </VStack>
                </Button>
              ))
            )}
          </VStack>

          {/* Footer */}
          <Text fontSize="sm" color="gray.300">
            Click on any account to access your dashboard
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default LoginPage
