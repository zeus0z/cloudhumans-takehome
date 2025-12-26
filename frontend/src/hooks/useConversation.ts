import { useState, useCallback } from 'react';
import type { Message, ApiError, SectionRetrieved } from '../types/api';
import { apiService } from '../services/api';

interface UseConversationOptions {
  helpDeskId: number;
  projectName: string;
}

interface UseConversationReturn {
  messages: Message[];
  sectionsRetrieved: SectionRetrieved[];
  isLoading: boolean;
  error: ApiError | null;
  requestTime: number | null;
  sendMessage: (content: string) => Promise<void>;
  resetConversation: () => void;
  updateConfig: (options: Partial<UseConversationOptions>) => void;
}

export function useConversation(
  initialOptions: UseConversationOptions
): UseConversationReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sectionsRetrieved, setSectionsRetrieved] = useState<SectionRetrieved[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [requestTime, setRequestTime] = useState<number | null>(null);
  const [options, setOptions] = useState<UseConversationOptions>(initialOptions);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Add user message immediately
      const userMessage: Message = {
        role: 'USER',
        content: content.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.createCompletion({
          helpDeskId: options.helpDeskId,
          projectName: options.projectName,
          messages: [...messages, userMessage],
        });

        // Extract request time if available
        if (response._requestTime) {
          setRequestTime(response._requestTime);
        }

        // Update messages with the full conversation from API
        setMessages(response.messages);
        // Update retrieved sections
        setSectionsRetrieved(response.sectionsRetrieved || []);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        
        // Extract request time from error if available
        if ((apiError as any)._requestTime) {
          setRequestTime((apiError as any)._requestTime);
        }

        // Remove the user message on error so they can retry
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, options]
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setSectionsRetrieved([]);
    setError(null);
    setRequestTime(null);
  }, []);

  const updateConfig = useCallback((newOptions: Partial<UseConversationOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  return {
    messages,
    sectionsRetrieved,
    isLoading,
    error,
    requestTime,
    sendMessage,
    resetConversation,
    updateConfig,
  };
}

