# AI RAG System with Vector Search (LLM + Vector DB + Redis) - Backend + Frontend

<img width="1912" height="937" alt="image" src="https://github.com/user-attachments/assets/601528f6-385e-4c8e-a582-572a4da54a36" />



---

## What is this project?

This repository implements a support endpoint using Retrieval Augmented Generation (RAG) architecture:

* Generates embeddings for user text.
* Performs vector searches in Azure Search (using a populated IDS).
* Sends "retrieved context" + the question to the model to obtain a response restricted strictly to the provided context.

In addition to the backend, it includes a complete frontend to test the API, visualize retrieved context, and measure request latency.

---

## Repository Structure

* `api/`: NestJS (backend)
* `frontend/`: React + Vite (test interface)
* `docker-compose.yml`: Provisions backend, frontend, and Redis

---

## How to use the interface

The application offers a complete interface to interact with the virtual assistant:

### Main Features

* **Demonstration Questions**: Upon opening the application, you will see a selection of pre-configured questions that can be clicked to quickly test the system.

<div align="center">
  <img width="1040" height="334" alt="image" src="https://github.com/user-attachments/assets/87026958-280c-46b9-a10e-0f64b92e17b0" />
  <p><em>Example questions</em></p>
</div>

* **Response Time and Intent**: Below each message, you will see:
    * The time taken to process the request (allowing for Redis cache performance verification).
    * A badge indicating the message intent:
        * **Answer**: The assistant responded confidently using the available context.
        * **Clarification**: The assistant requires more information from the user.
        * **Escalate**: The assistant cannot help and is requesting a transfer to a human agent.

<div align="center">
  <img width="233" height="59" alt="image" src="https://github.com/user-attachments/assets/443d4960-center" />
  <p><em>Request time and response intent</em></p>
</div>

* **Retrieved Context**: On the right side of the screen (or in a drawer on mobile), you have access to the context retrieved by the system for the most recent message, including relevant text snippets from the knowledge base and the relevance score for each snippet.

<div align="center">
  <img width="600" alt="Retrieved context panel" src="https://github.com/user-attachments/assets/887f48a6-9b97-4ff1-9e5e-ce8aea70d0a0" />
  <p><em>Context panel with relevance scores</em></p>
</div>

* **Human Handover**: The system identifies when it cannot answer adequately and requests that the conversation be transferred to a human assistant.

* **Responsive Interface**: The application is fully responsive and works perfectly across all screen sizes (smartphones, tablets, desktop).

<div align="center">
  <table>
    <tr>
      <td align="center">
          <img width="939" height="936" alt="image" src="https://github.com/user-attachments/assets/8d095160-bed2-4ada-95b4-e76d630d7f4a" />
        <br />
        <em>Tablet</em>
      </td>
      <td align="center">
          <img width="443" height="934" alt="image" src="https://github.com/user-attachments/assets/22b5d3eb-e13a-465e-be61-2e5f4619a998" />
        <br />
        <em>Smartphone</em>
      </td>
    </tr>
  </table>
</div>

### Testing Redis Cache Performance

To visualize the performance gain from embedding caching:

1. Send any message.
2. Observe the response time displayed below the message.
3. Send **exactly the same message** again.
4. Compare the times: the second request will be significantly faster.

**Note the difference between the first request (no cache) and the second (with cached embedding) in the images below:**

<div align="center">
  <table>
    <tr>
      <td align="center">
         <img width="256" height="148" alt="image" src="https://github.com/user-attachments/assets/4823819d-5254-41b5-92a6-98e45bec1352" />
        <br />
        <em>First request (no cache) - 3.90s</em>
      </td>
      <td align="center">
         <img width="319" height="166" alt="image" src="https://github.com/user-attachments/assets/27f96b7e-0c94-4276-8107-dbb763c4c65f" />
        <br />
        <em>Second request (cached) - 1.41s</em>
      </td>
    </tr>
  </table>
</div>

### Testing Human Handover

To test the handover functionality, follow this sequence:

1. **First message**: "How much?"
   - The system will ask for clarification regarding which model you are asking about.
2. **Second message**: "The car"
   - The system will ask again to specify the car model.
3. **Third message**: "Just tell me"
   - After multiple unsuccessful clarification attempts, the system will request a transfer to a human.

---

## How to run (Recommended: Docker)

### Prerequisites

* **Docker** (version 20.10 or higher)
* **Docker Compose** (version 2.0 or higher)

To verify installations:

```bash
docker --version
docker compose version
```

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd project-directory
```

### Step 2: Configure environment variables

1. Create a `.env` file in the root:

```bash
touch .env
```

2. Add the following variables:

```bash
# Provider Configuration
OPENAI_API_KEY=sk-your-key-here

# Search Configuration
AZURE_AI_SEARCH_KEY=your-azure-key-here
AZURE_AI_SEARCH_ENDPOINT=[https://your-endpoint.search.windows.net](https://your-endpoint.search.windows.net)

# Redis Configuration
REDIS_URL=redis://redis:6379
```

### Step 3: Build and start containers

```bash
docker-compose up --build
```

---

## Running locally (without Docker)

### Prerequisites

* **Node.js** (v20+)
* **pnpm**
* **Redis**

### Step 1: Install and run

```bash
# In the api folder
cd api
pnpm install
pnpm start:dev

# In the frontend folder
cd ../frontend
pnpm install
pnpm dev
```

---

## Main Endpoint

### `POST /conversations/completions`

Example request:

```json
{
  "helpDeskId": 123456,
  "projectName": "tesla_motors",
  "messages": [
    { "role": "USER", "content": "How long does a Tesla battery last?" }
  ]
}
```

---

## Technical Decisions

### Retrieval Augmented Generation (RAG)

* **Purpose**: To provide answers based strictly on the knowledge base and prevent hallucinations.
* **Benefit**: Fact-based responses with transparency regarding the source material.

### Clarification Feature

* **Rule**: When information is insufficient, the agent requests clarification.
* **Limit**: Maximum of 2 clarifications per conversation; a third requirement triggers a human handover.

### Redis Caching (Embeddings)

* **Purpose**: Embeddings can be resource-intensive and repetitive. Caching reduces external calls and latency.
* **Benefit**: Faster response times for repeated queries and lower operational costs.

### Logging and Observability

* **Interceptor**: A logging interceptor tracks execution time and route metadata for performance monitoring.
* **Exception Filter**: Standardizes error responses for consistent debugging.

---

## Future Improvements

* **Stricter Guardrails**: Backend validation to ensure every response includes a specific source citation.
* **Intelligent Caching**: Text normalization and TTL based on content type.
* **Enhanced Observability**: Implementation of correlation IDs and exports to APM tools.
* **Security**: Rate limiting and environment-based CORS policies.
