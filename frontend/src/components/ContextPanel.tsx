import { Box, VStack, HStack, Text, Heading, Badge, Input, IconButton } from '@chakra-ui/react';
import type { SectionRetrieved } from '../types/api';
import ContextItem from './ContextItem';
import { FileText, Search, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

interface ContextPanelProps {
  sections: SectionRetrieved[];
  isOpen?: boolean;
}

export default function ContextPanel({ sections, isOpen = true }: ContextPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    
    const query = searchQuery.toLowerCase();
    return sections.filter(section => 
      section.content.toLowerCase().includes(query) ||
      (section.type && section.type.toLowerCase().includes(query))
    );
  }, [sections, searchQuery]);

  // Sort by score (highest first)
  const sortedSections = useMemo(() => {
    return [...filteredSections].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [filteredSections]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleToggleSection = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Reset expanded state when sections change (new search results)
  useEffect(() => {
    setExpandedIndex(null);
  }, [sections]);

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      as="section"
      aria-label="Retrieved context information"
      h="100%"
      bg="app.surface"
      border="1px solid"
      borderColor="app.border"
      borderRadius={{ base: 'lg', md: 'xl' }}
      overflow="hidden"
      boxShadow="shadow.lg"
      display="flex"
      flexDirection="column"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        opacity: 0.6,
      }}
    >
      <Box 
        px={{ base: 4, md: 5 }} 
        py={{ base: 3.5, md: 4 }} 
        borderBottom="1px solid" 
        borderColor="app.border"
        bg="app.surface"
        flexShrink={0}
      >
        <HStack justify="space-between" align="center" mb={3}>
          <HStack gap={2.5} align="center">
            <Box
              p={1.5}
              borderRadius="md"
              bg="rgba(59, 130, 246, 0.1)"
              border="1px solid"
              borderColor="rgba(59, 130, 246, 0.2)"
            >
              <FileText size={16} color="#60a5fa" strokeWidth={2.5} />
            </Box>
            <Heading 
              as="h2"
              size="sm" 
              color="app.text" 
              letterSpacing="-0.015em"
              fontWeight="semibold"
            >
              Retrieved Context
            </Heading>
          </HStack>
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
          >
            {sections.length}
          </Badge>
        </HStack>
        
        <Text fontSize="xs" color="app.text3" lineHeight="1.5" mb={3}>
          Sources used to answer your last question
        </Text>

        {sections.length > 0 && (
          <HStack gap={2} position="relative">
            <Box position="relative" flex={1}>
              <Search 
                size={14} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  pointerEvents: 'none',
                }} 
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search context..."
                size="sm"
                fontSize="xs"
                pl={9}
                pr={searchQuery ? 8 : 3}
                bg="app.surface2"
                border="1px solid"
                borderColor="app.border"
                borderRadius="lg"
                color="app.text"
                _placeholder={{ color: 'app.muted' }}
                _focus={{
                  borderColor: 'accent.blue',
                  boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.15)',
                  outline: 'none',
                }}
                _hover={{
                  borderColor: 'app.borderStrong',
                }}
              />
              {searchQuery && (
                <IconButton
                  aria-label="Clear search"
                  size="xs"
                  variant="ghost"
                  position="absolute"
                  right={1}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={handleClearSearch}
                  color="app.text3"
                  _hover={{ bg: 'app.surfaceHover', color: 'app.text' }}
                >
                  <X size={12} />
                </IconButton>
              )}
            </Box>
          </HStack>
        )}
      </Box>

      <Box 
        flex={1}
        overflowY="auto" 
        overflowX="hidden"
        px={{ base: 4, md: 5 }} 
        py={4}
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
        {sections.length === 0 ? (
          <Box
            textAlign="center"
            py={{ base: 12, md: 16 }}
            px={4}
            borderRadius="xl"
            bg="app.surface2"
            border="1px solid"
            borderColor="app.border"
          >
            <Box
              w={12}
              h={12}
              mx="auto"
              mb={4}
              borderRadius="full"
              bg="rgba(59, 130, 246, 0.1)"
              border="1px solid"
              borderColor="rgba(59, 130, 246, 0.2)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FileText size={20} color="#60a5fa" strokeWidth={2} />
            </Box>
            <Text fontSize="sm" color="app.text2" fontWeight="semibold" mb={2}>
              No context yet
            </Text>
            <Text fontSize="xs" color="app.muted" lineHeight="1.6" maxW="280px" mx="auto">
              Ask a question to see the retrieved IDS sections that powered the answer.
            </Text>
          </Box>
        ) : sortedSections.length === 0 ? (
          <Box
            textAlign="center"
            py={12}
            px={4}
            borderRadius="xl"
            bg="app.surface2"
            border="1px solid"
            borderColor="app.border"
          >
            <Text fontSize="sm" color="app.text2" fontWeight="semibold" mb={2}>
              No results found
            </Text>
            <Text fontSize="xs" color="app.muted" lineHeight="1.6">
              Try a different search term
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={3}>
            {sortedSections.map((section, index) => (
              <ContextItem 
                key={`${section.score}-${index}`} 
                section={section} 
                index={index}
                searchQuery={searchQuery}
                isExpanded={expandedIndex === index}
                onToggle={() => handleToggleSection(index)}
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
}

