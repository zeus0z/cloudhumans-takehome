import { Injectable } from '@nestjs/common';
import { ConversationCompletionDto } from './dto/conversation-completion.dto';

@Injectable()
export class ConversationsService {

    async createCompletion(dto: ConversationCompletionDto) {
        //to-do: embeddar a pergunta
        const lastUserMessage = dto.messages.at(-1);

        return {
            messages: [
                ...dto.messages
                ,
                {
                    role: 'AGENT',
                    content: `Stub response to: ${lastUserMessage?.content}`
                }
            ],
            handOverToHumanNeeded: false,
            sectionsRetrieved: []
        }
    }
}
