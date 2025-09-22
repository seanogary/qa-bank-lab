import { Box, Container, Heading, HStack, Text } from "@chakra-ui/react"

function Header({ currentUser }) {
  return (
    <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
      <Container maxW="container.xl" py={4}>
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Box w={8} h={8} bg="blue.500" borderRadius="md" />
            <Heading size="md" color="gray.800">Bank of Quality</Heading>
          </HStack>
          <Text color="gray.600">Welcome, {currentUser.name}</Text>
        </HStack>
      </Container>
    </Box>
  )
}

export default Header
