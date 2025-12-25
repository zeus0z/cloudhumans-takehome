import { Test, TestingModule } from '@nestjs/testing';
import { AzureSearchService } from './azure-search.service';

describe('AzureSearchService', () => {
  let service: AzureSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureSearchService],
    }).compile();

    service = module.get<AzureSearchService>(AzureSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
