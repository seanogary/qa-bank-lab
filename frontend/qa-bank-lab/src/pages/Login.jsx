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
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading accounts...</Text>
        </VStack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text color="red.600" fontSize="lg">{error}</Text>
          <Button onClick={() => window.location.reload()} colorScheme="blue" variant="outline">
            Retry
          </Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50" position="relative">
      <Container maxW="container.md" py={12}>
        <VStack spacing={8} align="center">
          {/* Header Card */}
          <Box
            bg="white"
            p={8}
            borderRadius="2xl"
            boxShadow="sm"
            position="relative"
            border="1px solid"
            borderColor="gray.200"
          >
            <VStack spacing={4} textAlign="center">
              <Box 
                w={12} h={12} 
                bg="blue.500"
                borderRadius="md" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                boxShadow="md"
              >
                <Text color="white" fontWeight="bold" fontSize="xl">$</Text>
              </Box>
              <Heading size="2xl" color="gray.800" fontWeight="bold">Bank of Quality</Heading>
              <Text fontSize="lg" color="gray.600" fontWeight="medium">Select an account to continue</Text>
            </VStack>
          </Box>

          {/* ADMIN BUTTON - SEPARATE FROM ACCOUNTS */}
          <Button
            w="100%"
            maxW="md"
            h="80px"
            bg="red.600"
            color="white"
            fontSize="2xl"
            fontWeight="bold"
            borderRadius="lg"
            shadow="sm"
            _hover={{ bg: "red.700", shadow: "md" }}
            transition="background 0.2s ease"
            onClick={() => window.location.href = '/admin.html'}
          >
            🔧 ADMIN DASHBOARD 🔧
          </Button>

          {/* Divider */}
          <HStack w="100%" maxW="md" spacing={4}>
            <Box h="1px" bg="gray.300" flex="1" />
            <Text fontSize="sm" color="gray.500" px={2}>OR</Text>
            <Box h="1px" bg="gray.300" flex="1" />
          </HStack>

          {/* Account List */}
          <VStack spacing={4} w="100%" maxW="md">
            {accounts.length === 0 ? (
              <Text color="gray.600">No accounts found</Text>
            ) : (
              accounts.map((account, index) => (
                <Button
                  key={account.account_ID}
                  w="100%"
                  h="auto"
                  p={6}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  boxShadow="sm"
                  _hover={{ 
                    bg: "gray.50",
                    boxShadow: "md"
                  }}
                  transition="background 0.2s ease"
                  onClick={() => handleAccountSelect(account)}
                >
                  <VStack spacing={3} align="start" w="100%">
                    <HStack justify="space-between" w="100%">
                      <Text fontWeight="bold" fontSize="lg" color="gray.800">{account.name}</Text>
                      <Text fontWeight="bold" color="green.600" fontSize="lg">
                        ${account.balance.toLocaleString()}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" fontFamily="mono" bg="gray.100" px={2} py={1} borderRadius="md">
                      {account.account_ID}
                    </Text>
                  </VStack>
                </Button>
              ))
            )}
          </VStack>

          {/* Footer */}
          <Text fontSize="sm" color="gray.600">
            Click on any account to access your dashboard
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default LoginPage
