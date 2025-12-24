import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
    private client: OpenAI;

    constructor(private configService: ConfigService) {
        this.client = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY')
        })
    }

    async getEmbedding(text: string): Promise<number[]> {
        const response = await this.client.embeddings.create({
            model: 'text-embedding-3-large',
            input: text
        })

        return response.data[0].embedding;

    }

    async getChatcompletion(
        systemPrompt: string,
        userMessage: string,
        retrievedContext: string
    ): Promise<string> {
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
            ]
        })
        return response.choices[0].message.content || '';
    }

}
