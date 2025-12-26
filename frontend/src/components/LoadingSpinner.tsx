import { Box, HStack, Text, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const MotionBox = motion(Box);

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Thinking...' }: LoadingSpinnerProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      alignSelf="flex-start"
      maxW={{ base: '90%', sm: '85%', md: '75%', lg: '70%' }}
      mb={{ base: 4, md: 5 }}
    >
      <HStack gap={{ base: 2.5, md: 3 }} align="flex-start">
        <Box
          w={{ base: 8, md: 9 }}
          h={{ base: 8, md: 9 }}
          borderRadius="full"
          bg="app.surface2"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          border="1px solid"
          borderColor="app.border"
          boxShadow="0 0 12px rgba(59, 130, 246, 0.1)"
          animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        >
          <Bot size={16} color="#94a3b8" strokeWidth={2.5} />
        </Box>
        
        <Box
          bg="app.surface2"
          px={{ base: 3.5, md: 4 }}
          py={{ base: 2.5, md: 3 }}
          borderRadius={{ base: 'lg', md: 'xl' }}
          border="1px solid"
          borderColor="app.border"
          boxShadow="shadow.sm"
          position="relative"
        >
          <HStack gap={2.5}>
            <Spinner 
              size="sm" 
              color="accent.blue"
            />
            <Text fontSize="sm" color="app.text2" fontWeight="medium">
              {message}
            </Text>
          </HStack>
          
          <HStack gap={1} mt={2}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                w={1.5}
                h={1.5}
                borderRadius="full"
                bg="app.text3"
                css={{
                  animation: `typing 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </HStack>
        </Box>
      </HStack>
    </MotionBox>
  );
}

