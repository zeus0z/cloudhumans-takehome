import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationsModule } from './conversations/conversations.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { OpenaiService } from './openai/openai.service';
import { AzureSearchService } from './azure-search/azure-search.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConversationsModule,
    ConfigModule.forRoot({isGlobal: true}),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService)=> ({
        store: redisStore as any,
        url: config.get<string>('REDIS_URL') ?? 'redis://localhost:6379',
        ttl: 60*60*1000
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService, OpenaiService, AzureSearchService],
})
export class AppModule { }
