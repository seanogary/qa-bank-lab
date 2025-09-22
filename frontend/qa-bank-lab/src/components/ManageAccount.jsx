import { useState } from "react"
import { Box, VStack, Text, HStack, Button, Input, Heading, Textarea, Badge } from "@chakra-ui/react"

function ManageAccount() {
  // Form states
  const [customRequest, setCustomRequest] = useState('')
  const [justification, setJustification] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock current policy (would come from API)
  const currentPolicy = {
    maxDeposit: 1000,
    maxWithdrawal: 1000,
    dailyWithdrawalLimit: 10000,
    allowNegativeBalance: true,
    overdraftLimit: 50
  }

  // Mock request history (would come from API)
  const requestHistory = [
    { id: 1, request: "Increase daily withdrawal to $15,000", status: "Approved", date: "2024-01-15" },
    { id: 2, request: "Enable overdraft protection up to $500", status: "Pending", date: "2024-01-20" },
    { id: 3, request: "Increase max deposit to $5,000", status: "Denied", date: "2024-01-10" }
  ]

  const handleQuickRequest = async (requestType) => {
    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      console.log('Quick policy request:', requestType)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`Policy request submitted: ${requestType}`)
    } catch (error) {
      console.error('Request failed:', error)
      alert('Request failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCustomRequest = async () => {
    if (!customRequest.trim()) return
    
    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      console.log('Custom policy request:', customRequest, 'Justification:', justification)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCustomRequest('')
      setJustification('')
      alert('Custom policy request submitted successfully!')
    } catch (error) {
      console.error('Request failed:', error)
      alert('Request failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'green'
      case 'Pending': return 'yellow'
      case 'Denied': return 'red'
      default: return 'gray'
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Current Policy Display */}
      <Box p={6} bg="white" borderRadius="md" shadow="sm" border="1px" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="blue.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">📋</Text>
            </Box>
            <Heading size="md" color="gray.800">Current Account Policy</Heading>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium">Max Deposit:</Text>
              <Text fontFamily="mono">${currentPolicy.maxDeposit.toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium">Max Withdrawal:</Text>
              <Text fontFamily="mono">${currentPolicy.maxWithdrawal.toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium">Daily Withdrawal Limit:</Text>
              <Text fontFamily="mono">${currentPolicy.dailyWithdrawalLimit.toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium">Overdraft Protection:</Text>
              <Text fontFamily="mono">
                {currentPolicy.allowNegativeBalance ? `Up to $${currentPolicy.overdraftLimit}` : 'Disabled'}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Quick Policy Requests */}
      <Box p={6} bg="white" borderRadius="md" shadow="sm" border="1px" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="green.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">⚡</Text>
            </Box>
            <Heading size="md" color="gray.800">Quick Policy Requests</Heading>
          </HStack>
          
          <Text fontSize="sm" color="gray.600">
            Common policy changes that can be requested instantly:
          </Text>
          
          <VStack spacing={3} align="stretch">
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => handleQuickRequest("Increase daily withdrawal to $15,000")}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Increase Daily Withdrawal to $15,000
            </Button>
            
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => handleQuickRequest("Enable overdraft protection up to $500")}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Enable Overdraft Protection ($500)
            </Button>
            
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => handleQuickRequest("Increase max deposit to $5,000")}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Increase Max Deposit to $5,000
            </Button>
            
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => handleQuickRequest("Increase max withdrawal to $2,500")}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Increase Max Withdrawal to $2,500
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Custom Policy Request */}
      <Box p={6} bg="white" borderRadius="md" shadow="sm" border="1px" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="purple.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">✏️</Text>
            </Box>
            <Heading size="md" color="gray.800">Custom Policy Request</Heading>
          </HStack>
          
          <Text fontSize="sm" color="gray.600">
            Need a specific policy change? Submit a custom request with justification:
          </Text>
          
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Policy Change Request
              </Text>
              <Input
                placeholder="e.g., Increase daily withdrawal limit to $25,000"
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                size="lg"
              />
            </Box>
            
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Justification (Optional)
              </Text>
              <Textarea
                placeholder="Explain why you need this policy change..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
              />
            </Box>
            
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleCustomRequest}
              isLoading={isSubmitting}
              loadingText="Submitting Request..."
              isDisabled={!customRequest.trim()}
            >
              Submit Custom Request
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Request History */}
      <Box p={6} bg="white" borderRadius="md" shadow="sm" border="1px" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="gray.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">📜</Text>
            </Box>
            <Heading size="md" color="gray.800">Request History</Heading>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            {requestHistory.map((request) => (
              <Box key={request.id} p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="medium" flex="1">{request.request}</Text>
                  <Badge colorScheme={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Submitted: {request.date}
                </Text>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Box>
    </VStack>
  )
}

export default ManageAccount
