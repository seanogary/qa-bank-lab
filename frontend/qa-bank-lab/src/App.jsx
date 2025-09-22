import { Box, Container, Text, HStack, Heading, TabsRoot, TabsList, TabsContent, TabsTrigger } from "@chakra-ui/react"
import Dashboard from "./components/Dashboard"
import Actions from "./components/Actions"
import ManageAccount from "./components/ManageAccount"

function App() {
  // Mock data for testing
  const mockAccount = {
    account_ID: "acc-123",
    name: "Demo User",
    balance: 1500
  }

  // Generate more mock transactions for pagination testing
  const generateMockTransactions = () => {
    const transactions = []
    const types = ["DEPOSIT", "WITHDRAWAL", "TRANSFER"]
    const statuses = ["SUCCESS", "SUCCESS", "SUCCESS", "FAILURE"] // Mostly success
    
    for (let i = 1; i <= 25; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const amount = Math.floor(Math.random() * 1000) + 50
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      transactions.push({
        tx_ID: `tx-${i}`,
        amount: amount,
        tx_type: type,
        timestamp: date.toISOString(),
        status: status
      })
    }
    
    return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const allTransactions = generateMockTransactions()
  const recentTransactions = allTransactions.slice(0, 3) // Show only 3 recent ones

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Simple Header */}
      <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
        <Container maxW="container.xl" py={4}>
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Box w={8} h={8} bg="blue.500" borderRadius="md" />
              <Heading size="md" color="gray.800">Bank of Quality</Heading>
            </HStack>
            <Text color="gray.600">Welcome, Demo User</Text>
          </HStack>
        </Container>
      </Box>
      
      <Container maxW="container.xl" py={8}>
        <TabsRoot defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="manage">Manage Account</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" px={0} py={6}>
            <Dashboard 
              account={mockAccount} 
              transactions={recentTransactions} 
              allTransactions={allTransactions}
            />
          </TabsContent>
          
          <TabsContent value="actions" px={0} py={6}>
            <Actions />
          </TabsContent>
          
          <TabsContent value="manage" px={0} py={6}>
            <ManageAccount />
          </TabsContent>
        </TabsRoot>
      </Container>
    </Box>
  )
}

export default App
