import { Badge, HStack, Text, Box } from '@chakra-ui/react';
import { HelpCircle } from 'lucide-react';
import type { Message } from '../types/api';

interface ClarificationCounterProps {
  messages: Message[];
}

export default function ClarificationCounter({ messages }: ClarificationCounterProps) {
  const clarificationCount = messages.filter(
    (msg) => msg.role === 'AGENT' && msg.intent === 'clarification'
  ).length;

  if (clarificationCount === 0) return null;

  const maxClarifications = 2;
  const isAtLimit = clarificationCount >= maxClarifications;
  const isNearLimit = clarificationCount === maxClarifications - 1;

  const getStatusColor = () => {
    if (isAtLimit) return {
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      text: '#f87171',
      icon: '#ef4444',
    };
    if (isNearLimit) return {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#fbbf24',
      icon: '#f59e0b',
    };
    return {
      bg: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.25)',
      text: '#60a5fa',
      icon: '#3b82f6',
    };
  };

  const colors = getStatusColor();

  const tooltipText = isAtLimit 
    ? 'Maximum clarifications reached. Next unclear question will escalate to human.'
    : isNearLimit
    ? 'One more clarification before escalation to human.'
    : 'Clarification requests made in this conversation.';

  return (
    <Box title={tooltipText}>
      <HStack 
        gap={2} 
        align="center"
        px={2.5}
        py={1}
        bg={colors.bg}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="md"
        transition="all 0.2s"
        cursor="help"
        _hover={{
          borderColor: colors.text,
        }}
      >
        <HelpCircle size={14} color={colors.icon} strokeWidth={2.5} />
        <Text fontSize="xs" color="app.text3" fontWeight="medium" display={{ base: 'none', sm: 'inline' }}>
          Clarifications:
        </Text>
        <Badge
          fontSize="xs"
          px={2}
          py={0.5}
          borderRadius="sm"
          bg={colors.bg}
          color={colors.text}
          border="1px solid"
          borderColor={colors.border}
          fontWeight="semibold"
        >
          {clarificationCount} / {maxClarifications}
        </Badge>
      </HStack>
    </Box>
  );
}

