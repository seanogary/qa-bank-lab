import { useState } from "react"
// NOTE: useState is a React hook for managing local component state. Prefer hooks over class-based state for modern React codebases.
import { Box, VStack, HStack, Text, Button, Input, Heading, Spinner } from "@chakra-ui/react"
// NOTE: Chakra UI provides accessible, themeable React components. Using a UI library accelerates development and ensures consistency.
import { api } from "../services/api"

function Actions({ account, onTransactionSuccess }) {
  // NOTE: Destructuring props is a best practice for readability. Consider prop-types or TypeScript for type safety.
  const [notification, setNotification] = useState(null)
  // NOTE: Notification state is used for transient user feedback. Consider a global notification system for larger apps.
  const [notificationType, setNotificationType] = useState(null)

  // Form states
  const [depositAmount, setDepositAmount] = useState('')
  // NOTE: Controlled inputs ensure React is the source of truth for form values. Always validate user input before processing.
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [snailRecipient, setSnailRecipient] = useState('')
  const [snailAmount, setSnailAmount] = useState('')
  
  // Loading states
  const [depositLoading, setDepositLoading] = useState(false)
  // NOTE: Loading states provide responsive UX during async operations. Use them to disable buttons and show spinners.
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [snailLoading, setSnailLoading] = useState(false)
  
  // Username suggestions state
  const [usernameSuggestions, setUsernameSuggestions] = useState([])
  // NOTE: Suggestion state enables dynamic UI features like autocomplete. For production, fetch suggestions from backend APIs.
  


  /*

  NEED TO REMOVE -- NEED TO REMOVE -- NEED TO REMOVE -- ;

  THANK YOU FOR YOUR ATTENTION TO THIS MATTER!

  */
  // Mock username function


  const getMockUsernames = () => {
  // NOTE: This mock function is for demo purposes. Replace with real API calls for production. Randomization is useful for testing UI behavior.
    const allUsernames = ['alice.', 'james.', 'john.', 'kiki.', 'sean.', 'thames.']
    const count = Math.floor(Math.random() * 5) + 2 // Random between 2-6
    const shuffled = [...allUsernames].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  

  /*

  NEED TO REMOVE -- NEED TO REMOVE -- NEED TO REMOVE -- ;

  THANK YOU FOR YOUR ATTENTION TO THIS MATTER!

  */

  // Handle username input changes
  const handleUsernameChange = (value) => {
  // NOTE: Debounce input changes for performance if calling APIs. Use useCallback for stable function references in child components.
    setSnailRecipient(value)
    
    // If there are non-zero letters, generate mock suggestions
    if (value.length > 0) {
      const mockSuggestions = getMockUsernames()
      setUsernameSuggestions(mockSuggestions)
      console.log('Mock username suggestions:', mockSuggestions)
    } else {
      setUsernameSuggestions([])
    }
  }

  const handleDeposit = async () => {
  // NOTE: Async functions are required for await. Always handle errors gracefully and provide user feedback.
    if (!depositAmount || depositAmount <= 0) return
  // NOTE: Input validation prevents invalid transactions. Consider showing inline validation errors to users.
    
    setDepositLoading(true)
  // NOTE: Set loading state before async calls to prevent duplicate submissions.
    try {
  // NOTE: API calls should be wrapped in try/catch for robust error handling. Consider using a service layer for API logic.
      const result = await api.deposit(account.account_ID, parseInt(depositAmount))
  // NOTE: Always parse and validate API responses. Defensive coding prevents runtime errors from unexpected data.
      setDepositAmount('')
      
      // Check transaction status
      const transactionStatus = result.transaction.status.toLowerCase()
  // NOTE: Normalize status strings for consistent logic. Consider using enums or constants for status values.
      
      
      // COPILOT: PLEASE LEAVE A NOTE FOR ME TO DO SOME CUSTOM WORK HERE RE CUSTOMIZING THE BEHAVIOR BASED ON THE TRANSACTION STATUS
      // NOTE: You can customize the behavior here based on the transaction status. For example, you might want to trigger different UI updates, log events, or handle edge cases for statuses like 'pending', 'failed', or 'review'. Consider what actions should be taken for each possible status returned by the API.
      if (transactionStatus === 'success') {
  // NOTE: Success path should update UI and state. Consider optimistic UI updates for faster feedback.
  // NOTE: Handle all possible error states. Log errors for monitoring and debugging.
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

      // COPILOT: PLEASE LEAVE A NOTE EXPLAINING WHAT IN THIS IS STANDARD AND WORTH INTERNALIZING FOR ME
      // NOTE: Using setTimeout to clear notifications after a short period (e.g., 3 seconds) is a standard UX pattern for transient messages. Internalize this approach for showing temporary feedback to users after actions like deposits or withdrawals.
      setTimeout(() => {
  // NOTE: setTimeout is used for temporary notifications. For accessibility, consider ARIA live regions.
        setNotification(null)
        setNotificationType(null)
      }, 3000)

    } catch (error) {
  // NOTE: Always log errors with context. Avoid exposing sensitive error details to users.
      
      console.error('Deposit failed:', error)
      alert('Deposit failed. Please try again.')
      
    }
    
    finally {
  // NOTE: Cleanup logic (e.g., resetting loading state) should always run, even if errors occur.
      setDepositLoading(false)
      // NOTE: The catch and finally blocks are now spaced out for easier readability. This helps you quickly distinguish error handling from cleanup logic.
    }
  }

  // COPILOT: I AM NOTICING A PATTERN BETWEEN THE HANDLEWITHDRAW FUNCTION AND THE HANDLEDEPOSIT FUNCTION. PLEASE LEAVE A NOTE FOR ME TO REFLECT ON THIS AND SEE IF I CAN GENERALIZE THEM INTO A SINGLE FUNCTION.
  // NOTE: Both handleWithdraw and handleDeposit functions share similar logic: validating input, setting loading state, calling an API, handling results, and updating UI. Consider refactoring them into a single generic function that takes the transaction type ('deposit' or 'withdraw') and amount as parameters. This will reduce code duplication and make future changes easier to manage.
  const handleWithdraw = async () => {
  // NOTE: This function closely mirrors handleDeposit. Refactor to a generic transaction handler to reduce duplication.
    if (!withdrawAmount || withdrawAmount <= 0) return
  // NOTE: Consistent validation logic across forms improves maintainability.
    setWithdrawLoading(true)
  // NOTE: UI feedback for async actions is critical for good UX.
  // NOTE: API error handling should be consistent across all transaction types.
    try {
      const result = await api.withdraw(account.account_ID, parseInt(withdrawAmount))
  // NOTE: Always reset form state after successful transactions.
  // NOTE: Consider extracting status handling to a shared utility function.
  // NOTE: Triggering parent callbacks (onTransactionSuccess) is a good pattern for updating parent state.
  // NOTE: Provide clear error messages for declined transactions.
  // NOTE: Consistent notification patterns improve user trust.
  // NOTE: Error handling should be user-friendly and actionable.
  // NOTE: Always reset loading state to avoid stuck UI.
      setWithdrawAmount('')
      // Check transaction status
      const transactionStatus = result.transaction.status.toLowerCase()
      if (transactionStatus === 'success') {
        await onTransactionSuccess()
        setNotification(`Successfully withdrew $${withdrawAmount}`)
        setNotificationType('success')
      } else {
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
  // NOTE: This function demonstrates sending money to another user. For real apps, validate recipient and amount server-side.
    if (!snailRecipient || !snailAmount || snailAmount <= 0) return
  // NOTE: Validate all required fields before processing.
    
    setSnailLoading(true)
  // NOTE: Loading states prevent duplicate submissions and show progress.
  // NOTE: Always sanitize and validate user input before sending to APIs.
    try {
      // Get current user's username (assuming it's stored in account.name with period)
      const fromUsername = account.name.toLowerCase() + '.'
  // NOTE: Username normalization helps prevent case sensitivity bugs.
      const toUsername = snailRecipient
      
      const result = await api.sendSnail(fromUsername, toUsername, parseInt(snailAmount))
  // NOTE: API responses should be checked for both success and error cases.
      
      // Check if transfer was successful
      if (result.transaction && result.transaction.status === 'SUCCESS') {
  // NOTE: Always clear form state after successful actions.
  // NOTE: Provide actionable error messages for failed transfers.
  // NOTE: Log errors for debugging and monitoring. Avoid leaking sensitive info.
  // NOTE: Always reset loading state after async actions.
        // Refresh account data after successful transfer
        await onTransactionSuccess()
        setSnailRecipient('')
        setSnailAmount('')
        alert(`Successfully sent $${snailAmount} to ${toUsername} via Snail! 🐌`)
      } else {
        // Handle error case
        const errorMsg = result.error || 'Transfer failed'
        alert(`Snail transfer failed: ${errorMsg}`)
      }
    } catch (error) {
      console.error('Snail transfer failed:', error)
      alert('Snail transfer failed. Please try again.')
    } finally {
      setSnailLoading(false)
    }
  }

  return (
  // NOTE: Use semantic HTML and accessible components for forms. Chakra UI helps with accessibility out of the box.
    <VStack spacing={6} align="stretch">
      {/* Transaction Notification - Floating */}
      {notification && (
  // NOTE: Floating notifications improve visibility. Consider accessibility for screen readers.
        <Box
          position="fixed"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          zIndex={1000}
          p={4}
          bg={notificationType === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(248,113,113,0.12)'}
          border="1px"
          borderColor={notificationType === 'success' ? 'rgba(34,197,94,0.35)' : 'rgba(248,113,113,0.35)'}
          borderRadius="lg"
          color={notificationType === 'success' ? 'green.200' : 'red.200'}
          boxShadow="0 16px 32px rgba(0,0,0,0.35)"
          minWidth="300px"
          maxWidth="400px"
        >
          <HStack align="start">
            <Text fontSize="xl" mr={2}>
              {notificationType === 'success' ? '✓' : '✗'}
            </Text>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" color="white">
                {notificationType === 'success' ? 'Transaction Successful!' : 'Transaction Declined'}
              </Text>
              <Text fontSize="sm" color="gray.200">{notification}</Text>
            </VStack>
          </HStack>
        </Box>
      )}
      {/* Deposit Form */}
      <Box p={6} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200">

        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="green.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">+</Text>
            </Box>
            <Heading size="md" color="gray.800" className="brand-type">Deposit Money</Heading>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Amount to Deposit
              </Text>
              <Input
              // NOTE: Use type="number" for currency inputs, but validate and sanitize to prevent non-numeric values.
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                size="lg"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
                _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px rgba(34,197,94,0.4)" }}
              />
            </Box>
            
            <Button
              // NOTE: Disable buttons when input is invalid or loading. Prevents duplicate transactions and improves UX.
  // NOTE: Withdrawal form mirrors deposit form. Consistency helps users understand the UI quickly.
              // NOTE: Always validate withdrawal amounts to prevent overdrafts or errors.
              // NOTE: Use loadingText for clear feedback during async actions.
  // NOTE: The "Snail" feature is a playful take on peer-to-peer payments. Use clear branding and instructions for new features.
              // NOTE: Autocomplete suggestions improve usability. For production, fetch suggestions from a backend service.
              // NOTE: Always disable send buttons when required fields are missing or invalid.
              colorScheme="green"
              size="lg"
              onClick={handleDeposit}
              isLoading={depositLoading}
              loadingText="Processing..."
              isDisabled={!depositAmount || depositAmount <= 0}
              _hover={{}}
            >
              Deposit Money
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Withdrawal Form */}
      <Box p={6} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="red.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">-</Text>
            </Box>
            <Heading size="md" color="gray.800" className="brand-type">Withdraw Money</Heading>
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
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
                _focus={{ borderColor: "red.400", boxShadow: "0 0 0 1px rgba(248,113,113,0.4)" }}
              />
            </Box>
            
            <Button
              colorScheme="red"
              size="lg"
              onClick={handleWithdraw}
              isLoading={withdrawLoading}
              loadingText="Processing..."
              isDisabled={!withdrawAmount || withdrawAmount <= 0}
              _hover={{}}
            >
              Withdraw Money
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Snail (Send Money) Form */}
      <Box p={6} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="blue.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center" boxShadow="sm">
              <Text color="white" fontWeight="bold">🐌</Text>
            </Box>
            <Heading size="md" color="gray.800" className="brand-type">Snail</Heading>
            <Text fontSize="sm" color="gray.600" fontStyle="italic">Send money fast, like a snail</Text>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            <Box position="relative">
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Recipient (Username or Phone)
              </Text>
              <Input
                type="text"
                placeholder="Enter username or phone number"
                value={snailRecipient}
                onChange={(e) => handleUsernameChange(e.target.value)}
                size="lg"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px rgba(56,189,248,0.4)" }}
              />
              {/* Username Suggestions - Floating */}
              {usernameSuggestions.length > 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  right="0"
                  mt={1}
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  p={2}
                  zIndex={10}
                  boxShadow="md"
                  maxHeight="300px"
                  overflowY="hidden"
                >
                  <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>
                    Suggestions:
                  </Text>
                  <VStack spacing={1} align="stretch">
                    {usernameSuggestions.map((username, index) => (
                      <Box 
                        key={index}
                        p={2}
                        bg="gray.50"
                        borderRadius="sm"
                        border="1px solid"
                        borderColor="transparent"
                        _hover={{ bg: "blue.50", borderColor: "blue.200" }}
                        cursor="pointer"
                        onClick={() => {
                          setSnailRecipient(username)
                          setUsernameSuggestions([])
                        }}
                      >
                        <Text fontSize="sm" color="gray.800">{username}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
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
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                color="gray.800"
                _placeholder={{ color: "gray.400" }}
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px rgba(56,189,248,0.4)" }}
              />
            </Box>
            
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleSnail}
              isLoading={snailLoading}
              loadingText="Sending via Snail..."
              isDisabled={!snailRecipient || !snailAmount || snailAmount <= 0}
              _hover={{}}
            >
              Send via Snail 🐌
            </Button>
          </VStack>
          
          <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
            {/* NOTE: Use info boxes to educate users about new features. Keep copy concise and helpful. */}
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
// NOTE: Exporting the component as default is standard for single-component files. Use named exports for multiple components per file.
