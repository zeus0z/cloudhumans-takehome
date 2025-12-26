import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  IconButton,
  Text,
  Heading,
} from '@chakra-ui/react';
import { Settings, X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface ConfigPanelProps {
  helpDeskId: number;
  projectName: string;
  onConfigChange: (helpDeskId: number, projectName: string) => void;
}

export default function ConfigPanel({
  helpDeskId: initialHelpDeskId,
  projectName: initialProjectName,
  onConfigChange,
}: ConfigPanelProps) {
  const [helpDeskId, setHelpDeskId] = useState(initialHelpDeskId.toString());
  const [projectName, setProjectName] = useState(initialProjectName);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHelpDeskId(initialHelpDeskId.toString());
    setProjectName(initialProjectName);
  }, [initialHelpDeskId, initialProjectName]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSave = () => {
    const id = parseInt(helpDeskId, 10);
    if (!isNaN(id) && projectName.trim()) {
      onConfigChange(id, projectName.trim());
      setIsOpen(false);
    }
  };

  const isValid = !isNaN(parseInt(helpDeskId, 10)) && projectName.trim().length > 0;

  return (
    <>
      <IconButton
        aria-label="Open settings"
        title="Settings"
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        color="app.text2"
        _hover={{ bg: 'app.surfaceHover', color: 'app.text' }}
        _active={{ transform: 'scale(0.94)' }}
        transition="all 0.2s"
      >
        <Settings size={18} />
      </IconButton>

      {isOpen && (
        <>
          <MotionBox
            position="fixed"
            inset={0}
            bg="app.overlayStrong"
            zIndex="modal"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          />

          <MotionBox
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="app.surface"
            borderRadius="xl"
            boxShadow="shadow.xl"
            border="1px solid"
            borderColor="app.border"
            w={{ base: '90%', sm: '400px', md: '450px' }}
            maxW="500px"
            zIndex="modal"
            p={{ base: 5, md: 6 }}
            initial={{ opacity: 0, scale: 0.9, y: '-45%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-45%' }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <HStack justify="space-between" align="center" mb={5}>
              <HStack gap={2.5}>
                <Box
                  p={1.5}
                  borderRadius="md"
                  bg="rgba(227, 25, 55, 0.1)"
                  border="1px solid"
                  borderColor="rgba(227, 25, 55, 0.2)"
                >
                  <Settings size={16} color="#fb7185" strokeWidth={2.5} />
                </Box>
                <Heading size="sm" color="app.text" letterSpacing="-0.015em" fontWeight="semibold">
                  Configuration
                </Heading>
              </HStack>
              <IconButton
                aria-label="Close settings"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                color="app.text2"
                _hover={{ bg: 'app.surfaceHover', color: 'app.text' }}
              >
                <X size={18} />
              </IconButton>
            </HStack>

            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="app.text2">
                  Help Desk ID
                </Text>
                <Input
                  type="number"
                  value={helpDeskId}
                  onChange={(e) => setHelpDeskId(e.target.value)}
                  placeholder="123456"
                  bg="app.surface2"
                  border="1px solid"
                  borderColor="app.border"
                  borderRadius="lg"
                  color="app.text"
                  fontSize="sm"
                  _placeholder={{ color: 'app.muted' }}
                  _focus={{
                    borderColor: 'tesla.500',
                    boxShadow: '0 0 0 3px rgba(227, 25, 55, 0.15)',
                    outline: 'none',
                  }}
                  _hover={{
                    borderColor: 'app.borderStrong',
                  }}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="app.text2">
                  Project Name
                </Text>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="tesla_motors"
                  bg="app.surface2"
                  border="1px solid"
                  borderColor="app.border"
                  borderRadius="lg"
                  color="app.text"
                  fontSize="sm"
                  _placeholder={{ color: 'app.muted' }}
                  _focus={{
                    borderColor: 'tesla.500',
                    boxShadow: '0 0 0 3px rgba(227, 25, 55, 0.15)',
                    outline: 'none',
                  }}
                  _hover={{
                    borderColor: 'app.borderStrong',
                  }}
                />
              </Box>

              <HStack gap={3} justify="flex-end" mt={4}>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  color="app.text2"
                  borderColor="app.border"
                  size="md"
                  _hover={{
                    bg: 'app.surfaceHover',
                    color: 'app.text',
                    borderColor: 'app.borderStrong',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  bg="tesla.500"
                  color="white"
                  size="md"
                  onClick={handleSave}
                  disabled={!isValid}
                  _hover={{ bg: 'tesla.600' }}
                  _active={{ bg: 'tesla.700' }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  }}
                >
                  <HStack gap={2}>
                    <Save size={16} />
                    <Text>Save Changes</Text>
                  </HStack>
                </Button>
              </HStack>
            </VStack>
          </MotionBox>
        </>
      )}
    </>
  );
}

