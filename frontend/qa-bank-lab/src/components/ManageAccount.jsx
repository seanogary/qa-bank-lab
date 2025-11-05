import React, { useState } from 'react'
import { Box, VStack, HStack, Text, Button, Heading, Textarea } from "@chakra-ui/react"
import { api } from '../services/api.js'

function HundredDollarInput({ value, onChange, placeholder, name, min = 0, max = 50000 }) {
  const predefinedValues = [
    100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000
  ].filter(val => val >= min && val <= max)

  const handleChange = (e) => {
    onChange(e)  // Pass the original event directly to ensure proper state update
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      name={name}
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '16px',
        fontFamily: 'Inter, system-ui, sans-serif',
        cursor: 'pointer'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'rgba(56,189,248,0.4)';
        e.target.style.boxShadow = '0 0 0 1px rgba(56,189,248,0.4)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'rgba(255,255,255,0.08)';
        e.target.style.boxShadow = 'none';
      }}
    >
      <option value="" style={{ background: 'rgba(11,11,11,0.92)', color: 'white' }}>
        Select amount...
      </option>
      {predefinedValues.map((amount) => (
        <option key={amount} value={amount} style={{ background: 'rgba(11,11,11,0.92)', color: 'white' }}>
          ${amount.toLocaleString()}
        </option>
      ))}
    </select>
  )
}

function ManageAccount() {
  const [formData, setFormData] = useState({
    maxDeposit: '',
    maxWithdrawal: '',
    dailyWithdrawalLimit: '',
    overdraftLimit: '',
    justification: ''
  })
  

  const validateHundredDollarAmount = (value, fieldName) => {
    if (value && value.trim()) {
      const numValue = parseInt(value)
      if (isNaN(numValue) || numValue % 100 !== 0) {
        alert(`${fieldName} must be in multiples of $100`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.justification.trim()) {
      alert('Please provide a justification')
      return
    }
    
    // Validate all monetary amounts are multiples of $100
    if (!validateHundredDollarAmount(formData.maxDeposit, 'Maximum Deposit')) return
    if (!validateHundredDollarAmount(formData.maxWithdrawal, 'Maximum Withdrawal')) return
    if (!validateHundredDollarAmount(formData.dailyWithdrawalLimit, 'Daily Withdrawal Limit')) return
    if (!validateHundredDollarAmount(formData.overdraftLimit, 'Overdraft Limit')) return
    
    // Create policy request object
    const policyRequestData = {
      user_id: 'current-user-id', // In a real app, this would come from auth context
      policy_request: {
        max_deposit: formData.maxDeposit ? parseInt(formData.maxDeposit) : null,
        max_withdrawal: formData.maxWithdrawal ? parseInt(formData.maxWithdrawal) : null,
        daily_withdrawal_limit: formData.dailyWithdrawalLimit ? parseInt(formData.dailyWithdrawalLimit) : null,
        overdraft_limit: formData.overdraftLimit ? parseInt(formData.overdraftLimit) : null,
        justification: formData.justification
      }
    }
    
    try {
      const response = await api.createPolicyRequest(policyRequestData)
      console.log('Policy request submitted successfully:', response)
      alert('Request submitted successfully!')
      setFormData({
        maxDeposit: '',
        maxWithdrawal: '',
        dailyWithdrawalLimit: '',
        overdraftLimit: '',
        justification: ''
      })
    } catch (error) {
      console.error('Failed to submit policy request:', error)
      alert('Failed to submit request')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Policy Request Form */}
      <Box p={6} bg="rgba(16,16,16,0.62)" borderRadius="xl" boxShadow="0 18px 32px rgba(0,0,0,0.35)" border="1px solid rgba(255,255,255,0.08)" backdropFilter="blur(8px)">
        <VStack spacing={4} align="stretch">
          <HStack>
            <Box w={8} h={8} bg="blue.500" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold">📋</Text>
            </Box>
            <Heading size="md" color="white" className="brand-type">Policy Request Form</Heading>
          </HStack>

          <VStack spacing={4} align="stretch">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.300" mb={1}>
                    Maximum Deposit Amount
                  </Text>
                  <HundredDollarInput
                    value={formData.maxDeposit}
                    onChange={handleChange}
                    placeholder="Maximum Deposit"
                    name="maxDeposit"
                    min={100}
                    max={50000}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.300" mb={1}>
                    Maximum Withdrawal Amount
                  </Text>
                  <HundredDollarInput
                    value={formData.maxWithdrawal}
                    onChange={handleChange}
                    placeholder="Maximum Withdrawal"
                    name="maxWithdrawal"
                    min={100}
                    max={50000}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.300" mb={1}>
                    Daily Withdrawal Limit
                  </Text>
                  <HundredDollarInput
                    value={formData.dailyWithdrawalLimit}
                    onChange={handleChange}
                    placeholder="Daily Withdrawal Limit"
                    name="dailyWithdrawalLimit"
                    min={100}
                    max={100000}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.300" mb={1}>
                    Overdraft Limit
                  </Text>
                  <HundredDollarInput
                    value={formData.overdraftLimit}
                    onChange={handleChange}
                    placeholder="Overdraft Limit"
                    name="overdraftLimit"
                    min={100}
                    max={10000}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.300" mb={1}>
                    Justification
                  </Text>
                  <Textarea
                    name="justification"
                    value={formData.justification}
                    onChange={handleChange}
                    placeholder="Explain why you need these policy changes..."
                    rows={4}
                    size="lg"
                    bg="rgba(255,255,255,0.06)"
                    border="1px solid rgba(255,255,255,0.08)"
                    color="white"
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ borderColor: "rgba(56,189,248,0.4)", boxShadow: "0 0 0 1px rgba(56,189,248,0.4)" }}
                  />
                </Box>

                <Button
                  type="submit"
                  bgGradient="linear(135deg, #0284c7, #38bdf8)"
                  size="lg"
                  isDisabled={!formData.justification.trim()}
                  _hover={{ bgGradient: "linear(135deg, #38bdf8, #0284c7)" }}
                >
                  Submit Policy Request
                </Button>
              </VStack>
            </form>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  )
}

export default ManageAccount
