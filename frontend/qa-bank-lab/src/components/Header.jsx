import { Box, Container, Heading, HStack, Text } from "@chakra-ui/react"
import Logo from "./Logo"

function Header({ currentUser }) {
  return (
    <Box 
      bgGradient="linear(112deg, #0f0f0f, #1a1a1a)"
      boxShadow="0 10px 28px rgba(0,0,0,0.4)"
      borderBottom="1px solid rgba(255,255,255,0.06)"
    >
      <Container maxW="container.xl" py={4}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Logo size={28} />
            <Heading size="md" color="white">Bank of Quality</Heading>
          </HStack>
          <Text color="gray.300">Welcome, {currentUser.name}</Text>
        </HStack>
      </Container>
    </Box>
  )
}

export default Header
