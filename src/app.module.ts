import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationsModule } from './conversations/conversations.module';
import { ConfigModule } from '@nestjs/config'
import { OpenaiService } from './openai/openai.service';
import { AzureSearchService } from './azure-search/azure-search.service';

@Module({
  imports: [
    ConversationsModule,
    ConfigModule.forRoot({isGlobal: true})
  ],
  controllers: [AppController],
  providers: [AppService, OpenaiService, AzureSearchService],
})
export class AppModule { }
