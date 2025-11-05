import { useState } from "react"
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react"

function TransactionsModal({ isOpen, onClose, transactions }) {
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 10

  if (!isOpen) return null

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / transactionsPerPage)
  const startIndex = (currentPage - 1) * transactionsPerPage
  const endIndex = startIndex + transactionsPerPage
  const currentTransactions = transactions.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.6)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1000"
    >
      <Box
        bg="rgba(20,20,20,0.92)"
        borderRadius="xl"
        p={6}
        maxW="800px"
        maxH="80vh"
        w="90%"
        overflow="auto"
        boxShadow="0 18px 42px rgba(0,0,0,0.55)"
        border="1px solid rgba(255,255,255,0.06)"
      >
        {/* Header */}
        <HStack justify="space-between" mb={6}>
          <Text fontSize="xl" fontWeight="bold" color="white">All Transactions</Text>
          <Button 
            onClick={onClose} 
            size="sm" 
            variant="outline" 
            color="gray.200"
            borderColor="rgba(255,255,255,0.18)"
            _hover={{ bg: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.28)" }}
          >
            Close
          </Button>
        </HStack>

        {/* Transactions List */}
        <VStack spacing={3} align="stretch" mb={6}>
          {currentTransactions.map((tx) => (
            <Box key={tx.tx_ID} p={4} bg="rgba(255,255,255,0.04)" borderRadius="md" border="1px solid rgba(255,255,255,0.06)">
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium" textTransform="capitalize" color="white">
                    {tx.tx_type.toLowerCase()}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="gray.400" fontFamily="mono">
                    ID: {tx.tx_ID}
                  </Text>
                </VStack>
                <VStack align="end" spacing={1}>
                  <Text 
                    fontWeight="bold" 
                    fontSize="lg"
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
          ))}
        </VStack>

        {/* Pagination */}
        <HStack justify="center" spacing={2}>
          <Button 
            onClick={goToPrevious} 
            size="sm" 
            variant="outline"
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => goToPage(page)}
              size="sm"
              variant={page === currentPage ? "solid" : "outline"}
              colorScheme={page === currentPage ? "blue" : "gray"}
            >
              {page}
            </Button>
          ))}
          
          <Button 
            onClick={goToNext} 
            size="sm" 
            variant="outline"
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>

        {/* Page info */}
        <Text textAlign="center" fontSize="sm" color="gray.400" mt={4}>
          Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of {transactions.length} transactions
        </Text>
      </Box>
    </Box>
  )
}

export default TransactionsModal
