import { Box, HStack, Heading, IconButton, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

const MotionBox = motion(Box);

interface ContextDrawerProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ContextDrawer({
  isOpen,
  title = 'Retrieved Context',
  onClose,
  children,
}: ContextDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <MotionBox
        position="fixed"
        inset={0}
        bg="app.overlayStrong"
        zIndex="overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />

      <MotionBox
        position="fixed"
        top={0}
        right={0}
        h="100vh"
        w={{ base: '92vw', sm: '440px', md: '480px' }}
        bg="app.surface"
        borderLeft="1px solid"
        borderColor="app.border"
        zIndex="modal"
        boxShadow="shadow.xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        display="flex"
        flexDirection="column"
      >
        <Box
          px={{ base: 4, md: 5 }}
          py={4}
          borderBottom="1px solid"
          borderColor="app.border"
          bg="app.surface"
          flexShrink={0}
        >
          <HStack justify="space-between" align="center">
            <HStack gap={2.5}>
              <Box
                p={1.5}
                borderRadius="md"
                bg="rgba(59, 130, 246, 0.1)"
                border="1px solid"
                borderColor="rgba(59, 130, 246, 0.2)"
              >
                <FileText size={16} color="#60a5fa" strokeWidth={2.5} />
              </Box>
              <Box>
                <Heading
                  size="sm"
                  color="app.text"
                  letterSpacing="-0.015em"
                  fontWeight="semibold"
                >
                  {title}
                </Heading>
                <Text fontSize="xs" color="app.text3" mt={0.5}>
                  RAG evidence for the last request
                </Text>
              </Box>
            </HStack>

            <IconButton
              aria-label="Close context drawer"
              variant="ghost"
              size="sm"
              onClick={onClose}
              color="app.text2"
              _hover={{
                bg: 'app.surfaceHover',
                color: 'app.text',
              }}
              _active={{
                transform: 'scale(0.94)',
              }}
              transition="all 0.2s"
            >
              <X size={18} />
            </IconButton>
          </HStack>
        </Box>

        <Box
          flex={1}
          overflowY="auto"
          overflowX="hidden"
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
          {children}
        </Box>
      </MotionBox>
    </>
  );
}


