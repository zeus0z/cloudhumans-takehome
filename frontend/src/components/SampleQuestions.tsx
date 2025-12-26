import { Box, VStack, HStack, Text, Button, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

interface SampleQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const sampleQuestions = [
  'How long does a Tesla battery last before it needs to be replaced?',
  'What is Tesla\'s battery warranty?',
  'How do I charge my Tesla?',
  'What is the range of a Tesla Model 3?',
  'How do I schedule service for my Tesla?',
];

const MotionButton = motion(Button);

export default function SampleQuestions({ onSelectQuestion, disabled = false }: SampleQuestionsProps) {
  return (
    <Box
      p={{ base: 5, md: 6 }}
      bg="app.surface"
      border="1px solid"
      borderColor="app.border"
      borderRadius="xl"
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
      <VStack align="stretch" gap={{ base: 4, md: 5 }}>
        {/* Header */}
        <HStack gap={2.5} align="center">
          <Box
            p={1.5}
            borderRadius="md"
            bg="rgba(227, 25, 55, 0.1)"
            border="1px solid"
            borderColor="rgba(227, 25, 55, 0.2)"
          >
            <Sparkles size={16} color="#fb7185" strokeWidth={2.5} />
          </Box>
          <Text fontSize="sm" fontWeight="semibold" color="app.text" letterSpacing="-0.01em">
            Try asking:
          </Text>
          <Box
            ml="auto"
            px={2}
            py={0.5}
            bg="app.surface2"
            border="1px solid"
            borderColor="app.borderSubtle"
            borderRadius="md"
          >
            <HStack gap={1.5}>
              <Zap size={12} color="#fbbf24" />
              <Text fontSize="xs" color="app.text3" fontWeight="medium">
                Quick Start
              </Text>
            </HStack>
          </Box>
        </HStack>

        {/* Questions Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
          {sampleQuestions.map((question, index) => (
            <MotionButton
              key={index}
              size="md"
              variant="outline"
              bg="app.surface2"
              borderColor="app.border"
              color="app.text2"
              onClick={() => onSelectQuestion(question)}
              disabled={disabled}
              textAlign="left"
              whiteSpace="normal"
              height="auto"
              minH="60px"
              py={3.5}
              px={4}
              fontSize="sm"
              borderRadius="lg"
              fontWeight="normal"
              lineHeight="1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.06,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ 
                scale: disabled ? 1 : 1.02,
                y: disabled ? 0 : -2,
              }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              _hover={{ 
                borderColor: disabled ? 'app.border' : 'tesla.500', 
                bg: disabled ? 'app.surface2' : 'app.surfaceHover',
                boxShadow: disabled ? 'none' : 'shadow.md',
              }}
              _disabled={{ 
                opacity: 0.5, 
                cursor: 'not-allowed',
              }}
              _focus={{
                borderColor: 'tesla.500',
                boxShadow: '0 0 0 2px rgba(227, 25, 55, 0.15)',
              }}
            >
              {question}
            </MotionButton>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

