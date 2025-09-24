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
          <Text>Loading accounts...</Text>
        </VStack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text color="red.500" fontSize="lg">{error}</Text>
          <Button onClick={() => window.location.reload()} colorScheme="blue">
            Retry
          </Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.md" py={12}>
        <VStack spacing={8} align="center">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Box w={12} h={12} bg="blue.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold" fontSize="xl">$</Text>
            </Box>
            <Heading size="2xl" color="gray.800">Bank of Quality</Heading>
            <Text fontSize="lg" color="gray.600">Select an account to continue</Text>
          </VStack>

          {/* Account List */}
          <VStack spacing={4} w="100%" maxW="md">
            {accounts.length === 0 ? (
              <Text color="gray.500">No accounts found</Text>
            ) : (
              accounts.map((account) => (
                <Button
                  key={account.account_ID}
                  w="100%"
                  h="auto"
                  p={6}
                  variant="outline"
                  borderColor="gray.300"
                  borderRadius="md"
                  _hover={{ bg: "blue.50", borderColor: "blue.300" }}
                  onClick={() => handleAccountSelect(account)}
                >
                  <VStack spacing={2} align="start" w="100%">
                    <HStack justify="space-between" w="100%">
                      <Text fontWeight="bold" fontSize="lg">{account.name}</Text>
                      <Text fontWeight="bold" color="green.600">
                        ${account.balance.toLocaleString()}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" fontFamily="mono">
                      {account.account_ID}
                    </Text>
                  </VStack>
                </Button>
              ))
            )}
          </VStack>

          {/* Footer */}
          <Text fontSize="sm" color="gray.400">
            Click on any account to access your dashboard
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default LoginPage
