import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Box, VStack, HStack, Text, Button, Heading, Container } from "@chakra-ui/react"
import Logo from "../components/Logo"
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
  const [activeTab, setActiveTab] = useState("dashboard")

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const accountId = searchParams.get('accountId')
    if (accountId) {
      fetchAccount(accountId)
    } else {
      // If no account info, redirect to login
      navigate('/')
    }
  }, [searchParams, navigate])

  // Fetch transactions for the logged-in user
  const fetchTransactions = async (accountId) => {
    try {
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
      // Note to self: this is where you want to set some state to indicate that transactions are succesfully loaded. This will be useful for showing an intermediary state visually if loading takes some time.
    }
  }

  // fetch account
  const fetchAccount = async (accountId) => {
    const account = await api.getAccount(accountId)
    setSelectedAccount(account)
    return account
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
      <Box minH="100vh" bg="transparent" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    )
  }


  return (
    <Box minH="100vh" bg="gray.50">
      {/* Floating Header with app-wide gradient */}
      <Box 
        bg="white"
        boxShadow="sm"
        borderBottom="1px"
        borderColor="gray.200"
      >
        <Container maxW="container.xl" py={4}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Logo size={40} />
              <Heading size="md" color="gray.800" className="brand-type">Bank of Quality</Heading>
            </HStack>
            <HStack spacing={2}>
              <Button 
                onClick={() => navigate('/admin')} 
                variant="outline"
                size="sm"
                colorScheme="red"
              >
                Admin Panel
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm" 
                colorScheme="gray"
              >
                Logout
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Welcome Section */}
        <Box mb={8}>
          <Heading size="lg" color="gray.800" mb={2} className="brand-type">
            Welcome back, {selectedAccount.name}!
          </Heading>
          <Text color="gray.700" style={{ fontFeatureSettings: '"tnum" on, "lnum" on' }}>
            Current Balance: <Text as="span" fontWeight="bold" color="green.600">
              ${ selectedAccount.balance?.toLocaleString()}
            </Text>
          </Text>
        </Box>

        {/* Main Navigation Tabs + Glass Folder Card */}
        <Box>
          {/* Tab Navigation */}
          <HStack spacing={2} mb={0} px={{ base: 4, md: 6, lg: 8 }}>
            <Button
              variant={activeTab === "dashboard" ? "solid" : "outline"}
              colorScheme="blue"
              color={activeTab === "dashboard" ? "white" : "black"}
              onClick={() => handleTabChange("dashboard")}
              borderRadius="md"
              borderTopRadius="lg"
              borderBottomRadius="0"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2 }}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === "actions" ? "solid" : "outline"}
              colorScheme="blue"
              color={activeTab === "actions" ? "white" : "black"}
              onClick={() => handleTabChange("actions")}
              borderRadius="md"
              borderTopRadius="lg"
              borderBottomRadius="0"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2 }}
            >
              Actions
            </Button>
            <Button
              variant={activeTab === "manage" ? "solid" : "outline"}
              colorScheme="blue"
              color={activeTab === "manage" ? "white" : "black"}
              onClick={() => handleTabChange("manage")}
              borderRadius="md"
              borderTopRadius="lg"
              borderBottomRadius="0"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2 }}
            >
              Manage Account
            </Button>
          </HStack>

          {/* Content container behind tabs */}
          <Box 
            mt={-1}
            borderRadius="xl"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            overflow="hidden"
            position="relative"
            px={{ base: 4, md: 6, lg: 8 }}
            py={{ base: 4, md: 6 }}
            mx={0}
          >
            {/* Tab Content */}
            {activeTab === "dashboard" && (
              <Box>
                <Dashboard 
                  account={selectedAccount} 
                  transactions={recentTransactions} 
                  allTransactions={allTransactions}
                />
              </Box>
            )}
            {activeTab === "actions" && (
              <Box>
                <Actions account={selectedAccount} onTransactionSuccess={refreshAccountData} />
              </Box>
            )}
            {activeTab === "manage" && (
              <Box>
                <ManageAccount />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AppPage
