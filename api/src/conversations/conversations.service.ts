import { Injectable } from '@nestjs/common';
import { ConversationCompletionDto } from './dto/conversation-completion.dto';
import { OpenaiService } from 'src/openai/openai.service';
import { AzureSearchService } from 'src/azure-search/azure-search.service';

@Injectable()
export class ConversationsService {

    constructor(
        private openAiService: OpenaiService,
        private azureSearchService: AzureSearchService
    ) { }


    async createCompletion(dto: ConversationCompletionDto) {


        const lastUserMessage = dto.messages.filter(m => m.role === 'USER').at(-1);
        if (!lastUserMessage) {
            throw new Error('No user message found')
        }

        const embedding = await this.openAiService.getEmbedding(lastUserMessage.content);

        const retrievedDocs = await this.azureSearchService.searchbyVector(
            dto.projectName,
            embedding,
            3
        )

        const context = retrievedDocs.map((doc, i) => `[${i + 1}] ${doc.content}`).join('\n\n')

        const clarificationCount = dto.messages.filter(
            m => m.role === 'AGENT' && m.intent === 'clarification'
        ).length;

        const systemPrompt = `
        You are Claudia, a Tesla support assistant.
Answer ONLY using the provded context.

Return your response as JSON with this exact structure:
{
  "content": "your message here",
  "intent": "answer" | "clarification" | "escalate"
}

Follow those rules:
- Use "answer" when you can answer the question confidently from the context
- Use "clarification" when you need more information from the user
- Use "escalate" when you cannot help and need human assistance
${clarificationCount >= 2 ? 'IMPORTANT: You have already asked for clarification twice. You MUST use "escalate" now if you still cannot answer.' : ''}

Be friendly, concise, and use emojis occasionally 😊`;

        const agentResponseFromOpenAi = await this.openAiService.getChatcompletion(
            systemPrompt,
            lastUserMessage.content,
            context
        )

        let finalResponse = agentResponseFromOpenAi;

        if (clarificationCount >= 2 && agentResponseFromOpenAi.intent === 'clarification') {
            finalResponse = {
                content: "I've asked for clarification twice, but I still need more information. Let me transsfer you to a specialist who can better assist you",
                intent: 'escalate'
            }
        }

        const needsHandover = finalResponse.intent === 'escalate';



        return {
            messages: [
                ...dto.messages
                ,
                {
                    role: 'AGENT',
                    content: finalResponse.content,
                    intent: finalResponse.intent
                }
            ],
            handOverToHumanNeeded: needsHandover,
            sectionsRetrieved: retrievedDocs.map(doc => ({
                score: doc['@search.score'],
                content: doc.content,
                type: doc.type
            }))
        }
    }
}
