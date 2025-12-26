import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
    private client: OpenAI;

    constructor(private configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {
        this.client = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY')
        })
    }

    async getEmbedding(text: string): Promise<number[]> {
        const cacheKey = `embedding:${text}`

        const cached = await this.cacheManager.get<string>(cacheKey);

        if (cached){
            console.warn('Nice, we already had this cached!')
            return JSON.parse(cached) as number [];
        }

        const response = await this.client.embeddings.create({
            model: 'text-embedding-3-large',
            input: text
        })

        const embedding = response.data[0].embedding;

        await this.cacheManager.set(cacheKey, JSON.stringify(embedding))
        return embedding;


    }

    async getChatcompletion(
        systemPrompt: string,
        userMessage: string,
        retrievedContext: string
    ): Promise<{ content: string; intent: 'answer' | 'clarification' | 'escalate' }> {
        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system', content: systemPrompt
                },
                {
                    role: 'user',
                    content: `Context:\n${retrievedContext}\n\nQuestion: ${userMessage}`
                }
            ],
            response_format: { type: 'json_object' }
        })

        const parsed = JSON.parse(response.choices[0].message.content || '{}')
        return parsed;
    }

}
