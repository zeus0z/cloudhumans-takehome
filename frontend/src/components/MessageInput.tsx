import { Box, Textarea, IconButton, Flex, Text, HStack } from '@chakra-ui/react';
import { Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';

const MotionIconButton = motion(IconButton);

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({ 
  onSend, 
  disabled = false,
  placeholder = 'Type your message...'
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const maxLength = 2000;
  const charCount = message.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isOverLimit = charCount > maxLength;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled && !isOverLimit) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <Box
      as="footer"
      px={{ base: 4, sm: 5, md: 6 }}
      py={{ base: 4, md: 5 }}
      bg="app.surface"
      borderTop="1px solid"
      borderColor="app.border"
      position="relative"
    >
      <Flex 
        gap={3} 
        align="flex-end"
        position="relative"
      >
        <Box flex={1} position="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={1}
            resize="none"
            minH="48px"
            maxH="200px"
            borderRadius="xl"
            bg="app.surface2"
            border="2px solid"
            borderColor={
              isFocused 
                ? 'tesla.500' 
                : 'app.border'
            }
            fontSize="sm"
            px={4}
            py={3}
            color="app.text"
            transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
            _placeholder={{
              color: 'app.muted',
            }}
            _focus={{
              borderColor: 'tesla.500',
              boxShadow: isOverLimit 
                ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
                : '0 0 0 3px rgba(227, 25, 55, 0.15)',
              bg: 'app.surface2',
              outline: 'none',
            }}
            _hover={{
              borderColor: disabled ? 'app.border' : 'app.borderStrong',
            }}
            _disabled={{
              opacity: 0.6,
              cursor: 'not-allowed',
              bg: 'app.surface2',
            }}
            aria-label="Message input"
            aria-describedby="message-helper-text"
          />
        </Box>

        <MotionIconButton
          aria-label="Send message"
          onClick={handleSend}
          disabled={disabled || !message.trim() || isOverLimit}
          bg="tesla.500"
          color="white"
          borderRadius="xl"
          size="lg"
          w={12}
          h={12}
          flexShrink={0}
          whileHover={{ scale: disabled || !message.trim() ? 1 : 1.05 }}
          whileTap={{ scale: disabled || !message.trim() ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
          boxShadow={
            !disabled && message.trim() && !isOverLimit
              ? '0 4px 12px rgba(227, 25, 55, 0.3)'
              : 'none'
          }
          _hover={{ 
            bg: disabled || !message.trim() ? 'tesla.500' : 'tesla.600',
          }}
          _active={{
            bg: 'tesla.700',
          }}
          _disabled={{ 
            opacity: 0.4, 
            cursor: 'not-allowed',
            boxShadow: 'none',
          }}
        >
          <Send size={18} />
        </MotionIconButton>
      </Flex>

      <HStack 
        justify="space-between" 
        mt={2.5} 
        px={1}
        fontSize="xs"
      >
        <Text 
          id="message-helper-text"
          color="app.muted"
        >
          <Text as="kbd" 
            px={1.5}
            py={0.5}
            bg="app.surface2"
            borderRadius="sm"
            fontSize="xs"
            fontFamily="mono"
            border="1px solid"
            borderColor="app.borderSubtle"
          >
            Enter
          </Text>
          {' '}to send, {' '}
          <Text as="kbd"
            px={1.5}
            py={0.5}
            bg="app.surface2"
            borderRadius="sm"
            fontSize="xs"
            fontFamily="mono"
            border="1px solid"
            borderColor="app.borderSubtle"
          >
            Shift+Enter
          </Text>
          {' '}for new line
        </Text>
        
        {charCount > 0 && (
          <Text 
            color={isOverLimit ? 'error.500' : isNearLimit ? 'warning.500' : 'app.muted'}
            fontWeight="medium"
            transition="color 0.2s"
          >
            {charCount} / {maxLength}
          </Text>
        )}
      </HStack>
    </Box>
  );
}

