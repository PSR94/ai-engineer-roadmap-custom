// Phase data extracted from the curriculum
window.PHASE_COLORS = ["teal-deep", "teal", "purple", "pink", "emerald", "amber", "rust", "mustard", "indigo"];
window.ROADMAP = [
  {
    id: 1,
    title: "Python Foundations",
    short: "Python + Engineering Basics",
    color: "teal-deep",
    weeks: "Weeks 1–3",
    weeksDetail: "3 weeks · 11 modules",
    difficulty: 2,
    summary: "Every agent framework runs on Python. Skip this and everything later breaks in mysterious ways.",
    endState: "You can build a FastAPI endpoint that calls three different LLMs in parallel, times out the slow one, and logs the result without blocking the response.",
    sections: [
      {
        n: "1.1",
        title: "Core Python",
        items: ["Variables, types, control flow", "Functions, *args/**kwargs, decorators", "List & dict comprehensions", "Generator expressions", "Type hints (you'll need these for Pydantic later)"],
        detail: {
          duration: "45–90 min",
          level: "Beginner",
          status: "Required",
          goal: "By the end of this module, you should understand the Python basics needed to read, write, and debug simple AI engineering code.",
          whyItMatters: [
            "Calling LLM APIs",
            "Cleaning prompts and user input",
            "Processing documents",
            "Building RAG pipelines",
            "Creating FastAPI endpoints",
            "Building agents and tools",
            "Debugging production AI apps"
          ],
          concepts: [
            {
              title: "Variables, types, and control flow",
              explanation: "A variable is a name that points to a value so you can reuse it later. Python values have types such as str, int, float, bool, list, dict, and None. Control flow with if / elif / else lets your code choose what to do based on the current data.",
              aiUseCase: "Check whether a user question is empty, whether a confidence score is too low, or whether the app should ask a follow-up question instead of calling the model.",
              code: `question = "What is RAG?"
confidence = 0.42

if not question.strip():
    response = "Please enter a question."
elif confidence < 0.5:
    response = "I need more context before answering."
else:
    response = "Calling the LLM now..."`
            },
            {
              title: "Functions",
              explanation: "Functions are reusable blocks of code. They can accept parameters, do one clear job, and return a value. Good AI engineering code is built from small functions you can test independently.",
              aiUseCase: "Use functions such as clean_input(), build_prompt(), and should_use_rag() to keep an AI endpoint readable and easy to debug.",
              code: `def clean_input(text: str) -> str:
    return text.strip()

def should_use_rag(question: str) -> bool:
    keywords = ["policy", "document", "source", "citation"]
    return any(word in question.lower() for word in keywords)

question = clean_input("  Summarize this policy document ")
use_rag = should_use_rag(question)`
            },
            {
              title: "*args and **kwargs",
              explanation: "*args lets a function accept a flexible number of positional values. **kwargs lets it accept flexible named settings. You do not need these everywhere, but they help when a wrapper needs to pass optional configuration through cleanly.",
              aiUseCase: "Pass optional model settings such as model, temperature, max_tokens, and timeout without writing a separate parameter for every possible provider option.",
              code: `def call_model(prompt: str, **settings) -> dict:
    return {
        "prompt": prompt,
        "model": settings.get("model", "gpt-4.1-mini"),
        "temperature": settings.get("temperature", 0.2),
        "max_tokens": settings.get("max_tokens", 500),
    }

result = call_model(
    "Explain MCP in one paragraph",
    model="gpt-4.1",
    temperature=0.1,
    timeout=30,
)`
            },
            {
              title: "Decorators",
              explanation: "A decorator wraps a function and adds behavior around it. Beginner version: it is a clean way to say “run this extra logic whenever this function is used” without rewriting the function body.",
              aiUseCase: "FastAPI uses decorators to turn Python functions into web routes. Agent frameworks often use decorators to register functions as tools the model can call.",
              code: `from fastapi import FastAPI

app = FastAPI()

@app.post("/chat")
def chat(message: str) -> dict:
    return {"reply": f"You said: {message}"}

# Agent frameworks use a similar idea:
# @tool
# def search_docs(query: str) -> list[dict]: ...`
            },
            {
              title: "List and dict comprehensions",
              explanation: "Comprehensions are concise ways to transform lists and dictionaries. They are useful when the transformation is simple. If the logic becomes hard to read, use a normal for loop.",
              aiUseCase: "Clean prompt lists, filter invalid documents, or transform retrieved chunks before sending them to an LLM.",
              code: `raw_prompts = ["  Explain RAG  ", "", "What is MCP?"]
clean_prompts = [p.strip() for p in raw_prompts if p.strip()]

chunks = [
    {"text": " RAG retrieves context. ", "score": 0.91},
    {"text": "Unrelated note", "score": 0.32},
]

context = [
    chunk["text"].strip()
    for chunk in chunks
    if chunk["score"] >= 0.8
]`
            },
            {
              title: "Generator expressions",
              explanation: "Generators produce values lazily, one at a time, instead of building the whole result in memory. This matters when the input is large.",
              aiUseCase: "Process large files, logs, or document chunks without loading everything into memory at once.",
              code: `def valid_lines(lines: list[str]):
    return (line.strip() for line in lines if line.strip())

log_lines = [" request started ", "", " model timeout ", " retrying "]

for line in valid_lines(log_lines):
    print(line)`
            },
            {
              title: "Type hints",
              explanation: "Type hints document the input and output types a function expects. Python does not enforce them at runtime by default, but editors, tests, FastAPI, and Pydantic can use them to catch mistakes earlier.",
              aiUseCase: "FastAPI endpoints, Pydantic models, tool schemas, and structured outputs all become easier to understand and validate when types are explicit.",
              code: `def build_prompt(question: str, context_chunks: list[str]) -> str:
    context = "\\n".join(context_chunks)
    return f"Use this context:\\n{context}\\n\\nQuestion: {question}"

def parse_score(raw_score: float | None) -> float:
    if raw_score is None:
        return 0.0
    return raw_score`
            }
          ],
          miniProject: {
            title: "Build: Prompt Cleaner",
            description: "Create a Python script that takes messy user prompts and converts them into clean structured data.",
            inputCode: `raw_prompts = [
    "   Explain RAG in simple terms   ",
    "",
    "What is MCP?",
    "   summarize vector databases "
]`,
            expectedOutputCode: `[
    {
        "id": 1,
        "prompt": "Explain RAG in simple terms",
        "word_count": 6,
        "is_valid": true
    },
    ...
]`,
            starterCode: `def clean_prompt(prompt: str) -> str:
    # Remove leading/trailing whitespace.
    return prompt.strip()

def count_words(prompt: str) -> int:
    # Count words after cleaning.
    return len(clean_prompt(prompt).split())

def is_valid_prompt(prompt: str) -> bool:
    # Empty prompts should not be sent to an LLM.
    return bool(clean_prompt(prompt))

def process_prompts(raw_prompts: list[str]) -> list[dict]:
    processed = []

    for index, raw_prompt in enumerate(raw_prompts, start=1):
        prompt = clean_prompt(raw_prompt)
        processed.append({
            "id": index,
            "prompt": prompt,
            "word_count": count_words(prompt),
            "is_valid": is_valid_prompt(prompt),
        })

    return processed`
          },
          commonMistakes: [
            { mistake: "Writing everything in one function", better: "Break logic into small reusable functions" },
            { mistake: "Using unclear variable names", better: "Use names that describe the data, such as raw_prompt or cleaned_prompt" },
            { mistake: "Ignoring empty input", better: "Check blank strings before calling an LLM or retrieval system" },
            { mistake: "Overusing clever comprehensions", better: "Use normal loops when the logic needs multiple steps" },
            { mistake: "Skipping type hints", better: "Add simple hints for function inputs and return values" },
            { mistake: "Not testing helper functions separately", better: "Test clean_prompt(), count_words(), and is_valid_prompt() before the full pipeline" }
          ],
          checklist: [
            "Explain variables and basic types",
            "Write small reusable functions",
            "Use simple type hints",
            "Use comprehensions for data cleanup",
            "Understand decorators conceptually",
            "Build the Prompt Cleaner mini task"
          ]
        }
      },
      { n: "1.2", title: "Object-Oriented Python", items: ["Classes, __init__, instance vs class methods", "Inheritance, encapsulation, polymorphism", "Dataclasses", "Pydantic models — every agent framework uses them for tool schemas"] },
      { n: "1.3", title: "Data Structures", items: ["List, Tuple, Set, Dict, NamedTuple", "collections.defaultdict, Counter, deque", "When to use which (interview territory)"] },
      { n: "1.4", title: "Error & File Handling", items: ["try/except/finally", "Custom exception classes", "Context managers (with, contextlib)", "Reading/writing JSON, CSV, plain text, binary"] },
      { n: "1.5", title: "Working with HTTP APIs", items: ["The requests library", "HTTP verbs, headers, status codes", "Authentication (Bearer tokens, API keys)", "Rate limits, retries, exponential backoff with tenacity"] },
      { n: "1.6", title: "Database Connectivity", items: ["psycopg2 for raw PostgreSQL", "SQLAlchemy ORM basics", "Connection pooling and why it matters under load", "Raw SQL when the ORM gets in the way"] },
      { n: "1.7", title: "FastAPI", items: ["First /chat endpoint", "Pydantic request/response models", "Dependency injection", "Automatic OpenAPI docs", "Running with uvicorn"] },
      { n: "1.8", title: "Async Programming", items: ["asyncio fundamentals — event loop, coroutines", "async/await syntax", "asyncio.gather for parallel LLM calls", "asyncio.wait_for for timeout protection", "asyncio.create_task for fire-and-forget logging"] },
      { n: "1.9", title: "Git + GitHub Workflows", items: ["Git basics: clone, branch, commit, merge, rebase", "Pull requests, code review, issues, and project boards", "Resolving merge conflicts without panic", "README-driven portfolio repos — architecture, setup, screenshots, eval numbers"] },
      { n: "1.10", title: "Linux + Shell Basics", items: ["Navigation, permissions, processes, environment variables", "grep/rg, find, awk/sed basics for logs and data files", "SSH into a server, tail logs, inspect disk/memory/ports", "Shell scripts for repeatable local workflows"] },
      { n: "1.11", title: "Testing Fundamentals", items: ["pytest unit tests for pure Python functions", "FastAPI integration tests with test clients", "Mocking LLM/API calls without hiding failures", "Golden-file and regression tests for prompts, retrieval, and eval outputs"] }
    ]
  },
  {
    id: 2,
    title: "The Mental Model of an LLM",
    short: "LLM Mental Model",
    color: "teal",
    weeks: "Week 4",
    weeksDetail: "1 week · 5 modules",
    difficulty: 1,
    summary: "Conceptual phase. Almost no code. Where the brain-in-a-windowless-room analogy lives, and where most \"why is my agent broken\" questions get answered six months later.",
    endState: "You can explain to a non-technical PM why ChatGPT made up a fact, and tell a hiring panel which model to pick for which job — backed by benchmarks, not vibes.",
    sections: [
      { n: "2.1", title: "What an LLM actually is", items: ["Trained on a fixed snapshot", "Knowledge cutoff dates and what they imply", "Probabilistic generation, not retrieval", "Why the same prompt gives different outputs"] },
      { n: "2.2", title: "How an LLM thinks", items: ["BPE tokenization — why \"hello\" is 1 token but \"antidisestablishmentarianism\" is 6", "Context windows — what fits, what gets silently truncated", "Sampling parameters: temperature, top-p, top-k — when to set what", "Transformer at 30,000 feet — attention preserves position, no math, no multi-head diagrams", "Why long context degrades (\"lost in the middle\")"] },
      { n: "2.3", title: "Reasoning models vs base models", items: ["The 2025 split: o1 / o3, Claude 3.7 thinking, Gemini 2.5 thinking, DeepSeek R1, Qwen QwQ", "What \"thinking tokens\" actually are and why they're billed", "When reasoning models are worth the latency and cost", "Reasoning effort knobs (low / medium / high) and how to budget them", "When a base model + good prompting beats a thinking model"] },
      { n: "2.4", title: "Reading model evals & benchmarks", items: ["The benchmarks worth knowing — MMLU, GSM8K, HumanEval, SWE-bench, GPQA, MMMU, BFCL (function calling)", "Why benchmarks lie — contamination, prompt sensitivity, eval gaming", "How to read a leaderboard skeptically (LMArena, Artificial Analysis, Vellum, Aider)", "Building your own micro-eval for the task you actually care about"] },
      { n: "2.5", title: "Comparing the major models", items: ["GPT family, Claude family, Gemini, Llama, Mistral, DeepSeek, Qwen", "Cost vs quality vs speed vs context-length tradeoffs", "When model choice matters vs when it really doesn't"] }
    ]
  },
  {
    id: 3,
    title: "Prompt Engineering & API Access",
    short: "Prompt Engineering",
    color: "purple",
    weeks: "Weeks 5–7",
    weeksDetail: "3 weeks · 8 modules",
    difficulty: 2,
    summary: "The pivot from \"ChatGPT user\" to \"engineer who controls LLMs.\"",
    endState: "You can take a flaky prompt that works \"sometimes\" and systematically make it reliable — and cut its cost in half with caching while you're at it.",
    sections: [
      { n: "3.1", title: "UI vs API — the hinge moment", items: ["Same prompt, same model, different output — why?", "System prompts you don't see", "Skills/tools the chat UI calls silently", "Why production work happens via API"] },
      { n: "3.2", title: "Calling LLMs via API", items: ["OpenAI SDK, Anthropic SDK", "Message format (system / user / assistant)", "Streaming responses", "Structured output (JSON mode, tool-call schemas, XML tags)"] },
      { n: "3.3", title: "Prompt anatomy", items: ["System prompt vs user turn vs assistant prefill", "Role and persona assignment", "Positive framing over negative constraints", "Markdown vs XML structure"] },
      { n: "3.4", title: "Core techniques", items: ["Zero-shot", "Few-shot with curated examples", "COSTAR framework (Context, Objective, Style, Tone, Audience, Response)", "Iterative refinement loop"] },
      { n: "3.5", title: "Applied prompt patterns", items: ["Extraction (entities, dates, relationships)", "Classification (intent, sentiment, routing)", "Transformation (summarize, translate, reformat)", "Generation (reports, SQL, code)", "Decomposition (break complex queries into sub-prompts)"] },
      { n: "3.6", title: "Advanced reasoning techniques", items: ["Chain of Thought — \"think step by step\"", "Self-Consistency — sample multiple paths, majority vote", "Self-Refine — generate, critique, refine loop", "Least-to-Most — decompose hard problems into ordered sub-problems", "Tree of Thought (research-flavoured; mention but don't drill)"] },
      { n: "3.7", title: "Prompt management & cost in production", items: ["Versioning prompts in code vs as managed resources", "A/B testing prompt variants", "AWS Bedrock Prompt Management for the lifecycle without code deploys", "Prompt caching — Anthropic cache_control and OpenAI's automatic cached input pricing (5–10× cost cuts on long system prompts)", "DSPy — programmatic prompt optimisation when you want the framework to tune your prompts for you (mention; depth is optional)"] },
      { n: "3.8", title: "Frontend basics for AI demos", items: ["HTML/CSS/JS fundamentals — forms, fetch, loading states, error states", "Streamlit for internal tools and quick evaluation UIs", "React/Next.js basics for a real chat experience", "Streaming UI patterns: token stream, cancel button, retry, citations, trace link"] }
    ]
  },
  {
    id: 4,
    title: "RAG + Evaluation",
    short: "Ingestion Pipeline + RAG",
    color: "pink",
    weeks: "Weeks 8–12",
    weeksDetail: "5 weeks · 10 modules",
    difficulty: 4,
    capstone: 1,
    summary: "The longest phase. RAG looks simple in tutorials and is brutal in production.",
    endState: "You can build a RAG system, measure why it's wrong, and fix it with data instead of vibes.",
    sections: [
      { n: "4.1", title: "Why RAG exists", items: ["LLMs can't see your private data", "The brain-in-a-windowless-room reaches its limit", "Use cases: internal docs, company policies, recent data"] },
      { n: "4.2", title: "Embeddings", items: ["What an embedding actually is (vector in N-dim space)", "Cosine similarity, dot product, Euclidean distance", "Embedding models — Titan Multimodal, SentenceTransformer, OpenAI ada/text-embedding-3, Cohere", "Choosing dimensions vs cost"] },
      { n: "4.3", title: "Document ingestion pipeline", items: ["Layout identification with Docling (headers, paragraphs, tables, code blocks, formulas)", "Serialization to structured objects", "Why PyMuPDF alone fails on complex PDFs"] },
      { n: "4.4", title: "Chunking strategies", items: ["Fixed-width chunking and why it breaks", "Semantic chunking by structure", "Overlap windows", "Parent-child chunking", "Late chunking — embed first, chunk later — preserves context across boundaries", "Chunk size vs retrieval quality tradeoff"] },
      { n: "4.5", title: "Chunk enrichment", items: ["PII detection and redaction", "NER for entities", "Key-phrase extraction", "Metadata for hybrid search"] },
      { n: "4.6", title: "Vector databases", items: ["Pinecone, Weaviate, pgvector", "Chroma for local dev", "S3 Vector Buckets, OpenSearch", "HNSW vs IVF indexes", "Decision matrix: managed (Pinecone) vs self-hosted (Weaviate, Qdrant) vs in-process (Chroma, FAISS) vs already-in-your-stack (pgvector)"] },
      { n: "4.7", title: "Hybrid retrieval & next-gen retrievers", items: ["Vector search + BM25 keyword", "Reranking with cross-encoders (Cohere Rerank, BGE)", "Metadata filtering", "Query expansion", "Late-interaction retrievers — ColBERT (text), ColPali (multimodal/PDF pages as images) — when they beat dense retrieval and what they cost"] },
      { n: "4.8", title: "Graph-augmented RAG", items: ["Neo4j basics", "Cypher query language", "When graph relationships beat pure vector search", "Multi-hop queries"] },
      { n: "4.9", title: "RAG evaluation — the part most courses skip", items: ["LLM-as-judge: RAG Triad — Faithfulness, Context Relevance, Answer Relevance", "Deterministic retrieval metrics: Precision@k, Recall@k, F1, Hit Rate@k, MRR, NDCG@k", "Tooling: Ragas (the de-facto eval framework), MLflow for run logging, LangSmith for tracing", "Golden datasets: Q&A pairs with expected chunks, regression testing on every code change"] },
      { n: "4.10", title: "Data engineering basics for AI systems", items: ["ETL vs ELT — ingest, clean, normalize, enrich, load", "Batch jobs and worker queues for document processing", "SQL joins, indexes, migrations, and query plans", "Object storage layouts: raw / processed / embeddings / eval artifacts", "Idempotency and retry-safe jobs so reprocessing does not duplicate data"] }
    ]
  },
  {
    id: 5,
    title: "Tools, MCP, and Single Agents",
    short: "Tools, MCP & Single Agents",
    color: "emerald",
    weeks: "Weeks 13–16",
    weeksDetail: "4 weeks · 9 modules",
    difficulty: 4,
    summary: "The brain gets hands and legs.",
    endState: "You can build a single agent that searches the web, reads internal docs, queries a DB, and emails you a summary — and stops if it tries to do something dumb.",
    sections: [
      { n: "5.1", title: "Function calling / tool use", items: ["Tool schemas (JSON Schema, Pydantic)", "How the LLM decides which tool to call", "Structured outputs for predictable downstream code", "Parsing tool-call responses", "Handling tool errors gracefully"] },
      { n: "5.2", title: "Tool design principles", items: ["One tool, one job", "Clear docstrings — the LLM reads them", "Return structured data, not free text", "Fallbacks inside tools, not in the agent"] },
      { n: "5.3", title: "MCP — Model Context Protocol", items: ["What MCP is and why it exists (universal adapter for tools)", "MCP servers vs MCP clients", "Using existing MCP servers (filesystem, GitHub, Slack)", "Building your own MCP server", "stdio vs HTTP transports", "MCP is moving fast — bookmark modelcontextprotocol.io and re-read the spec every few months; the registry, auth model, and resource semantics are still evolving"] },
      { n: "5.4", title: "The ReAct pattern", items: ["Reasoning + Acting loop", "Thought → action → observation → thought", "Why \"thinking\" models exist", "When to force ReAct vs let the model decide"] },
      { n: "5.5", title: "LangChain agents", items: ["create_agent — model + tools + middleware + store", "@tool(parse_docstring=True) for auto schemas", "Parallel tool execution with asyncio.gather", "Structured outputs via Pydantic"] },
      { n: "5.6", title: "Human approval flows", items: ["Human-in-the-loop gates for sensitive operations", "Approval objects: who approved, what changed, when it expires", "Checkpointers and resumable execution after approval", "When to pause (DB writes, payments, emails, external messages, production changes)"] },
      { n: "5.7", title: "Tool permissions and least privilege", items: ["Read-only vs write tools — separate them at the schema and IAM level", "Allow-lists for tables, directories, domains, and API operations", "Per-tool timeouts, max retries, max spend, and max records touched", "Audit logs for every tool call: input, output, actor, trace ID"] },
      { n: "5.8", title: "Agent tracing and debugging", items: ["Trace every model call, tool call, handoff, retry, and guardrail decision", "Correlate trace IDs with backend logs and user sessions", "Inspect token usage, latency, tool failures, and bad routing decisions", "Use trace screenshots in portfolio demos and incident reviews"] },
      { n: "5.9", title: "Computer use & app SDKs — agents with eyes and a mouse", items: ["Anthropic Computer Use — agent takes screenshots and drives a desktop/browser", "OpenAI Operator / Apps SDK — agent runs inside ChatGPT or controls a browser tab", "Browser-automation agents (Playwright + LLM, browser-use, Stagehand)", "When this is the right tool vs API integration", "Sandboxing, audit trails, and \"are you sure?\" gates — these agents can do real damage"] }
    ]
  },
  {
    id: 6,
    title: "Memory & Context Engineering",
    short: "Memory + Context Engineering",
    color: "amber",
    weeks: "Weeks 17–19",
    weeksDetail: "3 weeks · 7 modules",
    difficulty: 4,
    difficultyNote: "Advanced — but the highest-leverage skill in the whole curriculum.",
    summary: "The hardest conceptual phase. Easy to do badly, expensive when you do. Worth every hour of attention.",
    endState: "You can explain why your agent forgot what you said three turns ago, and fix it with the right memory layer instead of throwing more tokens at it.",
    sections: [
      { n: "6.1", title: "The context window as working memory", items: ["Why agents \"forget\" mid-conversation", "Token budgeting per section", "The lost-in-the-middle problem", "Recency bias"] },
      { n: "6.2", title: "Context structure — SYSTEM / CONTEXT / USER separation", items: ["What goes where", "@dynamic_prompt patterns", "Structural separation as a security defence against prompt injection", "Token budgets per section (e.g. SYSTEM=instructions, CONTEXT=retrieved data, ~2000 tokens each)"] },
      { n: "6.3", title: "Short-term memory — session history", items: ["Sliding window of last N turns", "Message-pair preservation (don't split user from assistant)", "When to keep tool calls in history vs strip them"] },
      { n: "6.4", title: "Semantic caching", items: ["FAISS IndexFlatIP for sub-millisecond cosine search", "Similarity thresholds (0.97 high-stakes, 0.88 general Q&A)", "Cache HIT skips everything downstream", "Daemon-thread writes so cache never blocks response"] },
      { n: "6.5", title: "Episodic memory", items: ["LangChain's InMemoryStore", "LLM tags answers as EPISODIC: YES/NO so the model decides what's worth remembering", "Episodic hits enrich CONTEXT only — tools and LLM still run"] },
      { n: "6.6", title: "Context compression", items: ["Trigger threshold (>3000 tokens)", "Keep last 10 messages verbatim", "LLM summarises the rest into a single compressed entry", "When compression destroys information"] },
      { n: "6.7", title: "Long-term memory", items: ["User profiles, preferences, facts to persist", "Vector stores vs structured stores", "Managed memory layers — mem0 (open-source) and Zep (managed) — when to skip building this yourself", "When memory becomes a privacy problem (GDPR, right-to-be-forgotten flows)"] }
    ]
  },
  {
    id: 7,
    title: "Multi-Agent Orchestration",
    short: "Multi-Agent Orchestration",
    color: "rust",
    weeks: "Weeks 20–22",
    weeksDetail: "3 weeks · 8 modules",
    difficulty: 5,
    capstone: 2,
    summary: "When one agent isn't enough.",
    endState: "You can design a multi-step agent workflow on a whiteboard, build it in LangGraph, and debug it when one node loops infinitely.",
    sections: [
      { n: "7.1", title: "When to go multi-agent (and when not to)", items: ["Single-agent-with-tools beats multi-agent for ~80% of tasks", "Multi-agent earns its weight when steps need different prompts, tools, or specialised reasoning", "The Tableau→QuickSight conversion case as a worked example"] },
      { n: "7.2", title: "LangGraph fundamentals", items: ["Nodes, edges, state", "StateGraph and reducers", "Conditional edges and routing", "Cycles and termination conditions"] },
      { n: "7.3", title: "Common patterns", items: ["Supervisor + workers", "Sequential pipeline", "Parallel fan-out / fan-in", "Plan-and-execute", "Reflection loops"] },
      { n: "7.4", title: "Agent-as-tool — the lightweight alternative", items: ["Wrap a sub-agent behind a normal @tool interface", "Parent agent calls it like any other function — no graph, no state plumbing", "When this beats LangGraph (clear hierarchy, no shared state, deterministic flow)", "Composing specialist agents (researcher, summariser, critic) without orchestration overhead"] },
      { n: "7.5", title: "State management", items: ["Typed state with Pydantic", "What to put in state vs context", "Checkpointers for resumability (MemorySaver, SqliteSaver, PostgresSaver)"] },
      { n: "7.6", title: "A2A — Agent-to-Agent Protocol", items: ["Agent discovery and capability cards", "Cross-framework delegation", "When A2A beats just calling another function"] },
      { n: "7.7", title: "Frameworks compared (briefly)", items: ["LangGraph (most mature)", "CrewAI (simpler, opinionated)", "AutoGen (Microsoft)", "Pydantic AI (typed, FastAPI-flavoured ergonomics)", "OpenAI Swarm / its successor — minimal handoff-style orchestration", "Custom orchestration with raw asyncio", "Pick one and stick with it"] },
      { n: "7.8", title: "Debugging multi-agent systems", items: ["LangSmith tracing", "Why your agents are talking past each other", "Cycles that won't terminate", "Cost explosions"] }
    ]
  },
  {
    id: 8,
    title: "Guardrails & LLMOps",
    short: "Guardrails + LLMOps",
    color: "mustard",
    weeks: "Weeks 23–24",
    weeksDetail: "2 weeks · 6 modules",
    difficulty: 3,
    summary: "You know what to build. Now make it not embarrass you in production — measure failure, catch it before users do, and prove the agent is improving release-over-release.",
    endState: "You can put a number on how often your agent fails, and ship it anyway with confidence.",
    sections: [
      { n: "8.1", title: "Three-layer guardrail architecture", items: ["Input Guardrails (gateway, <1ms, deterministic): prompt-injection regex, PII redaction, out-of-domain rejection, toxic filter — code-based, never LLM", "Output Guardrails (LLM-judge OK): faithfulness, contradiction check, medical/legal disclaimers when confidence < threshold, hard-fail to safe fallback", "Action Guardrails (inside tools, pure functions): max retries, max tool calls per request, query validation, read-only DB, top_k caps"] },
      { n: "8.2", title: "AWS Bedrock Guardrails", items: ["Contextual grounding", "Automated reasoning checks", "Harmful content filtering", "Topic blocking", "When managed guardrails are enough vs custom"] },
      { n: "8.3", title: "Agent safety patterns", items: ["Tool permission model: deny by default, explicit grants per route/user/tool", "Human approval for high-impact actions and ambiguous tool outputs", "Handoffs between specialized agents with clear ownership and stop conditions", "Structured outputs before side effects — validate first, act second"] },
      { n: "8.4", title: "LLMOps — observability", items: ["LangSmith / LangFuse for traces", "Token cost dashboards", "Latency percentiles (p50, p95, p99)", "Failure rate by tool, by route, by model", "Trace sampling and redaction so observability does not leak user data"] },
      { n: "8.5", title: "LLMOps — evaluation in production", items: ["Golden dataset regression tests in CI", "A/B testing prompt and model changes", "Feedback loops from user thumbs-up/down", "Drift detection on retrieval quality", "Eval tests for refusals, tool permissions, structured outputs, and human-approval paths"] },
      { n: "8.6", title: "Security basics for AI apps", items: ["API keys, secrets, and environment variables — never commit credentials", "Authentication vs authorization: who are you, and what can you do?", "Rate limits, quotas, abuse prevention, and spend caps", "Prompt injection, data exfiltration, SSRF, unsafe file access, and dependency risk"] }
    ]
  },
  {
    id: 9,
    title: "Cloud Infrastructure & Deployment",
    short: "Cloud + Deployment",
    color: "indigo",
    weeks: "Weeks 25–26",
    weeksDetail: "2 weeks · 8 modules",
    difficulty: 3,
    capstone: 3,
    summary: "The final mile. Minimum AWS to make everything earlier deployable, plus how to actually put an agent in production and keep costs sane.",
    endState: "You can take any system you built in earlier phases, dockerize it, deploy to ECS Fargate behind API Gateway, manage secrets, stream tokens to a chat UI, load-test it, and watch the cost dashboard move only when it should.",
    sections: [
      { n: "9.1", title: "Storage & data", items: ["S3 — durable object storage, document lakes", "RDS PostgreSQL — managed relational DB for agent state", "DynamoDB — KV state for ingestion pipelines"] },
      { n: "9.2", title: "Compute", items: ["Lambda — serverless event-driven flows", "ECS Fargate — serverless containers for long-running agents", "ECR — container registry"] },
      { n: "9.3", title: "Networking & access", items: ["VPC, subnets, security groups (just enough not to break)", "IAM roles and policies", "API Gateway for exposing endpoints"] },
      { n: "9.4", title: "AI-specific services (and other clouds)", items: ["AWS Bedrock — managed foundation models", "AWS AgentCore — production agent infrastructure", "Bedrock embeddings", "Equivalents on other clouds: GCP Vertex AI (Model Garden, Agent Builder) and Azure AI Foundry (model catalog, prompt flow) — same primitives, different SKUs"] },
      { n: "9.5", title: "Docker and reproducible local dev", items: ["Dockerfile for FastAPI agents", "docker compose for app + Postgres + Redis + worker", ".dockerignore, small images, healthchecks, non-root users", "Rebuild from scratch on another machine and get the same app"] },
      { n: "9.6", title: "Deployment & realtime delivery", items: ["ECS Fargate task definitions", "API Gateway + ALB routing", "Secrets management with AWS Secrets Manager", "Environment promotion (dev → staging → prod)", "Streaming responses to chat UIs — SSE for one-way token streaming, WebSockets when you also need client → server messages mid-stream"] },
      { n: "9.7", title: "CI/CD with GitHub Actions", items: ["Run lint, type checks, unit tests, integration tests, and eval tests on every PR", "Build and push Docker images to ECR", "Deploy to staging automatically, production with manual approval", "Rollback strategy, release notes, and environment-specific secrets"] },
      { n: "9.8", title: "Production observability & cost control", items: ["Structured logs with request IDs and trace IDs", "Metrics: request count, error rate, p95 latency, queue depth, token spend", "Alerts for tool failure spikes, cost anomalies, and eval regressions", "Semantic cache HIT rate as a KPI", "Model routing — cheap model for simple queries, expensive for complex", "Load testing with locust or k6 — agents fall over under concurrency long before the LLM does; rate-limit at the gateway, not the model"] }
    ]
  }
];

window.CAPSTONES = [
  {
    n: 1,
    title: "Distributed Document Ingestion + RAG Pipeline",
    phase: "Built during Phase 4 · Weeks 10–12",
    domain: "Unstructured document Q&A (legal, pharma, technical docs)",
    build: [
      "PDF ingestion: Docling layout detection → semantic chunking → PII redaction → entity extraction → embeddings → Pinecone + Neo4j",
      "Distributed async workers on ECS Fargate processing thousands of PDFs concurrently",
      "DynamoDB state tracking per document (queued / processing / done / failed)",
      "Hybrid retrieval (vector + BM25 + graph) with reranking",
      "Evaluation harness with golden dataset, Precision@k / Recall@k / RAG Triad",
      "FastAPI Q&A endpoint with citation-backed answers"
    ],
    stack: ["Docling", "Pinecone", "Neo4j", "Docker", "ECS Fargate", "DynamoDB", "S3", "Bedrock embeddings", "LangSmith", "GitHub Actions"],
    proves: "You can build production RAG, not a Streamlit demo."
  },
  {
    n: 2,
    title: "Multi-Agent Natural Language → SQL on E-commerce Data",
    phase: "Built during Phase 7 · Weeks 21–22",
    domain: "E-commerce analytics for non-technical users",
    build: [
      "Multi-agent: Planner → SQL Writer → Validator → Executor → Explainer",
      "Schema-aware context injection per query (only relevant tables sent to writer)",
      "LangGraph orchestration with conditional routing, durable execution, and retry loops",
      "Read-only DB enforcement, query timeout, max-row caps, and per-tool permission checks",
      "Human approval flow before exporting, emailing, or persisting generated analysis",
      "Streamlit frontend, FastAPI backend, RDS PostgreSQL with realistic data",
      "Benchmarked on a golden NLQ test set, target 85%+ accuracy, with trace links for failures"
    ],
    stack: ["LangChain", "LangGraph", "LangSmith", "AgentCore", "RDS PostgreSQL", "FastAPI", "Streamlit", "Docker", "Bedrock"],
    proves: "You can orchestrate multiple specialised agents safely against real production data."
  },
  {
    n: 3,
    title: "Clinical Trials Knowledge Base",
    phase: "Built during Phases 8–9 · Weeks 23–26",
    domain: "Life sciences AI (substitute legal, finance, or your industry)",
    build: [
      "Real ClinicalTrials.gov dataset ingestion (or your domain equivalent)",
      "Hybrid knowledge layer: Pinecone for unstructured PDFs + Neo4j for trial-drug-condition relationships",
      "Multi-hop relationship queries (\"what other trials used drug X for condition Y?\")",
      "Full three-layer guardrails — disclaimer auto-injection, contradiction checks, action limits, human approval gates",
      "Evidence-backed answers — every claim cites the source chunk",
      "Deployed on AWS with structured logs, traces, metrics, regression tests in CI, semantic cache, cost dashboard"
    ],
    stack: ["LangChain", "LangGraph", "Neo4j + Cypher", "Pinecone", "Bedrock + AgentCore + Lambda", "S3", "GitHub Actions", "LangSmith", "MLflow"],
    proves: "You can ship an agent into a regulated domain without it killing anyone (or your career)."
  }
];

window.OUT_OF_SCOPE = [
  {
    title: "Fine-tuning foundation models",
    why: "RAG, prompting, and tool use solve 95% of business problems faster, cheaper, and with no infra overhead. Fine-tuning earns its weight only when you have a narrow domain, lots of clean labelled data, and prompting has hit a wall — which almost never happens before you've shipped your first agent. Learn it after this roadmap, not during.",
    pointer: "Start with LoRA + a 7B open model (Llama, Mistral, Qwen) on a single A10/L4 once you have a real motivating use case."
  },
  {
    title: "Voice agents",
    why: "A whole sub-discipline — STT, TTS, turn-taking, latency budgets, barge-in. Worth its own track, not a side note. You can graft it on top of any agent you build in this roadmap.",
    pointer: "OpenAI Realtime API, Deepgram + ElevenLabs + LiveKit, or pipecat — pick after you've shipped one text agent."
  },
  {
    title: "ML fundamentals (gradient descent, backprop, transformers from scratch)",
    why: "Lovely to know. Not required to be an excellent agent engineer in 2026. The Karpathy series is there when you're curious — don't let it block you from shipping.",
    pointer: "Andrej Karpathy's \"Neural Networks: Zero to Hero\" + the \"Let's build GPT\" video, on weekends."
  },
  {
    title: "Advanced frontend specialization",
    why: "You need enough frontend to ship usable demos, review tools, and chat interfaces. You do not need to become a full-time product frontend engineer during this roadmap.",
    pointer: "Learn Streamlit first, then enough React/Next.js and the Vercel AI SDK to build a polished chat UI with streaming, citations, retries, and trace links."
  }
];

window.NEXT_STEPS = [
  {
    label: "Portfolio",
    title: "Three repos, three READMEs, one demo video each",
    body: "The capstones are your portfolio. For each one: a clean GitHub repo with a README that explains the problem, the architecture, the trade-offs, and the eval numbers; a 90-second Loom walking through it; one screenshot of the trace UI showing it actually working."
  },
  {
    label: "LinkedIn",
    title: "Headline that says what you can ship",
    body: "Don't write \"AI Engineer\" in your headline — write \"AI Engineer · production RAG, multi-agent systems, AWS Bedrock + LangGraph · shipping in regulated domains.\" Specific gets interviews. Generic gets ignored."
  },
  {
    label: "60-second pitch",
    title: "What to say in the first interview round",
    body: "\"I spent six months building three production-grade AI systems end-to-end: a distributed RAG pipeline that ingests thousands of PDFs, a multi-agent NL→SQL system with read-only enforcement, and a clinical-trials knowledge base with three-layer guardrails. I can show you the traces, the eval numbers, and the cost dashboard for any of them.\" That's the whole pitch. Numbers and artefacts beat adjectives."
  },
  {
    label: "Keep learning",
    title: "What to read once you're shipping",
    body: "Anthropic's \"Building effective agents\" essay, the Latent Space podcast, the LangChain blog, Eugene Yan's writing on production ML, and the original papers when something keeps confusing you (Self-RAG, RAG-as-judge, ReAct). Skim, don't drown."
  }
];
