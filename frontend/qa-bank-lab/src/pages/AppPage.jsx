import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Box, VStack, HStack, Text, Button, Heading, Container } from "@chakra-ui/react"
import Dashboard from "../components/Dashboard"
import Actions from "../components/Actions"
import ManageAccount from "../components/ManageAccount"
import { api } from "../services/api"

function AppPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [allTransactions, setAllTransactions] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  // Parse account info from URL on mount
  useEffect(() => {
    const accountId = searchParams.get('accountId')
    const name = searchParams.get('name')
    const balance = searchParams.get('balance')

    if (accountId && name && balance) {
      const account = {
        account_ID: accountId,
        name: decodeURIComponent(name),
        balance: parseFloat(balance)
      }
      setSelectedAccount(account)
      fetchTransactions(accountId)
    } else {
      // If no account info, redirect to login
      navigate('/')
    }
  }, [searchParams, navigate])

  // Fetch transactions for the logged-in user
  const fetchTransactions = async (accountId) => {
    try {
      setLoadingTransactions(true)
      const transactions = await api.getLedger(accountId)
      // Ensure transactions is an array
      const transactionArray = Array.isArray(transactions) ? transactions : []
      // Sort transactions by timestamp (newest first)
      const sortedTransactions = transactionArray.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp)
      })
      setAllTransactions(sortedTransactions)
      setRecentTransactions(sortedTransactions.slice(0, 3)) // Show only 3 recent ones
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setAllTransactions([])
      setRecentTransactions([])
    } finally {
      setLoadingTransactions(false)
    }
  }

  // Update account balance after transaction
  const updateAccountBalance = async (accountId) => {
    try {
      // Get updated account info from API
      const accounts = await api.getAllAccounts()
      const updatedAccount = accounts.find(acc => acc.account_ID === accountId)
      if (updatedAccount) {
        setSelectedAccount(updatedAccount)
      }
    } catch (error) {
      console.error('Error updating account balance:', error)
    }
  }

  // Refresh account data (balance and transactions)
  const refreshAccountData = async () => {
    if (selectedAccount) {
      await updateAccountBalance(selectedAccount.account_ID)
      await fetchTransactions(selectedAccount.account_ID)
    }
  }

  // Refresh data when tab changes (only for dashboard tab)
  useEffect(() => {
    if (selectedAccount && activeTab === "dashboard") {
      fetchTransactions(selectedAccount.account_ID)
    }
  }, [activeTab, selectedAccount])

  const handleLogout = () => {
    navigate('/')
  }

  if (!selectedAccount) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    )
  }


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
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Welcome Section */}
        <Box mb={8}>
          <Heading size="lg" color="gray.800" mb={2}>
            Welcome back, {selectedAccount.name}!
          </Heading>
          <Text color="gray.600">
            Current Balance: <Text as="span" fontWeight="bold" color="green.600">
              ${selectedAccount.balance.toLocaleString()}
            </Text>
          </Text>
        </Box>

        {/* Main Navigation Tabs */}
        <Box>
          {/* Tab Navigation */}
          <HStack spacing={1} mb={6} borderBottom="1px" borderColor="gray.200">
            <Button
              variant={activeTab === "dashboard" ? "solid" : "ghost"}
              colorScheme={activeTab === "dashboard" ? "blue" : "gray"}
              onClick={() => handleTabChange("dashboard")}
              borderRadius="md"
              borderBottomRadius={activeTab === "dashboard" ? "none" : "md"}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === "actions" ? "solid" : "ghost"}
              colorScheme={activeTab === "actions" ? "blue" : "gray"}
              onClick={() => handleTabChange("actions")}
              borderRadius="md"
              borderBottomRadius={activeTab === "actions" ? "none" : "md"}
            >
              Actions
            </Button>
            <Button
              variant={activeTab === "manage" ? "solid" : "ghost"}
              colorScheme={activeTab === "manage" ? "blue" : "gray"}
              onClick={() => handleTabChange("manage")}
              borderRadius="md"
              borderBottomRadius={activeTab === "manage" ? "none" : "md"}
            >
              Manage Account
            </Button>
          </HStack>

          {/* Tab Content */}
          {activeTab === "dashboard" && (
            <Box px={0} py={6}>
              <Dashboard 
                account={selectedAccount} 
                transactions={recentTransactions} 
                allTransactions={allTransactions}
              />
            </Box>
          )}
          
          {activeTab === "actions" && (
            <Box px={0} py={6}>
              <Actions account={selectedAccount} onTransactionSuccess={refreshAccountData} />
            </Box>
          )}
          
          {activeTab === "manage" && (
            <Box px={0} py={6}>
              <ManageAccount />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default AppPage
