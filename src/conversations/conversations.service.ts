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
        //to-do ver se eu fiz essa logica certinho

        const systemPrompt = `You are Claudia, a Tesla support assistant. 
        Answer ONLY using the provded context.
        If the context doesn't contain the answer,ask for clarification.
        BE friendly and concise. Use emojis occasionally.`

        const agentResponseFromOpenAi = await this.openAiService.getChatcompletion(
            systemPrompt,
            lastUserMessage.content,
            context
        )

        return {
            messages: [
                ...dto.messages
                ,
                {
                    role: 'AGENT',
                    content: agentResponseFromOpenAi
                }
            ],
            handOverToHumanNeeded: false,
            sectionsRetrieved: retrievedDocs.map(doc => ({
                score: doc['@search.score'],
                content: doc.content,
                type: doc.type
            }))
        }
    }
}
