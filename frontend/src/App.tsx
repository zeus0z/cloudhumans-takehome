import { Box, HStack, Heading, Text, Badge, Button, IconButton, useBreakpointValue } from '@chakra-ui/react';
import Layout from './components/Layout';
import Chat from './components/Chat';
import ContextPanel from './components/ContextPanel';
import ConfigPanel from './components/ConfigPanel';
import ContextDrawer from './components/ContextDrawer';
import { useConversation } from './hooks/useConversation';
import { useState } from 'react';
import { BookOpen, RotateCcw } from 'lucide-react';

function App() {
  const [config, setConfig] = useState({
    helpDeskId: 123456,
    projectName: 'tesla_motors',
  });
  const [isContextOpen, setIsContextOpen] = useState(false);

  const {
    messages,
    sectionsRetrieved,
    isLoading,
    error,
    requestTime,
    sendMessage,
    resetConversation,
    updateConfig,
  } = useConversation(config);

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages
        .filter((m) => m.role === 'USER')
        .pop();
      if (lastUserMessage) {
        sendMessage(lastUserMessage.content);
      }
    }
  };

  const handoverNeeded = messages.some(
    (msg) => msg.role === 'AGENT' && msg.intent === 'escalate'
  ) || (messages.length > 0 && messages[messages.length - 1]?.intent === 'escalate');

  const handleConfigChange = (helpDeskId: number, projectName: string) => {
    setConfig({ helpDeskId, projectName });
    updateConfig({ helpDeskId, projectName });
    resetConversation();
  };

  const showDesktopSidebar = useBreakpointValue({ base: false, lg: true }) ?? false;

  return (
    <Box minH="100vh" bg="app.bg" h="100vh" overflow="hidden">
      <Box 
        as="header"
        role="banner"
        position="sticky"
        top={0}
        zIndex="sticky"
        bg="app.glass"
        borderBottom="1px solid"
        borderColor="app.border"
        px={{ base: 3, sm: 4, md: 6, lg: 8 }}
        py={{ base: 3.5, md: 4 }}
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.3)"
      >
        <HStack justify="space-between" align="center" gap={{ base: 2, md: 3 }}>
          <HStack gap={{ base: 2, md: 3 }} minW={0} flex={1}>
            <Heading
              as="h1"
              size={{ base: 'sm', md: 'md' }}
              color="app.text"
              fontWeight="semibold"
              letterSpacing="-0.025em"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              Support Console
            </Heading>
            
            <Badge
              display={{ base: 'none', sm: 'inline-flex' }}
              px={{ base: 2, md: 2.5 }}
              py={1}
              borderRadius="full"
              bg="rgba(227, 25, 55, 0.14)"
              border="1px solid"
              borderColor="rgba(227, 25, 55, 0.3)"
              color="tesla.200"
              fontSize="xs"
              fontWeight="medium"
              textTransform="none"
              transition="all 0.2s"
              _hover={{
                bg: 'rgba(227, 25, 55, 0.18)',
                borderColor: 'rgba(227, 25, 55, 0.4)',
              }}
            >
              {config.projectName}
            </Badge>
            
            <Text 
              display={{ base: 'none', md: 'inline-block' }} 
              fontSize="sm" 
              color="app.text3"
              fontWeight="normal"
            >
              ID: {config.helpDeskId}
            </Text>
          </HStack>

          <HStack gap={{ base: 1.5, md: 2 }} flexShrink={0}>
            {!showDesktopSidebar && (
              <Button
                size="sm"
                variant="outline"
                borderColor="app.border"
                color="app.text2"
                bg="app.surface2"
                _hover={{ 
                  bg: 'app.surfaceHover',
                  borderColor: 'app.borderStrong',
                  color: 'app.text',
                }}
                _active={{
                  transform: 'scale(0.96)',
                }}
                onClick={() => setIsContextOpen(true)}
                aria-label="Open context panel"
                transition="all 0.2s"
              >
                <HStack gap={2}>
                  <BookOpen size={16} />
                  <Text fontSize="sm" display={{ base: 'none', sm: 'inline' }}>Context</Text>
                </HStack>
              </Button>
            )}

            <IconButton
              aria-label="Reset conversation"
              title="Reset conversation"
              variant="ghost"
              size="sm"
              onClick={resetConversation}
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
              <RotateCcw size={18} />
            </IconButton>


            {/* <ConfigPanel
              helpDeskId={config.helpDeskId}
              projectName={config.projectName}
              onConfigChange={handleConfigChange}
            /> */}
          </HStack>
        </HStack>
      </Box>

      <Layout sidebar={<ContextPanel sections={sectionsRetrieved} />} showSidebar={showDesktopSidebar}>
        <Chat
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          error={error}
          handoverNeeded={handoverNeeded}
          requestTime={requestTime}
          onRetry={handleRetry}
        />
      </Layout>

      {!showDesktopSidebar && (
        <ContextDrawer isOpen={isContextOpen} onClose={() => setIsContextOpen(false)}>
          <ContextPanel sections={sectionsRetrieved} />
        </ContextDrawer>
      )}
    </Box>
  );
}

export default App;
