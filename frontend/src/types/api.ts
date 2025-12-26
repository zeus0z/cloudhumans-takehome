export type MessageRole = 'USER' | 'AGENT';

export type Intent = 'answer' | 'clarification' | 'escalate';

export interface Message {
  role: MessageRole;
  content: string;
  intent?: Intent;
}

export interface ConversationCompletionRequest {
  helpDeskId: number;
  projectName: string;
  messages: Message[];
}

export interface SectionRetrieved {
  score: number;
  content: string;
  type?: string;
}

export interface ConversationCompletionResponse {
  messages: Message[];
  handOverToHumanNeeded: boolean;
  sectionsRetrieved: SectionRetrieved[];
}

export interface ApiError {
  message: string;
  status?: number;
}

