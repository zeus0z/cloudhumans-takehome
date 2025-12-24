import { Body, Controller, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationCompletionDto } from './dto/conversation-completion.dto';

@Controller('conversations')
export class ConversationsController {

    constructor(private readonly conversationsService: ConversationsService) {}

    @Post('completions')
    createCompletion(@Body() body: ConversationCompletionDto) {
        return this.conversationsService.createCompletion(body);
    }
}
