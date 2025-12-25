import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios'

@Injectable()
export class AzureSearchService {
    private endpoint: string;
    private apiKey: string;

    constructor(private configService: ConfigService) {
        this.endpoint = this.configService.getOrThrow<string>('AZURE_AI_SEARCH_ENDPOINT');
        this.apiKey = this.configService.getOrThrow<string>('AZURE_AI_SEARCH_KEY')
    }

    async searchbyVector(projectName: string, vector: number[], topK = 3) {
        const url = `${this.endpoint}/indexes/claudia-ids-index-large/docs/search?api-version=2023-11-01`;

        const response = await axios.post(
            url,
            {
                count: true,
                select: 'content, type',
                top: 10,
                filter: `projectName eq '${projectName}'`,
                vectorQueries: [
                    {
                        vector,
                        k: topK,
                        fields: 'embeddings',
                        kind: 'vector'
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': this.apiKey
                }
            }
        )

        return response.data.value;
    }
}
