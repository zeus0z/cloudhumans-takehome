import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, sidebar, showSidebar = true }: LayoutProps) {
  return (
    <Box
      as="main"
      role="main"
      aria-label="Main content area"
      h="calc(100vh - 73px)"
      overflow="hidden"
      minH={0}
      position="relative"
      bg="app.bg"
      backgroundImage="radial-gradient(ellipse 1400px 700px at 25% 0%, rgba(227, 25, 55, 0.06), transparent 60%), radial-gradient(ellipse 1000px 600px at 85% 15%, rgba(59, 130, 246, 0.05), transparent 55%)"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.4,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.015) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      <Box
        h="100%"
        minH={0}
        maxW={{ base: '100%', lg: '1200px', xl: '1440px', '2xl': '1600px' }}
        mx="auto"
        px={{ base: 3, sm: 4, md: 6, lg: 8 }}
        py={{ base: 3, sm: 4, md: 5, lg: 6 }}
        position="relative"
      zIndex="base"
    >
      <Box
          h="100%"
          minH={0}
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            lg: showSidebar && sidebar ? '1fr 400px' : '1fr',
            xl: showSidebar && sidebar ? '1fr 440px' : '1fr',
          }}
          gap={{ base: 3, sm: 4, md: 5, lg: 6 }}
        alignItems="stretch"
      >
        <Box
            as="section"
            aria-label="Chat interface"
            minW={0}
            h="100%"
            minH={0}
            position="relative"
          >
          {children}
        </Box>

        {showSidebar && sidebar && (
            <Box
              as="aside"
              aria-label="Context information panel"
              display={{ base: 'none', lg: 'block' }}
              h="100%"
              minH={0}
              minW={0}
              position="relative"
            >
              {sidebar}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

