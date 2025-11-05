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
      <Box minH="100vh" bg="transparent" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    )
  }


  return (
    <Box minH="100vh" bg="transparent">
      {/* Floating Header with app-wide gradient */}
      <Box 
        bgGradient="linear(45deg, #0a0a0a 0%, #000000 20%, #1a1a1a 40%, #000000 60%, #0f0f0f 80%, #000000 100%)"
        boxShadow="0 8px 24px rgba(0,0,0,0.35)"
      >
        <Container maxW="container.xl" py={4}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Logo size={40} />
              <Heading size="md" color="white" className="brand-type">Bank of Quality</Heading>
            </HStack>
            <HStack spacing={2}>
              <Button 
                onClick={() => navigate('/admin')} 
                variant="outline" 
                size="sm"
                color="red.300"
                borderColor="rgba(255,255,255,0.18)"
                _hover={{ bg: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.28)" }}
              >
                Admin Panel
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm" 
                color="gray.200"
                borderColor="rgba(255,255,255,0.18)"
                _hover={{ bg: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.28)" }}
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
          <Heading size="lg" color="white" mb={2} className="brand-type">
            Welcome back, {selectedAccount.name}!
          </Heading>
          <Text color="gray.300" style={{ fontFeatureSettings: '"tnum" on, "lnum" on' }}>
            Current Balance: <Text as="span" fontWeight="bold" color="green.300">
              ${selectedAccount.balance.toLocaleString()}
            </Text>
          </Text>
        </Box>

        {/* Main Navigation Tabs + Glass Folder Card */}
        <Box>
          {/* Tab Navigation */}
          <HStack spacing={2} mb={0} px={{ base: 4, md: 6, lg: 8 }}>
            <Button
              variant={activeTab === "dashboard" ? "solid" : "ghost"}
              colorScheme={activeTab === "dashboard" ? "blue" : undefined}
              color={activeTab === "dashboard" ? "white" : "gray.200"}
              _hover={activeTab === "dashboard" ? { bg: "blue.500" } : { bg: "rgba(255,255,255,0.04)" }}
              onClick={() => handleTabChange("dashboard")}
              borderRadius="md"
              borderTopRadius="lg"
              borderBottomRadius="0"
              border={activeTab === "dashboard" ? "1px solid rgba(255,255,255,0.12)" : "none"}
              bg={activeTab === "dashboard" ? "rgba(28,28,28,0.9)" : "transparent"}
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2 }}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === "actions" ? "solid" : "ghost"}
              colorScheme={activeTab === "actions" ? "blue" : undefined}
              color={activeTab === "actions" ? "white" : "gray.200"}
              _hover={activeTab === "actions" ? { bg: "blue.500" } : { bg: "rgba(255,255,255,0.04)" }}
              onClick={() => handleTabChange("actions")}
              borderRadius="md"
              borderTopRadius="lg"
              borderBottomRadius="0"
              border={activeTab === "actions" ? "1px solid rgba(255,255,255,0.12)" : "none"}
              bg={activeTab === "actions" ? "rgba(28,28,28,0.9)" : "transparent"}
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2 }}
            >
              Actions
            </Button>
            <Button
              variant={activeTab === "manage" ? "solid" : "ghost"}
              colorScheme={activeTab === "manage" ? "blue" : undefined}
              color={activeTab === "manage" ? "white" : "gray.200"}
              _hover={activeTab === "manage" ? { bg: "blue.500" } : { bg: "rgba(255,255,255,0.04)" }}
              onClick={() => handleTabChange("manage")}
              borderRadius="md"
              borderTopRadius="lg"
              borderBottomRadius="0"
              border={activeTab === "manage" ? "1px solid rgba(255,255,255,0.12)" : "none"}
              bg={activeTab === "manage" ? "rgba(28,28,28,0.9)" : "transparent"}
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2 }}
            >
              Manage Account
            </Button>
          </HStack>

          {/* Glass folder card behind tabs */}
          <Box 
            mt={-1}
            borderRadius="xl"
            bg="rgba(10,10,10,0.62)"
            backdropFilter="blur(10px)"
            border="none"
            boxShadow="0 16px 32px rgba(0,0,0,0.3)"
            overflow="hidden"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 18%, transparent 50%)",
              filter: "blur(10px)",
              borderRadius: "xl",
              zIndex: -1,
              pointerEvents: "none"
            }}
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
