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
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1000"
    >
      <Box
        bg="white"
        borderRadius="md"
        p={6}
        maxW="800px"
        maxH="80vh"
        w="90%"
        overflow="auto"
        shadow="xl"
      >
        {/* Header */}
        <HStack justify="space-between" mb={6}>
          <Text fontSize="xl" fontWeight="bold">All Transactions</Text>
          <Button onClick={onClose} size="sm" variant="outline">
            Close
          </Button>
        </HStack>

        {/* Transactions List */}
        <VStack spacing={3} align="stretch" mb={6}>
          {currentTransactions.map((tx) => (
            <Box key={tx.tx_ID} p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium" textTransform="capitalize">
                    {tx.tx_type.toLowerCase()}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(tx.timestamp).toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontFamily="mono">
                    ID: {tx.tx_ID}
                  </Text>
                </VStack>
                <VStack align="end" spacing={1}>
                  <Text 
                    fontWeight="bold" 
                    fontSize="lg"
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
        <Text textAlign="center" fontSize="sm" color="gray.600" mt={4}>
          Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of {transactions.length} transactions
        </Text>
      </Box>
    </Box>
  )
}

export default TransactionsModal
