import { Box, Text, VStack, HStack, Badge, IconButton } from '@chakra-ui/react';
import type { SectionRetrieved } from '../types/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

const MotionBox = motion(Box);

interface ContextItemProps {
  section: SectionRetrieved;
  index: number;
  searchQuery?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ContextItem({ 
  section, 
  index, 
  searchQuery = '', 
  isExpanded, 
  onToggle 
}: ContextItemProps) {
  const [copied, setCopied] = useState(false);

  const scorePercentage = Math.round(section.score * 100);

  // Score-based color system
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      text: '#34d399',
      barBg: '#10b981',
    };
    if (score >= 0.5) return {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#fbbf24',
      barBg: '#f59e0b',
    };
    return {
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      text: '#f87171',
      barBg: '#ef4444',
    };
  };

  const scoreColors = getScoreColor(section.score);

  // Copy to clipboard
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(section.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Highlight search query
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <Text as="mark" key={i} bg="rgba(245, 158, 11, 0.3)" color="warning.200" px={0.5} borderRadius="sm">
          {part}
        </Text>
      ) : (
        part
      )
    );
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.25, 
        delay: index * 0.04,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <Box
        bg="app.surface2"
        borderRadius="lg"
        border="1px solid"
        borderColor="app.border"
        overflow="hidden"
        transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
        boxShadow="shadow.sm"
        _hover={{
          borderColor: 'app.borderStrong',
          bg: 'app.surfaceHover',
          boxShadow: 'shadow.md',
          transform: 'translateY(-1px)',
        }}
      >
        <HStack
          px={4}
          py={3}
          justify="space-between"
          align="center"
          cursor="pointer"
          onClick={onToggle}
          role="button"
          aria-expanded={isExpanded}
          transition="all 0.2s"
          _hover={{ bg: 'rgba(255, 255, 255, 0.02)' }}
        >
          <HStack gap={3} flex={1} minW={0}>
            {section.type && (
              <Badge
                fontSize="xs"
                px={2.5}
                py={1}
                borderRadius="md"
                bg={section.type === 'N2' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)'}
                color={section.type === 'N2' ? '#fca5a5' : '#6ee7b7'}
                border="1px solid"
                borderColor={section.type === 'N2' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}
                fontWeight="semibold"
                textTransform="uppercase"
              >
                {section.type}
              </Badge>
            )}
            <Text fontSize="xs" fontWeight="medium" color="app.text2">
              Section {index + 1}
            </Text>
          </HStack>

          <HStack gap={2}>
            <Badge
              fontSize="xs"
              px={2.5}
              py={1}
              borderRadius="md"
              bg={scoreColors.bg}
              color={scoreColors.text}
              border="1px solid"
              borderColor={scoreColors.border}
              fontWeight="semibold"
              minW="50px"
              textAlign="center"
            >
              {scorePercentage}%
            </Badge>
            <IconButton
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              size="xs"
              variant="ghost"
              color="app.text2"
              _hover={{ color: 'app.text', bg: 'transparent' }}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </IconButton>
          </HStack>
        </HStack>

        <Box
          w="100%"
          h="3px"
          bg="rgba(255, 255, 255, 0.05)"
          overflow="hidden"
        >
          <Box
            h="100%"
            bg={scoreColors.barBg}
            w={`${scorePercentage}%`}
            transition="width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          />
        </Box>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <VStack align="stretch" px={4} py={4} gap={3}>
                <Box
                  p={4}
                  bg="app.bg2"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="app.borderSubtle"
                  maxH="250px"
                  overflowY="auto"
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                    },
                  }}
                >
                  <Text fontSize="sm" color="app.text" lineHeight="1.7" whiteSpace="pre-wrap">
                    {highlightText(section.content, searchQuery)}
                  </Text>
                </Box>

                <HStack justify="space-between" align="center">
                  <Text fontSize="xs" color="app.muted">
                    Score: {section.score.toFixed(4)}
                  </Text>
                  <IconButton
                    aria-label="Copy content"
                    title={copied ? "Copied!" : "Copy content"}
                    size="sm"
                    variant="outline"
                    borderColor="app.border"
                    color={copied ? "success.500" : "app.text2"}
                    onClick={handleCopy}
                    _hover={{ 
                      bg: 'app.surfaceHover', 
                      color: copied ? "success.500" : 'app.text',
                      borderColor: 'app.borderStrong',
                    }}
                  >
                    <HStack gap={2}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <Text fontSize="xs">{copied ? 'Copied!' : 'Copy'}</Text>
                    </HStack>
                  </IconButton>
                </HStack>
              </VStack>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </MotionBox>
  );
}

