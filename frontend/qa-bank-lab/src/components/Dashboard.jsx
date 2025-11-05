import { useState } from "react"
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react"
import TransactionsModal from "./TransactionsModal"
import { api } from "../services/api"

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
        <Box p={6} bg="rgba(20,20,20,0.85)" borderRadius="xl" boxShadow="0 8px 22px rgba(0,0,0,0.35)" border="1px solid rgba(255,255,255,0.06)">
          <Text fontSize="lg" fontWeight="bold" mb={4} color="white" className="brand-type">Account Overview</Text>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium" color="gray.300">Account ID:</Text>
              <Text fontFamily="mono" color="gray.200">{account.account_ID}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium" color="gray.300">Account Name:</Text>
              <Text color="white">{account.name}</Text>
            </HStack>
            <Box h="1px" bg="gray.700" />
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="lg" color="white">Current Balance:</Text>
              <Text fontWeight="bold" fontSize="lg" color="green.300">
                ${account.balance.toLocaleString()}
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Recent Transactions */}
        <Box p={6} bg="rgba(20,20,20,0.85)" borderRadius="xl" boxShadow="0 8px 22px rgba(0,0,0,0.35)" border="1px solid rgba(255,255,255,0.06)">
          <HStack justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="bold" color="white" className="brand-type">Recent Transactions</Text>
            <Button 
              size="sm" 
              variant="outline" 
              color="gray.200"
              borderColor="rgba(255,255,255,0.18)"
              _hover={{ bg: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.28)" }}
              onClick={openModal}
            >
              See All Transactions
            </Button>
          </HStack>
          <VStack spacing={3} align="stretch">
            {!hasTransactions ? (
              <Box p={6} textAlign="center" bg="rgba(255,255,255,0.04)" borderRadius="md">
                <Text color="gray.400">No transactions yet</Text>
              </Box>
            ) : (
              transactions.map((tx) => (
              <Box key={tx.tx_ID} p={3} bg="rgba(255,255,255,0.04)" borderRadius="md" border="1px solid rgba(255,255,255,0.06)">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" textTransform="capitalize" color="white">
                      {tx.tx_type.toLowerCase()}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Text 
                      fontWeight="bold" 
                      color={tx.tx_type === "DEPOSIT" ? "green.300" : "red.400"}
                    >
                      {tx.tx_type === "DEPOSIT" ? "+" : "-"}${tx.amount}
                    </Text>
                    <Text fontSize="sm" color="gray.400" textTransform="capitalize">
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
