import { useState } from "react"
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react"
import TransactionsModal from "./TransactionsModal"

function Dashboard({ account, transactions, allTransactions }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Handle empty transactions state
  const hasTransactions = transactions && transactions.length > 0

  return (
    <>
      <VStack spacing={6} align="stretch">
        {/* Account Overview */}
        <Box p={6} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
          <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800" className="brand-type">Account Overview</Text>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium" color="gray.600">Account ID:</Text>
              <Text fontFamily="mono" color="gray.700">{account.account_ID}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium" color="gray.600">Account Name:</Text>
              <Text color="gray.800">{account.name}</Text>
            </HStack>
            <Box h="1px" bg="gray.200" />
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="lg" color="gray.800">Current Balance:</Text>
              <Text fontWeight="bold" fontSize="lg" color="green.600">
                ${account.balance?.toLocaleString()}
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Recent Transactions */}
        <Box p={6} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
          <HStack justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800" className="brand-type">Recent Transactions</Text>
            <Button 
              size="sm" 
              variant="outline"
              colorScheme="blue"
              onClick={openModal}
            >
              See All Transactions
            </Button>
          </HStack>
          <VStack spacing={3} align="stretch">
            {!hasTransactions ? (
              <Box p={6} textAlign="center" bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                <Text color="gray.600">No transactions yet</Text>
              </Box>
            ) : (
              transactions.map((tx) => (
              <Box key={tx.tx_ID} p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" textTransform="capitalize" color="gray.800">
                      {tx.tx_type.toLowerCase()}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Text 
                      fontWeight="bold" 
                      color={tx.tx_type === "DEPOSIT" ? "green.600" : "red.600"}
                    >
                      {tx.tx_type === "DEPOSIT" ? "+" : "-"}${tx.amount}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                      {tx.status.toLowerCase()}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))
            )}
          </VStack>
        </Box>
      </VStack>

      {/* Transactions Modal */}
      <TransactionsModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        transactions={allTransactions} 
      />
    </>
  )
}

export default Dashboard
