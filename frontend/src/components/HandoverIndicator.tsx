import { Box, HStack, Text, Heading, Badge } from '@chakra-ui/react';
import { UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface HandoverIndicatorProps {
  isVisible: boolean;
}

export default function HandoverIndicator({ isVisible }: HandoverIndicatorProps) {
  if (!isVisible) return null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: -15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      mb={{ base: 4, md: 5 }}
    >
      <Box
        role="alert"
        aria-live="assertive"
        bg="rgba(245, 158, 11, 0.08)"
        border="1px solid"
        borderColor="rgba(245, 158, 11, 0.25)"
        borderRadius="xl"
        p={{ base: 4, md: 5 }}
        boxShadow="0 4px 12px rgba(245, 158, 11, 0.15)"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      >
        <HStack gap={3} align="flex-start">
          <Box
            p={2}
            borderRadius="lg"
            bg="rgba(245, 158, 11, 0.15)"
            border="1px solid"
            borderColor="rgba(245, 158, 11, 0.3)"
            flexShrink={0}
          >
            <UserCheck size={20} color="#fbbf24" strokeWidth={2.5} />
          </Box>
          
          <Box flex="1">
            <HStack gap={2} mb={2} flexWrap="wrap">
              <Heading size="sm" fontWeight="semibold" color="app.text">
                Human Specialist Required
              </Heading>
              <Badge
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
                bg="rgba(245, 158, 11, 0.15)"
                color="#fbbf24"
                border="1px solid"
                borderColor="rgba(245, 158, 11, 0.3)"
                fontWeight="semibold"
                textTransform="none"
              >
                Escalated
              </Badge>
            </HStack>
            
            <Text fontSize="sm" color="app.text2" lineHeight="1.7" mb={3}>
              This conversation requires human expertise and will be transferred to a specialist who can better assist you.
            </Text>
            
            <HStack gap={2} fontSize="xs" color="app.muted">
              <Text>AI Assistant</Text>
              <ArrowRight size={14} />
              <Text fontWeight="semibold" color="warning.500">Human Specialist</Text>
            </HStack>
          </Box>
        </HStack>
      </Box>
    </MotionBox>
  );
}

