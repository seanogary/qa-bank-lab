import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, VStack, HStack, Text, Button, Heading, Container, Badge, Spinner } from "@chakra-ui/react"
import { api } from "../services/api"

function AdminPage({ onLogout }) {
  const [policyRequests, setPolicyRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch policy requests for admin view
  const fetchPolicyRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/admin/policy-requests')
      if (!response.ok) {
        throw new Error('Failed to fetch policy requests')
      }
      const data = await response.json()
      setPolicyRequests(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching policy requests:', err)
      setError(err.message)
      setPolicyRequests([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch policy requests on component mount
  useEffect(() => {
    fetchPolicyRequests()
  }, [])

  // Get status color for badge
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'yellow'
      case 'approved':
        return 'green'
      case 'rejected':
        return 'red'
      default:
        return 'gray'
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
    } catch {
      return 'Invalid Date'
    }
  }

  // Hardcoded approve/reject functionality
  const handleApprove = async (requestId) => {
    try {
      console.log('Approving request:', requestId)
      // TODO: Add actual API call to approve request
      alert(`Request ${requestId.slice(0, 8)}... approved!`)
      // Refresh the list
      fetchPolicyRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Failed to approve request')
    }
  }

  const handleReject = async (requestId) => {
    try {
      console.log('Rejecting request:', requestId)
      // TODO: Add actual API call to reject request
      alert(`Request ${requestId.slice(0, 8)}... rejected!`)
      // Refresh the list
      fetchPolicyRequests()
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    }
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Admin Header */}
      <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
        <Container maxW="container.xl" py={4}>
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Box w={8} h={8} bg="red.500" borderRadius="md" />
              <Heading size="md" color="gray.800">Admin Dashboard</Heading>
            </HStack>
            <HStack spacing={2}>
              <Button 
                onClick={() => navigate('/app?accountId=123&name=Test%20User&balance=1000')} 
                variant="outline" 
                size="sm"
                colorScheme="blue"
              >
                Back to User View
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Page Title */}
        <Box mb={8}>
          <Heading size="lg" color="gray.800" mb={2}>
            Policy Requests Management
          </Heading>
          <Text color="gray.600">
            Review and manage policy change requests from users
          </Text>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={12}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.600">Loading policy requests...</Text>
            </VStack>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box bg="red.50" border="1px" borderColor="red.200" borderRadius="md" p={6} mb={6}>
            <VStack align="start" spacing={2}>
              <Text color="red.800" fontWeight="bold">Error Loading Data</Text>
              <Text color="red.600">{error}</Text>
              <Button 
                onClick={fetchPolicyRequests} 
                colorScheme="red" 
                size="sm" 
                variant="outline"
              >
                Retry
              </Button>
            </VStack>
          </Box>
        )}

        {/* Policy Requests List */}
        {!loading && !error && (
          <VStack spacing={4} align="stretch">
            {policyRequests.length === 0 ? (
              <Box bg="white" borderRadius="lg" shadow="sm" p={8} textAlign="center">
                <Text color="gray.500" fontSize="lg">No policy requests found</Text>
              </Box>
            ) : (
              policyRequests.map((request) => (
                <Box key={request.request_id} bg="white" borderRadius="lg" shadow="sm" p={6}>
                  <VStack spacing={4} align="stretch">
                    {/* Header Row */}
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Text fontFamily="mono" fontSize="sm" color="gray.600">
                          ID: {request.request_id ? request.request_id.slice(0, 8) + '...' : 'N/A'}
                        </Text>
                        <Text fontWeight="bold" fontSize="lg">
                          User: {request.user_id || 'N/A'}
                        </Text>
                      </VStack>
                      <Badge colorScheme={getStatusColor(request.status)} size="lg">
                        {request.status || 'Unknown'}
                      </Badge>
                    </HStack>

                    {/* Policy Details */}
                    <Box bg="gray.50" borderRadius="md" p={4}>
                      <Text fontWeight="semibold" mb={3} color="gray.700">Requested Policy Changes:</Text>
                      <HStack spacing={6} wrap="wrap">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.600">Max Deposit</Text>
                          <Text fontWeight="medium">
                            ${request.policy_request?.max_deposit?.toLocaleString() || 'N/A'}
                          </Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.600">Max Withdrawal</Text>
                          <Text fontWeight="medium">
                            ${request.policy_request?.max_withdrawal?.toLocaleString() || 'N/A'}
                          </Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.600">Daily Limit</Text>
                          <Text fontWeight="medium">
                            ${request.policy_request?.daily_withdrawal_limit?.toLocaleString() || 'N/A'}
                          </Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.600">Overdraft Limit</Text>
                          <Text fontWeight="medium">
                            ${request.policy_request?.overdraft_limit?.toLocaleString() || 'N/A'}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>

                    {/* Justification */}
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>Justification:</Text>
                      <Text fontSize="sm" bg="blue.50" p={3} borderRadius="md">
                        {request.policy_request?.justification || 'No justification provided'}
                      </Text>
                    </Box>

                    {/* Footer */}
                    <HStack justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.600">
                        Created: {formatDate(request.created_at)}
                      </Text>
                      <HStack spacing={2}>
                        <Button 
                          size="sm" 
                          colorScheme="green" 
                          variant="outline"
                          onClick={() => handleApprove(request.request_id)}
                          isDisabled={request.status === 'approved' || request.status === 'rejected'}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="red" 
                          variant="outline"
                          onClick={() => handleReject(request.request_id)}
                          isDisabled={request.status === 'approved' || request.status === 'rejected'}
                        >
                          Reject
                        </Button>
                      </HStack>
                    </HStack>
                  </VStack>
                </Box>
              ))
            )}
          </VStack>
        )}

        {/* Summary Stats */}
        {!loading && !error && policyRequests.length > 0 && (
          <HStack spacing={6} mt={6} wrap="wrap">
            <Box bg="white" p={4} borderRadius="md" shadow="sm" flex="1" minW="200px">
              <VStack align="start">
                <Text color="gray.600" fontSize="sm">Total Requests</Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  {policyRequests.length}
                </Text>
              </VStack>
            </Box>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" flex="1" minW="200px">
              <VStack align="start">
                <Text color="gray.600" fontSize="sm">Pending</Text>
                <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                  {policyRequests.filter(r => r.status === 'pending').length}
                </Text>
              </VStack>
            </Box>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" flex="1" minW="200px">
              <VStack align="start">
                <Text color="gray.600" fontSize="sm">Approved</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {policyRequests.filter(r => r.status === 'approved').length}
                </Text>
              </VStack>
            </Box>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" flex="1" minW="200px">
              <VStack align="start">
                <Text color="gray.600" fontSize="sm">Rejected</Text>
                <Text fontSize="2xl" fontWeight="bold" color="red.600">
                  {policyRequests.filter(r => r.status === 'rejected').length}
                </Text>
              </VStack>
            </Box>
          </HStack>
        )}
      </Container>
    </Box>
  )
}

export default AdminPage
