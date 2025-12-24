import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { AzureSearchService } from 'src/azure-search/azure-search.service';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService, AzureSearchService, OpenaiService]
})
export class ConversationsModule {}
