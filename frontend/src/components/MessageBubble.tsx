import { Box, Text, Flex, VStack, HStack, IconButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { Message } from '../types/api';
import { User, Bot, Copy, RotateCw, Clock } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  timestamp?: string;
  requestTime?: number | null;
}

const MotionBox = motion(Box);

export default function MessageBubble({ message, timestamp, requestTime }: MessageBubbleProps) {
  const isUser = message.role === 'USER';
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatRequestTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1],
      }}
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxW={{ base: '90%', sm: '85%', md: '75%', lg: '70%' }}
      mb={{ base: 4, md: 5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex
        direction={isUser ? 'row-reverse' : 'row'}
        align="flex-start"
        gap={{ base: 2.5, md: 3 }}
      >
        <Box
          w={{ base: 8, md: 9 }}
          h={{ base: 8, md: 9 }}
          borderRadius="full"
          bg={
            isUser 
              ? 'rgba(227, 25, 55, 0.14)' 
              : 'app.surface2'
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          border="1px solid"
          borderColor={
            isUser 
              ? 'rgba(227, 25, 55, 0.25)' 
              : 'app.border'
          }
          transition="all 0.2s"
          boxShadow={
            isUser 
              ? '0 0 0 0 rgba(227, 25, 55, 0)' 
              : '0 0 0 0 rgba(59, 130, 246, 0)'
          }
          _hover={{
            borderColor: isUser 
              ? 'rgba(227, 25, 55, 0.4)' 
              : 'app.borderStrong',
            boxShadow: isUser 
              ? '0 0 12px rgba(227, 25, 55, 0.2)' 
              : '0 0 12px rgba(59, 130, 246, 0.1)',
          }}
        >
          {isUser ? (
            <User size={16} color="#fecaca" strokeWidth={2.5} />
          ) : (
            <Bot size={16} color="#94a3b8" strokeWidth={2.5} />
          )}
        </Box>

        <VStack align={isUser ? 'flex-end' : 'flex-start'} gap={1.5} flex={1} minW={0}>
          <Box position="relative" w="100%">
            <Box
              bg={
                isUser 
                  ? 'rgba(227, 25, 55, 0.12)' 
                  : 'app.surface2'
              }
              color="app.text"
              px={{ base: 3.5, md: 4 }}
              py={{ base: 2.5, md: 3 }}
              borderRadius={{ base: 'lg', md: 'xl' }}
              border="1px solid"
              borderColor={
                isUser 
                  ? 'rgba(227, 25, 55, 0.25)' 
                  : 'app.border'
              }
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              position="relative"
              boxShadow="shadow.sm"
              _hover={{
                bg: isUser 
                  ? 'rgba(227, 25, 55, 0.16)' 
                  : 'app.surfaceHover',
                borderColor: isUser 
                  ? 'rgba(227, 25, 55, 0.35)' 
                  : 'app.borderStrong',
                boxShadow: 'shadow.md',
              }}
            >
              <Text 
                fontSize="sm" 
                whiteSpace="pre-wrap" 
                lineHeight="1.7" 
                color="app.text"
                wordBreak="break-word"
              >
                {message.content}
              </Text>
            </Box>

            <MotionBox
              initial={{ opacity: 0, y: -5 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : -5,
              }}
              transition={{ duration: 0.2 }}
              position="absolute"
              top={-2}
              right={isUser ? 'auto' : -2}
              left={isUser ? -2 : 'auto'}
              zIndex={10}
            >
              <HStack 
                gap={1} 
                bg="app.surface" 
                border="1px solid" 
                borderColor="app.border"
                borderRadius="md"
                p={1}
                boxShadow="shadow.md"
              >
                <IconButton
                  aria-label="Copy message"
                  title={copied ? "Copied!" : "Copy message"}
                  size="xs"
                  variant="ghost"
                  onClick={handleCopy}
                  color={copied ? "success.500" : "app.text3"}
                  _hover={{ bg: 'app.surfaceHover', color: 'app.text' }}
                >
                  <Copy size={14} />
                </IconButton>
                
                {!isUser && (
                  <IconButton
                    aria-label="Regenerate response"
                    title="Regenerate response"
                    size="xs"
                    variant="ghost"
                    color="app.text3"
                    _hover={{ bg: 'app.surfaceHover', color: 'app.text' }}
                  >
                    <RotateCw size={14} />
                  </IconButton>
                )}
              </HStack>
            </MotionBox>
          </Box>

          <HStack gap={2} align="center" px={2} flexWrap="wrap">
            {timestamp && (
              <Text 
                fontSize="xs" 
                color="app.muted" 
                fontWeight="medium"
              >
                {timestamp}
              </Text>
            )}
            {!isUser && requestTime && (
              <HStack gap={1.5} align="center">
                <Clock size={12} color="#64748b" strokeWidth={2.5} />
                <Text 
                  fontSize="xs" 
                  color="app.text3"
                  fontWeight="medium"
                >
                  {formatRequestTime(requestTime)}
                </Text>
              </HStack>
            )}
            {!isUser && message.intent && (
              <Text 
                fontSize="xs" 
                color="app.text3"
                px={2}
                py={0.5}
                bg="app.surface2"
                borderRadius="md"
                border="1px solid"
                borderColor="app.borderSubtle"
              >
                {message.intent}
              </Text>
            )}
          </HStack>
        </VStack>
      </Flex>
    </MotionBox>
  );
}
