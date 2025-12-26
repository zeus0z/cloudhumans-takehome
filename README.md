# Cloud Humans Take-Home (Backend + Frontend)

## Aviso importante

**Não usei IA para resolver o take-home** (backend/core do desafio). A implementação do endpoint RAG, das features principais e de todas as decisões técnicas (estrutura, tecnologias, responsividade, funcionalidades) foram feitas por mim.

Usei assistência de IA apenas para:
- Organização e escrita da documentação (este README).
- Aceleração no desenvolvimento da UI (frontend), mas mantendo controle total sobre todas as decisões de design, estrutura e funcionalidades.

**Por não ter usado IA para o take-home, todos os pontos ruins do código (bugs, más práticas, decisões questionáveis) são de minha responsabilidade, assim como todos os méritos (qualidade, boas decisões, implementações bem feitas).**

---

## O que é este projeto?

Este repositório implementa o endpoint do desafio Cloud Humans usando **RAG (Retrieval Augmented Generation)**:

- Gera embedding do texto do usuário (OpenAI).
- Faz busca vetorial no **Azure AI Search** (IDS já populado).
- Envia “contexto recuperado” + pergunta para o modelo (OpenAI) e obtém uma resposta **restrita ao contexto**.

Além do backend, também inclui um **frontend completo** para testar a API, visualizar o contexto recuperado (RAG) e medir o tempo de cada requisição.

---

## Estrutura do repositório

- `api/`: NestJS (backend)
- `frontend/`: React + Vite (interface de testes)
- `docker-compose.yml`: sobe backend + frontend + Redis

---

## Como rodar (recomendado: Docker)

### Pré-requisitos

- Docker + Docker Compose

### 1) Variáveis de ambiente

Crie um arquivo `.env` na raiz do repositório com:

- `OPENAI_API_KEY`
- `AZURE_AI_SEARCH_KEY`
- `AZURE_AI_SEARCH_ENDPOINT`

Obs.: `REDIS_URL` já é definido no `docker-compose.yml` como `redis://redis:6379`.

### 2) Subir tudo

```bash
docker-compose up --build
```

### 3) Acessos

- **Frontend**: `http://localhost:5173`
- **API**: `http://localhost:3000`

---

## Rodando localmente (sem Docker)

### Backend

```bash
cd api
pnpm install
pnpm start:dev
```

Você também vai precisar de um Redis local, ou então ajustar `REDIS_URL` para um Redis remoto.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Se necessário, defina `VITE_API_URL` apontando para a API (ex.: `http://localhost:3000`).

---

## Endpoint principal

### `POST /conversations/completions`

Exemplo de request:

```json
{
  "helpDeskId": 123456,
  "projectName": "tesla_motors",
  "messages": [
    { "role": "USER", "content": "How long does a Tesla battery last before it needs to be replaced?" }
  ]
}
```

Exemplo de response (resumido):

```json
{
  "messages": [
    { "role": "USER", "content": "..." },
    { "role": "AGENT", "content": "...", "intent": "answer" }
  ],
  "handOverToHumanNeeded": false,
  "sectionsRetrieved": [
    { "score": 0.60, "content": "...", "type": "N1" }
  ]
}
```

---

## Decisões técnicas principais

### RAG (Retrieval Augmented Generation)

- **Por que**: responder usando apenas o “Improved Data Set (IDS)” e evitar alucinações.
- **O que traz**: respostas fundamentadas em contexto recuperado + visibilidade do que foi usado (o frontend mostra isso).

### Feature escolhida: Clarification Feature

- **Regra**: quando não houver informação suficiente, o agente pode pedir esclarecimentos.
- **Limite**: até 2 clarificações por conversa; se precisar de uma terceira, deve escalar para humano (handover).

---

## Extras que eu adicionei (não exigidos, mas importantes)

### Redis caching (embeddings)

- **Por que eu adicionei**: embeddings são caros e repetitivos (mesmas perguntas aparecem muito em atendimento). Cache reduz custo e melhora latência.
- **O que traz**:
  - Menos chamadas ao provider de embeddings.
  - Respostas mais rápidas em perguntas repetidas.
  - Uma base simples para evoluir para estratégias como “cache por normalização de texto” e “cache por similaridade”.

Onde está:
- Cache configurado no NestJS em `api/src/app.module.ts` via `CacheModule` + Redis store.
- Uso do cache no fluxo de embeddings em `api/src/openai/openai.service.ts` (cache key por texto).

### Logging interceptor (métricas e observabilidade)

- **Por que eu adicionei**: para troubleshooting e performance, é essencial enxergar tempo de execução e rota chamada (especialmente em um sistema com IO externo: OpenAI + Azure Search).
- **O que traz**:
  - Logging estruturado por request (método, URL, duração).
  - Base para adicionar tracing/correlation-id no futuro.

Onde está:
- `api/src/common/logging.interceptor.ts`
- Registrado globalmente em `api/src/main.ts`.

### Exception filter (respostas de erro consistentes)

- **Por que eu adicionei**: manter respostas de erro padronizadas ajuda o frontend e facilita depuração.
- **O que traz**:
  - Payload de erro consistente (`statusCode`, `message`, `path`, `timestamp`).
  - Log estruturado do erro no servidor.

Onde está:
- `api/src/common/filters/all-exceptions.filter.ts`
- Registrado globalmente em `api/src/main.ts`.

### Frontend completo (UI de teste + observabilidade de RAG)

- **Por que eu adicionei**: uma UI acelera revisão do desafio, demonstra o fluxo RAG e reduz fricção para testes manuais (sem Postman).
- **O que traz**:
  - Interface estilo “chat” para simular conversa real.
  - Painel de contexto (RAG evidence) com score e tipo (`N1`/`N2`).
  - Indicadores de escalonamento/clarificação.
  - **Medição da duração da requisição** por chamada (útil para comparar “primeira vez” vs “cache hit”).

Onde está:
- `frontend/src/services/api.ts` (axios + interceptors para medir duração)
- `frontend/src/components/ContextPanel.tsx` / `ContextDrawer.tsx` (visualização do RAG)

---

## Como evoluir (ideias)

- **Guardrail IDS-only**: validar no backend se a resposta está suportada pelo contexto (ex.: exigir citação de trecho / id de seção).
- **Cache inteligente**: normalização do texto (trim/lower/remove punctuation) e TTL por tipo de conteúdo.
- **Observabilidade**: correlation-id, logs por request incluindo helpDeskId/projectName, exportação para APM.
- **Segurança**: rate limit, validação mais restrita de payload, e CORS por ambiente.

