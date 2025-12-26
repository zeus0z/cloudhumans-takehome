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

Antes de começar, certifique-se de ter instalado:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)

Para verificar se estão instalados:

```bash
docker --version
docker compose version
```

### Passo 1: Clonar o repositório (se ainda não tiver)

```bash
git clone <url-do-repositorio>
cd cloudhumans-takehome
```

### Passo 2: Configurar variáveis de ambiente

1. Na raiz do repositório, crie um arquivo `.env`:

```bash
# No Windows (PowerShell)
New-Item -Path .env -ItemType File

# No Linux/Mac
touch .env
```

2. Abra o arquivo `.env` e adicione as seguintes variáveis:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-sua-chave-openai-aqui

# Azure AI Search Configuration
AZURE_AI_SEARCH_KEY=sua-chave-azure-search-aqui
AZURE_AI_SEARCH_ENDPOINT=https://claudia-db.search.windows.net

# Redis Configuration (já configurado no docker-compose.yml)
REDIS_URL=redis://redis:6379
```

**Importante**: 
- Substitua os valores de exemplo pelas suas credenciais reais.
- O `REDIS_URL` já está configurado no `docker-compose.yml` para comunicação entre containers, então você pode deixar como está ou omitir essa linha.
- **Frontend não precisa de `.env`**: O frontend já tem a URL da API configurada por padrão (`http://localhost:3000`). Só crie um `frontend/.env` se precisar usar uma porta diferente (variável: `VITE_API_URL`).

### Passo 3: Construir e iniciar os containers

Execute o comando abaixo na raiz do repositório:

```bash
docker-compose up --build
```

**O que acontece:**
- O Docker Compose constrói as imagens do backend e frontend (multi-stage builds).
- Inicia o container do Redis primeiro (com health check).
- Aguarda o Redis ficar saudável antes de iniciar o backend.
- Inicia o backend (NestJS) na porta 3000.
- Aguarda o backend ficar saudável antes de iniciar o frontend.
- Inicia o frontend (Nginx servindo React) na porta 5173.

**Primeira execução pode demorar alguns minutos** (download de imagens base, instalação de dependências, build).

### Passo 4: Verificar se está funcionando

1. **Verifique os logs**: você deve ver mensagens indicando que os serviços estão rodando:
   - Redis: `Ready to accept connections`
   - Backend: `Nest application successfully started`
   - Frontend: logs do Nginx (geralmente silenciosos)

2. **Acesse o frontend**: abra seu navegador em `http://localhost:5173`
   - Você deve ver a interface do chat.

3. **Teste a API diretamente** (opcional): faça uma requisição para `http://localhost:3000/conversations/completions` usando Postman, curl ou similar.

### Passo 5: Parar os containers

Para parar todos os serviços:

```bash
docker-compose down
```

Para parar e remover volumes (limpar dados do Redis):

```bash
docker-compose down -v
```

### Troubleshooting

- **Erro de porta em uso**: se as portas 3000 ou 5173 estiverem ocupadas, altere no `docker-compose.yml` ou pare o processo que está usando a porta.
- **Erro de variáveis de ambiente**: verifique se o arquivo `.env` está na raiz e se todas as variáveis estão preenchidas corretamente.
- **Container não inicia**: execute `docker-compose logs <nome-do-servico>` (ex.: `docker-compose logs backend`) para ver os logs de erro.
- **Build falha**: certifique-se de ter espaço em disco suficiente e conexão com a internet (para download de imagens e pacotes).

---

## Rodando localmente (sem Docker)

Esta opção é útil para desenvolvimento, já que permite hot-reload e debug mais fácil.

### Pré-requisitos

- **Node.js** (versão 20 ou superior)
- **pnpm** (gerenciador de pacotes)
- **Redis** (para cache de embeddings)

Para instalar o pnpm (se não tiver):

```bash
npm install -g pnpm
```

Para instalar o Redis:

- **Windows**: use WSL2 ou instale via [Redis for Windows](https://github.com/microsoftarchive/redis/releases) ou [Docker Desktop](https://www.docker.com/products/docker-desktop) (apenas Redis).
- **Linux**: `sudo apt-get install redis-server` (Ubuntu/Debian) ou equivalente.
- **Mac**: `brew install redis`

### Passo 1: Configurar Redis local

1. **Inicie o Redis**:

```bash
# Windows (WSL ou via Docker)
redis-server

# Linux/Mac
redis-server
# ou, se instalado via Homebrew no Mac:
brew services start redis
```

2. **Verifique se está rodando**:

```bash
redis-cli ping
# Deve retornar: PONG
```

O Redis estará disponível em `redis://localhost:6379` (padrão).

### Passo 2: Configurar variáveis de ambiente do backend

1. Na pasta `api/`, crie um arquivo `.env`:

```bash
cd api
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Linux/Mac
touch .env
```

2. Abra o arquivo `api/.env` e adicione:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-sua-chave-openai-aqui

# Azure AI Search Configuration
AZURE_AI_SEARCH_KEY=sua-chave-azure-search-aqui
AZURE_AI_SEARCH_ENDPOINT=https://claudia-db.search.windows.net

# Redis Configuration (local)
REDIS_URL=redis://localhost:6379

# Node Environment
NODE_ENV=development
```

### Passo 3: Instalar dependências e rodar o backend

1. **Instale as dependências**:

```bash
cd api
pnpm install
```

2. **Inicie o servidor em modo desenvolvimento**:

```bash
pnpm start:dev
```

**O que acontece:**
- O NestJS compila o código TypeScript.
- Inicia o servidor na porta 3000 (padrão).
- Habilita hot-reload (recarrega automaticamente ao salvar arquivos).

Você deve ver no terminal:
```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] ...
[Nest] INFO [NestFactory] Nest application successfully started on http://[::1]:3000
```

3. **Teste o backend** (opcional): acesse `http://localhost:3000` no navegador ou faça uma requisição para `http://localhost:3000/conversations/completions`.

### Passo 4: Configurar e rodar o frontend

1. **Instale as dependências**:

```bash
cd frontend
pnpm install
```

2. **Configure a URL da API** (opcional):

   - **Por padrão, o frontend já está configurado para `http://localhost:3000`**.
   - **Você NÃO precisa criar um `.env`** a menos que queira usar uma porta/URL diferente.
   - Se precisar alterar, crie um arquivo `.env` na pasta `frontend/` com a variável `VITE_API_URL`:

```bash
# frontend/.env (OPCIONAL - só se precisar mudar a URL/porta)
VITE_API_URL=http://localhost:3000
```

3. **Inicie o servidor de desenvolvimento**:

```bash
pnpm dev
```

**O que acontece:**
- O Vite compila o React e inicia o servidor de desenvolvimento.
- Geralmente roda na porta 5173 (você verá a URL no terminal).
- Habilita hot-reload (recarrega automaticamente ao salvar arquivos).

Você deve ver no terminal algo como:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

4. **Acesse o frontend**: abra `http://localhost:5173` no navegador.

### Passo 5: Verificar se está tudo funcionando

1. **Backend rodando**: você deve conseguir acessar `http://localhost:3000` (ou ver logs de requisições no terminal).
2. **Frontend rodando**: você deve ver a interface do chat em `http://localhost:5173`.
3. **Teste completo**: envie uma mensagem no chat e verifique se:
   - A requisição é enviada para o backend.
   - A resposta é exibida no chat.
   - O contexto recuperado (RAG) aparece no painel lateral.

### Ordem de inicialização recomendada

1. Redis (deve estar rodando primeiro)
2. Backend (aguarda Redis estar disponível)
3. Frontend (pode iniciar em paralelo, mas precisa do backend para funcionar)

### Troubleshooting

- **Erro "Cannot connect to Redis"**: verifique se o Redis está rodando (`redis-cli ping`) e se a `REDIS_URL` está correta.
- **Erro de porta em uso**: altere a porta no código ou pare o processo que está usando a porta.
- **Erro de variáveis de ambiente**: verifique se o arquivo `.env` está na pasta correta (`api/.env` para backend, `frontend/.env` para frontend se necessário).
- **Erro de dependências**: delete `node_modules` e `pnpm-lock.yaml`, depois execute `pnpm install` novamente.
- **Frontend não conecta ao backend**: verifique se `VITE_API_URL` está correto e se o backend está rodando e acessível.

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

