import { Box, VStack, Text, HStack, Heading, Badge } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';
import type { Message, ApiError } from '../types/api';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import HandoverIndicator from './HandoverIndicator';
import ClarificationCounter from './ClarificationCounter';
import SampleQuestions from './SampleQuestions';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface ChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  error?: ApiError | null;
  handoverNeeded?: boolean;
  requestTime?: number | null;
  onRetry?: () => void;
}

export default function Chat({ 
  messages, 
  onSendMessage, 
  isLoading,
  error,
  handoverNeeded = false,
  requestTime,
  onRetry,
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatRequestTime = (ms: number | null | undefined): string => {
    if (!ms) return '';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <Box
      as="article"
      role="region"
      aria-label="Chat conversation"
      h="100%"
      display="flex"
      flexDirection="column"
      bg="app.surface"
      border="1px solid"
      borderColor="app.border"
      borderRadius={{ base: 'lg', md: 'xl' }}
      overflow="hidden"
      boxShadow="shadow.lg"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(227, 25, 55, 0.2), transparent)',
        opacity: 0.6,
      }}
    >
      <Box 
        as="header"
        px={{ base: 4, sm: 5, md: 6 }} 
        py={{ base: 3.5, md: 4 }} 
        borderBottom="1px solid" 
        borderColor="app.border"
        bg="app.surface"
        flexShrink={0}
      >
        <HStack justify="space-between" align="center" gap={3} flexWrap="wrap">
          <HStack gap={{ base: 2, md: 3 }} align="center">
            <Heading 
              as="h2"
              size="sm" 
              color="app.text" 
              letterSpacing="-0.015em"
              fontWeight="semibold"
            >
              Conversation
            </Heading>
            <Badge
              fontSize="xs"
              px={2.5}
              py={1}
              borderRadius="full"
              bg="app.surface2"
              border="1px solid"
              borderColor="app.border"
              color="app.text2"
              fontWeight="medium"
              textTransform="none"
              transition="all 0.2s"
              _hover={{
                bg: 'app.surfaceHover',
                borderColor: 'app.borderStrong',
              }}
            >
              RAG enabled
            </Badge>
          </HStack>

          <HStack gap={{ base: 2, md: 3 }} align="center" flexWrap="wrap">
            <ClarificationCounter messages={messages} />
            {requestTime ? (
              <Text 
                fontSize="xs" 
                color="app.text3"
                fontWeight="medium"
              >
                <Text as="span" color="app.muted">Response:</Text>{' '}
                {formatRequestTime(requestTime)}
              </Text>
            ) : (
              <HStack gap={1.5} align="center">
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg="success.500"
                  boxShadow="0 0 8px rgba(16, 185, 129, 0.4)"
                />
                <Text fontSize="xs" color="app.text3" fontWeight="medium">
                  Ready
                </Text>
              </HStack>
            )}
          </HStack>
        </HStack>
      </Box>

      <Box 
        ref={messagesContainerRef}
        flex="1" 
        overflowY="auto" 
        overflowX="hidden"
        px={{ base: 4, sm: 5, md: 6 }} 
        py={{ base: 4, md: 5 }} 
        bg="app.bg2"
        minH={0}
        css={{
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
          },
        }}
      >
        {(error || handoverNeeded) && (
          <Box mb={4}>
            {error && <ErrorMessage error={error} onRetry={onRetry} />}
            <HandoverIndicator isVisible={handoverNeeded} />
          </Box>
        )}

        {messages.length === 0 ? (
          <VStack align="stretch" gap={{ base: 4, md: 5 }} h="100%" justify="center">
            <Box
              p={{ base: 5, md: 7 }}
              borderRadius="xl"
              bg="app.surface"
              border="1px solid"
              borderColor="app.border"
              boxShadow="shadow.md"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(227, 25, 55, 0.3), transparent)',
              }}
            >
              <Heading 
                as="h3"
                size={{ base: 'sm', md: 'md' }} 
                color="app.text" 
                letterSpacing="-0.02em" 
                mb={3}
                fontWeight="semibold"
              >
                Tesla Support Assistant
              </Heading>
              <Text 
                color="app.text2" 
                fontSize="sm" 
                lineHeight="1.7"
                maxW="600px"
              >
                Ask a question and I will answer using only the retrieved IDS context.
                {' '}
                <Text as="span" color="app.text3">
                  On tablet/mobile, open "Context" to see what was retrieved.
                </Text>
              </Text>
            </Box>

            <SampleQuestions onSelectQuestion={onSendMessage} disabled={isLoading} />
          </VStack>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble 
                key={`${message.role}-${index}`} 
                message={message} 
                timestamp={formatTimestamp()} 
                requestTime={message.role === 'AGENT' && index === messages.length - 1 ? requestTime : null}
              />
            ))}
            {isLoading && <LoadingSpinner />}
            <div ref={messagesEndRef} aria-live="polite" aria-atomic="true" />
          </>
        )}
      </Box>

      <Box flexShrink={0}>
        <MessageInput 
          onSend={onSendMessage} 
          disabled={isLoading || handoverNeeded} 
          placeholder={handoverNeeded ? "Conversation escalated to human agent" : "Type your message…"} 
        />
      </Box>
    </Box>
  );
}
