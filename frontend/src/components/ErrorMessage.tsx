import { Button, Box, HStack, VStack, Text, Heading, Code } from '@chakra-ui/react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ApiError } from '../types/api';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

interface ErrorMessageProps {
  error: ApiError | null;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null;

  const isNetworkError = !error.status || error.status >= 500;
  const errorMessage = isNetworkError
    ? 'Unable to connect to the server. Please check your internet connection and try again.'
    : error.message || 'An error occurred while processing your request.';

  const getErrorTitle = () => {
    if (isNetworkError) return 'Connection Error';
    if (error.status === 400) return 'Bad Request';
    if (error.status === 401) return 'Unauthorized';
    if (error.status === 403) return 'Forbidden';
    if (error.status === 404) return 'Not Found';
    if (error.status === 429) return 'Too Many Requests';
    return 'Error';
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      mb={{ base: 4, md: 5 }}
    >
      <Box
        role="alert"
        aria-live="assertive"
        bg="rgba(239, 68, 68, 0.08)"
        border="1px solid"
        borderColor="rgba(239, 68, 68, 0.25)"
        borderRadius="xl"
        p={{ base: 4, md: 5 }}
        boxShadow="0 4px 12px rgba(239, 68, 68, 0.15)"
      >
        <VStack align="stretch" gap={4}>
          <HStack gap={3} align="flex-start">
            <Box
              p={2}
              borderRadius="lg"
              bg="rgba(239, 68, 68, 0.15)"
              border="1px solid"
              borderColor="rgba(239, 68, 68, 0.3)"
              flexShrink={0}
            >
              <AlertCircle size={20} color="#f87171" strokeWidth={2.5} />
            </Box>
            
            <Box flex="1">
              <HStack gap={2} mb={2} flexWrap="wrap">
                <Heading size="sm" fontWeight="semibold" color="app.text">
                  {getErrorTitle()}
                </Heading>
                {error.status && (
                  <Code
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                    bg="rgba(239, 68, 68, 0.15)"
                    color="#f87171"
                    border="1px solid"
                    borderColor="rgba(239, 68, 68, 0.3)"
                    fontWeight="semibold"
                  >
                    {error.status}
                  </Code>
                )}
              </HStack>
              
              <Text fontSize="sm" color="app.text2" lineHeight="1.7">
                {errorMessage}
              </Text>
            </Box>
          </HStack>
          
          {onRetry && (
            <MotionButton
              size="sm"
              variant="outline"
              borderColor="rgba(239, 68, 68, 0.35)"
              color="app.text"
              bg="rgba(239, 68, 68, 0.05)"
              onClick={onRetry}
              alignSelf="flex-start"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              _hover={{ 
                bg: 'rgba(239, 68, 68, 0.12)',
                borderColor: 'rgba(239, 68, 68, 0.45)',
              }}
              _active={{
                bg: 'rgba(239, 68, 68, 0.18)',
              }}
            >
              <HStack gap={2}>
                <RefreshCw size={16} />
                <Text fontWeight="medium">Retry</Text>
              </HStack>
            </MotionButton>
          )}
        </VStack>
      </Box>
    </MotionBox>
  );
}

