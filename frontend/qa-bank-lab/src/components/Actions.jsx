import { useState } from "react"
import { Box, VStack, HStack, Text, Button, Input, Heading, Spinner } from "@chakra-ui/react"
import { api } from "../services/api"

function Actions({ account, onTransactionSuccess }) {
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)
  // Form states
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [snailRecipient, setSnailRecipient] = useState('')
  const [snailAmount, setSnailAmount] = useState('')
  
  // Loading states
  const [depositLoading, setDepositLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [snailLoading, setSnailLoading] = useState(false)

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) return
    
    setDepositLoading(true)
    try {
      const result = await api.deposit(account.account_ID, parseInt(depositAmount))
      setDepositAmount('')
      
      // Check transaction status
      const transactionStatus = result.transaction.status.toLowerCase()
      
      if (transactionStatus === 'success') {
        // Refresh account data after successful deposit
        await onTransactionSuccess()
        // Show success notification
        setNotification(`Successfully deposited $${depositAmount}`)
        setNotificationType('success')
      } else {
        // Show declined notification
        setNotification(`Deposit declined: ${transactionStatus}`)
        setNotificationType('declined')
      }
      
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 3000)
    } catch (error) {
      console.error('Deposit failed:', error)
      alert('Deposit failed. Please try again.')
    } finally {
      setDepositLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) return
    
    setWithdrawLoading(true)
    try {
      const result = await api.withdraw(account.account_ID, parseInt(withdrawAmount))
      setWithdrawAmount('')
      
      // Check transaction status
      const transactionStatus = result.transaction.status.toLowerCase()
      
      if (transactionStatus === 'success') {
        // Refresh account data after successful withdrawal
        await onTransactionSuccess()
        // Show success notification
        setNotification(`Successfully withdrew $${withdrawAmount}`)
        setNotificationType('success')
      } else {
        // Show declined notification
        setNotification(`Withdrawal declined: ${transactionStatus}`)
        setNotificationType('declined')
      }
      
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 3000)
    } catch (error) {
      console.error('Withdrawal failed:', error)
      alert('Withdrawal failed. Please try again.')
    } finally {
      setWithdrawLoading(false)
    }
  }

  const handleSnail = async () => {
    if (!snailRecipient || !snailAmount || snailAmount <= 0) return
    
    setSnailLoading(true)
    try {
      // TODO: Replace with actual API call
      console.log('Sending via Snail:', snailAmount, 'to', snailRecipient)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSnailRecipient('')
      setSnailAmount('')
      alert(`Successfully sent $${snailAmount} to ${snailRecipient} via Snail! 🐌`)
    } catch (error) {
      console.error('Snail transfer failed:', error)
      alert('Snail transfer failed. Please try again.')
    } finally {
      setSnailLoading(false)
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Transaction Notification - Floating */}
      {notification && (
        <Box
          position="fixed"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          zIndex={1000}
          p={4}
          bg={notificationType === 'success' ? 'green.50' : 'red.50'}
          border="1px"
          borderColor={notificationType === 'success' ? 'green.200' : 'red.200'}
          borderRadius="md"
          color={notificationType === 'success' ? 'green.800' : 'red.800'}
          boxShadow="lg"
          minWidth="300px"
          maxWidth="400px"
        >
          <HStack align="start">
            <Text fontSize="xl" mr={2}>
              {notificationType === 'success' ? '✓' : '✗'}
            </Text>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">
                {notificationType === 'success' ? 'Transaction Successful!' : 'Transaction Declined'}
              </Text>
              <Text fontSize="sm">{notification}</Text>
            </VStack>
          </HStack>
        </Box>
      )}
      {/* Deposit Form */}
      <Box p={6} bg="white" borderRadius="md" shadow="sm" border="1px" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="green.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">+</Text>
            </Box>
            <Heading size="md" color="gray.800">Deposit Money</Heading>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Amount to Deposit
              </Text>
              <Input
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                size="lg"
              />
            </Box>
            
            <Button
              colorScheme="green"
              size="lg"
              onClick={handleDeposit}
              isLoading={depositLoading}
              loadingText="Processing..."
              isDisabled={!depositAmount || depositAmount <= 0}
            >
              Deposit Money
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Withdrawal Form */}
      <Box p={6} bg="white" borderRadius="md" shadow="sm" border="1px" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="red.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">-</Text>
            </Box>
            <Heading size="md" color="gray.800">Withdraw Money</Heading>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Amount to Withdraw
              </Text>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                size="lg"
              />
            </Box>
            
            <Button
              colorScheme="red"
              size="lg"
              onClick={handleWithdraw}
              isLoading={withdrawLoading}
              loadingText="Processing..."
              isDisabled={!withdrawAmount || withdrawAmount <= 0}
            >
              Withdraw Money
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Snail (Send Money) Form */}
      <Box p={6} bg="white" borderRadius="md" shadow="sm" border="1px" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="blue.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">🐌</Text>
            </Box>
            <Heading size="md" color="gray.800">Snail</Heading>
            <Text fontSize="sm" color="gray.500" fontStyle="italic">Send money fast, like a snail</Text>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Recipient (Username or Phone)
              </Text>
              <Input
                type="text"
                placeholder="Enter username or phone number"
                value={snailRecipient}
                onChange={(e) => setSnailRecipient(e.target.value)}
                size="lg"
              />
            </Box>
            
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Amount to Send
              </Text>
              <Input
                type="number"
                placeholder="Enter amount"
                value={snailAmount}
                onChange={(e) => setSnailAmount(e.target.value)}
                size="lg"
              />
            </Box>
            
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleSnail}
              isLoading={snailLoading}
              loadingText="Sending via Snail..."
              isDisabled={!snailRecipient || !snailAmount || snailAmount <= 0}
            >
              Send via Snail 🐌
            </Button>
          </VStack>
          
          <Box p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
            <Text fontSize="xs" color="blue.700">
              💡 Snail works like Zelle - send money to friends using their username or phone number. 
              Transfers are instant and secure!
            </Text>
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
}

export default Actions
