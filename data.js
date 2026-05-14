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
          whyIntro: "Python is the default glue language for modern AI systems. You will use these basics when you are:",
          codeLabel: "Python example",
          showCodeLabel: "Show Python code",
          hideCodeLabel: "Hide Python code",
          conceptsTitle: "Core Python Concepts",
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
              plainExample: "Think of a support bot that receives a blank question. It should not waste money calling an LLM. It should first check: is the question empty? Is confidence low? If yes, ask for more information.",
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
              plainExample: "Instead of writing all logic inside one chat endpoint, split it into small jobs: one function cleans the input, one builds the prompt, and one decides whether retrieval is needed.",
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
              plainExample: "Imagine a helper that calls an LLM. Some calls need a low temperature, some need a different model, and some need a timeout. Flexible settings let you pass only the options needed for that call.",
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
              plainExample: "A decorator is like putting a label on a function. In FastAPI, the label says: this function should run when someone sends a request to /chat. In agent tools, the label says: the model is allowed to call this function.",
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
              plainExample: "If you retrieve ten document chunks but only six are relevant enough, a comprehension can create a clean list containing only the useful chunks.",
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
              plainExample: "If an ingestion job reads a very large log file, it can handle one line at a time instead of loading the whole file into memory first.",
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
              plainExample: "If a tool expects a question as text and context as a list of text chunks, type hints make that contract visible before the code runs.",
              code: `def build_prompt(question: str, context_chunks: list[str]) -> str:
    context = "\\n".join(context_chunks)
    return f"Use this context:\\n{context}\\n\\nQuestion: {question}"

def parse_score(raw_score: float | None) -> float:
    if raw_score is None:
        return 0.0
    return raw_score`
            }
          ],
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
            "Understand decorators conceptually"
          ]
        }
      },
      {
        n: "1.2",
        title: "Object-Oriented Python",
        items: ["Classes, __init__, instance vs class methods", "Inheritance, encapsulation, polymorphism", "Dataclasses", "Pydantic models — every agent framework uses them for tool schemas"],
        detail: {
          duration: "45–75 min",
          level: "Beginner",
          status: "Required",
          goal: "Understand enough object-oriented Python to read framework code, organize small AI apps, and use Pydantic-style models confidently.",
          whyIntro: "Object-oriented Python helps you organize AI app code without turning every script into one giant file. You will use it when you are:",
          codeLabel: "Python example",
          showCodeLabel: "Show Python code",
          hideCodeLabel: "Hide Python code",
          conceptsTitle: "OOP Concepts",
          whyItMatters: ["Agent state objects", "Tool and service classes", "Pydantic schemas", "Reusable API clients", "Cleaner project structure"],
          concepts: [
            {
              title: "Classes and __init__",
              explanation: "A class is a blueprint for creating objects. __init__ sets up the object when it is created.",
              aiUseCase: "Wrap model settings or an API client in one object instead of passing the same values everywhere.",
              plainExample: "Create one LLMClient that remembers the model name and timeout, then reuse it across your app.",
              code: `class LLMClient:
    def __init__(self, model: str):
        self.model = model

client = LLMClient(model="gpt-4.1-mini")`
            },
            {
              title: "Instance vs class methods",
              explanation: "Instance methods use data from one object. Class methods belong to the class and often create objects in a standard way.",
              aiUseCase: "Create a config object from environment settings or defaults.",
              plainExample: "A config class can create a safe default local setup without copying the same settings.",
              code: `class AppConfig:
    def __init__(self, model: str):
        self.model = model

    @classmethod
    def local(cls):
        return cls(model="gpt-4.1-mini")`
            },
            {
              title: "Inheritance, encapsulation, and polymorphism",
              explanation: "Inheritance shares behavior, encapsulation hides internal details, and polymorphism lets different objects expose the same method name.",
              aiUseCase: "Use the same interface for different model providers, retrievers, or tools.",
              plainExample: "OpenAIClient and AnthropicClient can both have a generate() method, even if they work differently inside.",
              code: `class ModelClient:
    def generate(self, prompt: str) -> str:
        raise NotImplementedError

class MockClient(ModelClient):
    def generate(self, prompt: str) -> str:
        return "fake reply"`
            },
            {
              title: "Dataclasses and Pydantic-style models",
              explanation: "Dataclasses reduce boilerplate for simple data containers. Pydantic adds validation and is common in FastAPI and tool schemas.",
              aiUseCase: "Represent a retrieved document chunk or tool input with clear fields.",
              plainExample: "A chunk should always have text and a score. A model makes that shape obvious.",
              code: `from dataclasses import dataclass

@dataclass
class Chunk:
    text: str
    score: float`
            }
          ],
          commonMistakes: [
            { mistake: "Creating classes for everything", better: "Use classes only when state or structure helps" },
            { mistake: "Putting all logic in one class", better: "Keep methods small and focused" },
            { mistake: "Ignoring simple data models", better: "Use dataclasses or Pydantic-style schemas for structured data" }
          ],
          checklist: ["Create a simple class", "Explain __init__", "Know instance vs class methods", "Explain inheritance/encapsulation/polymorphism", "Use a dataclass or Pydantic-style schema"]
        }
      },
      {
        n: "1.3",
        title: "Data Structures",
        items: ["List, Tuple, Set, Dict, NamedTuple", "collections.defaultdict, Counter, deque", "When to use which (interview territory)"],
        detail: {
          duration: "45–75 min",
          level: "Beginner",
          status: "Required",
          goal: "Choose the right Python data structure for prompts, documents, metadata, queues, and API responses.",
          whyIntro: "Data structures are how AI apps hold messages, chunks, metadata, jobs, and results. You will use them when you are:",
          codeLabel: "Python example",
          showCodeLabel: "Show Python code",
          hideCodeLabel: "Hide Python code",
          conceptsTitle: "Data Structure Concepts",
          whyItMatters: ["Store messages", "Track document metadata", "Count errors", "Remove duplicates", "Build retrieval context"],
          concepts: [
            {
              title: "Lists, tuples, sets, and dicts",
              explanation: "Lists keep ordered items, tuples are fixed lightweight groups, sets remove duplicates, and dicts map keys to values.",
              aiUseCase: "Store chat messages in a list, metadata in a dict, and unique source IDs in a set.",
              plainExample: "If a RAG answer cites the same document twice, a set can keep only one source ID.",
              code: `messages = ["hello", "what is rag?"]
metadata = {"source": "handbook.pdf", "page": 4}
source_ids = {"doc-1", "doc-1", "doc-2"}`
            },
            {
              title: "Counter and defaultdict",
              explanation: "Counter counts repeated values. defaultdict gives missing keys a default value automatically.",
              aiUseCase: "Count tool failures or group chunks by source document.",
              plainExample: "If one tool fails ten times today, Counter makes that obvious quickly.",
              code: `from collections import Counter, defaultdict

errors = Counter(["timeout", "timeout", "rate_limit"])
chunks_by_doc = defaultdict(list)`
            },
            {
              title: "deque for queues",
              explanation: "deque is useful when you add and remove items from both ends efficiently.",
              aiUseCase: "Process document chunks or retry jobs in order.",
              plainExample: "A small ingestion worker can pop the next document from a queue and process it.",
              code: `from collections import deque

jobs = deque(["doc1.pdf", "doc2.pdf"])
next_job = jobs.popleft()`
            },
            {
              title: "NamedTuple and when to use which",
              explanation: "NamedTuple is a lightweight fixed shape. Use lists for ordered values, dicts for lookup, sets for uniqueness, and named tuples for simple records.",
              aiUseCase: "Return a small retrieval result with a text value and score.",
              plainExample: "If every search result needs text and score, a named tuple makes that shape clear.",
              code: `from typing import NamedTuple

class SearchHit(NamedTuple):
    text: str
    score: float`
            }
          ],
          commonMistakes: [
            { mistake: "Using lists for everything", better: "Use dicts for lookup, sets for uniqueness, queues for ordered work" },
            { mistake: "Mutating shared data accidentally", better: "Copy data when passing it between steps if needed" },
            { mistake: "Choosing clever structures too early", better: "Start simple and change when the data access pattern is clear" }
          ],
          checklist: ["Pick list vs dict vs set", "Use Counter for counts", "Use defaultdict for grouping", "Understand deque basics", "Use NamedTuple for simple fixed records"]
        }
      },
      {
        n: "1.4",
        title: "Error & File Handling",
        items: ["try/except/finally", "Custom exception classes", "Context managers (with, contextlib)", "Reading/writing JSON, CSV, plain text, binary"],
        detail: {
          duration: "45–75 min",
          level: "Beginner",
          status: "Required",
          goal: "Handle bad inputs, failed files, and recoverable errors without crashing the whole AI workflow.",
          whyIntro: "Production AI apps deal with messy files and unreliable inputs. You will use this when you are:",
          codeLabel: "Python example",
          showCodeLabel: "Show Python code",
          hideCodeLabel: "Hide Python code",
          conceptsTitle: "Error And File Concepts",
          whyItMatters: ["Read prompts and datasets", "Load document files", "Save eval results", "Recover from bad input", "Debug production failures"],
          concepts: [
            {
              title: "try / except / finally",
              explanation: "try runs risky code, except handles failure, and finally runs cleanup.",
              aiUseCase: "If a document parser fails, mark the file as failed instead of stopping the whole ingestion job.",
              plainExample: "One broken PDF should not block 500 other documents from being processed.",
              code: `try:
    text = parse_pdf("contract.pdf")
except Exception as error:
    text = ""
    print(f"Parse failed: {error}")`
            },
            {
              title: "Custom exception classes",
              explanation: "A custom exception gives a failure a clear name so callers can handle it intentionally.",
              aiUseCase: "Raise a specific error when a document cannot be parsed or a prompt is invalid.",
              plainExample: "InvalidPromptError is easier to understand than a generic Exception.",
              code: `class InvalidPromptError(Exception):
    pass

if not prompt.strip():
    raise InvalidPromptError("Prompt is empty")`
            },
            {
              title: "Context managers",
              explanation: "with opens a resource and closes it safely when the block finishes.",
              aiUseCase: "Read prompt templates, JSON config, or small eval files safely.",
              plainExample: "Open a file, read it, and let Python close it even if something goes wrong.",
              code: `with open("prompt.txt", "r") as file:
    prompt_template = file.read()`
            },
            {
              title: "JSON, CSV, text, and binary files",
              explanation: "JSON is common for structured app data, CSV for tables, text for prompts/logs, and binary mode for PDFs or images.",
              aiUseCase: "Store eval cases, prompt templates, logs, or uploaded documents.",
              plainExample: "A golden dataset can be JSON, while uploaded PDFs must be read as binary.",
              code: `import json

with open("eval_cases.json", "r") as file:
    cases = json.load(file)`
            }
          ],
          commonMistakes: [
            { mistake: "Catching every error silently", better: "Log enough detail to debug the failure" },
            { mistake: "Forgetting to close files", better: "Use with for file operations" },
            { mistake: "Treating all parse failures the same", better: "Track failed file name and reason" }
          ],
          checklist: ["Use try/except safely", "Raise a custom exception", "Read files with with", "Load JSON/CSV/text/binary files", "Handle a failed file without crashing"]
        }
      },
      {
        n: "1.5",
        title: "Working with HTTP APIs",
        items: ["The requests library", "HTTP verbs, headers, status codes", "Authentication (Bearer tokens, API keys)", "Rate limits, retries, exponential backoff with tenacity"],
        detail: {
          duration: "60–90 min",
          level: "Beginner",
          status: "Required",
          goal: "Understand the HTTP basics needed to call LLM APIs, internal services, and third-party tools safely.",
          whyIntro: "Most AI systems talk to model providers, databases, and tools over HTTP. You will use this when you are:",
          codeLabel: "Python example",
          showCodeLabel: "Show Python code",
          hideCodeLabel: "Hide Python code",
          conceptsTitle: "API Concepts",
          whyItMatters: ["Call LLM providers", "Send tool requests", "Handle auth headers", "Retry rate limits", "Debug failed API calls"],
          concepts: [
            {
              title: "Requests, verbs, and status codes",
              explanation: "GET reads data, POST sends data, and status codes tell you what happened.",
              aiUseCase: "Call a model endpoint and handle success, bad requests, or server errors.",
              plainExample: "A 200 means the call worked. A 401 likely means auth failed. A 429 means slow down.",
              code: `import requests

response = requests.get("https://api.example.com/health")
print(response.status_code)`
            },
            {
              title: "Headers and API keys",
              explanation: "Headers send metadata such as content type and authorization.",
              aiUseCase: "Most LLM APIs require an Authorization header with a token.",
              plainExample: "The API key proves your app is allowed to use the model service.",
              code: `headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.post(url, headers=headers, json={"prompt": "Hi"})`
            },
            {
              title: "Authentication with bearer tokens",
              explanation: "Bearer tokens are a common way to prove API access. Keep them out of source code.",
              aiUseCase: "Send provider keys or internal service tokens safely through environment variables.",
              plainExample: "Your code reads the key from the environment, then sends it in the Authorization header.",
              code: `import os

api_key = os.environ["OPENAI_API_KEY"]
headers = {"Authorization": f"Bearer {api_key}"}`
            },
            {
              title: "Retries, rate limits, and exponential backoff",
              explanation: "External APIs fail. Retry only safe failures, wait longer between attempts, and respect rate limits.",
              aiUseCase: "Retry temporary LLM timeouts without sending unlimited duplicate requests.",
              plainExample: "If the provider says 429, wait before trying again instead of hammering the API.",
              code: `for attempt in range(3):
    response = requests.post(url, json=payload)
    if response.status_code != 429:
        break`
            }
          ],
          commonMistakes: [
            { mistake: "Hardcoding API keys", better: "Use environment variables or a secrets manager" },
            { mistake: "Ignoring status codes", better: "Branch behavior by 200, 400, 401, 429, and 500-level errors" },
            { mistake: "Retrying forever", better: "Set max attempts and timeouts" }
          ],
          checklist: ["Make GET and POST calls", "Send headers", "Use bearer token auth", "Read status codes", "Handle rate limits with backoff"]
        }
      },
      {
        n: "1.6",
        title: "Database Connectivity",
        items: ["psycopg2 for raw PostgreSQL", "SQLAlchemy ORM basics", "Connection pooling and why it matters under load", "Raw SQL when the ORM gets in the way"],
        detail: {
          duration: "60–90 min",
          level: "Beginner",
          status: "Required",
          goal: "Connect Python code to a database and understand when to use raw SQL, an ORM, and connection pooling.",
          whyIntro: "AI apps still need durable data: users, messages, documents, evals, and agent state. You will use this when you are:",
          codeLabel: "SQL/Python example",
          showCodeLabel: "Show code",
          hideCodeLabel: "Hide code",
          conceptsTitle: "Database Concepts",
          whyItMatters: ["Store users and chats", "Save agent state", "Query business data", "Track eval runs", "Support production APIs"],
          concepts: [
            {
              title: "psycopg2 and raw PostgreSQL",
              explanation: "psycopg2 is a common low-level PostgreSQL driver. Raw SQL gives direct control over exactly what query runs.",
              aiUseCase: "Fetch a user conversation or retrieve rows for a text-to-SQL agent.",
              plainExample: "Ask Postgres for the latest 10 messages in a conversation.",
              code: `cursor.execute(
    "SELECT content FROM messages WHERE conversation_id = %s",
    (conversation_id,)
)`
            },
            {
              title: "ORM basics",
              explanation: "An ORM maps database rows to Python objects and can reduce repetitive SQL.",
              aiUseCase: "Represent users, messages, documents, and eval runs as Python models.",
              plainExample: "Instead of writing SQL every time, ask for Message objects from the database.",
              code: `messages = session.query(Message).filter_by(
    conversation_id=conversation_id
).all()`
            },
            {
              title: "Connection pooling",
              explanation: "A pool reuses database connections instead of opening a new one for every request.",
              aiUseCase: "Keep a FastAPI app stable when many users chat at once.",
              plainExample: "Without pooling, traffic spikes can exhaust database connections quickly.",
              code: `engine = create_engine(database_url, pool_size=5, max_overflow=10)`
            },
            {
              title: "Raw SQL when the ORM gets in the way",
              explanation: "ORMs are convenient, but raw SQL can be clearer for complex joins, analytics, and performance tuning.",
              aiUseCase: "Use raw SQL for a text-to-SQL validator or a complex reporting query.",
              plainExample: "If an ORM query becomes unreadable, write the SQL directly and parameterize it.",
              code: `cursor.execute(
    "SELECT user_id, COUNT(*) FROM messages GROUP BY user_id"
)`
            }
          ],
          commonMistakes: [
            { mistake: "Opening a new connection per request", better: "Use pooling through your database library" },
            { mistake: "Building SQL with string formatting", better: "Use parameters to avoid injection" },
            { mistake: "Using ORM for complex queries blindly", better: "Use raw SQL when it is clearer or faster" }
          ],
          checklist: ["Run a parameterized query", "Explain ORM basics", "Know why pooling matters", "Use raw SQL when it is clearer", "Avoid SQL injection"]
        }
      },
      {
        n: "1.7",
        title: "FastAPI",
        items: ["First /chat endpoint", "Pydantic request/response models", "Dependency injection", "Automatic OpenAPI docs", "Running with uvicorn"],
        detail: {
          duration: "60–90 min",
          level: "Beginner",
          status: "Required",
          goal: "Build a small API endpoint that can receive user input, validate it, and return a structured response.",
          whyIntro: "FastAPI is a practical way to expose AI features to frontends, tools, and other services. You will use it when you are:",
          codeLabel: "Python example",
          showCodeLabel: "Show Python code",
          hideCodeLabel: "Hide Python code",
          conceptsTitle: "FastAPI Concepts",
          whyItMatters: ["Expose AI features", "Validate requests", "Return structured responses", "Generate API docs", "Deploy chat backends"],
          concepts: [
            {
              title: "Routes and endpoints",
              explanation: "A route connects a URL and HTTP method to a Python function.",
              aiUseCase: "Create a /chat endpoint that accepts a message and returns a reply.",
              plainExample: "When a frontend sends a chat message, FastAPI routes it to the chat function.",
              code: `from fastapi import FastAPI

app = FastAPI()

@app.post("/chat")
def chat(message: str):
    return {"reply": message}`
            },
            {
              title: "Request and response models",
              explanation: "Models describe the shape of data your API accepts and returns.",
              aiUseCase: "Require a message field and return a predictable reply shape.",
              plainExample: "The frontend should always know where the response text lives.",
              code: `from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str`
            },
            {
              title: "Dependencies and docs",
              explanation: "Dependencies share common logic, and FastAPI automatically creates OpenAPI docs.",
              aiUseCase: "Reuse auth, database access, or model clients across endpoints.",
              plainExample: "One dependency can provide the same LLM client to every route.",
              code: `def get_model_name():
    return "gpt-4.1-mini"`
            },
            {
              title: "Running with uvicorn",
              explanation: "uvicorn runs your FastAPI app locally or inside a server process.",
              aiUseCase: "Start a local AI API backend while testing a frontend or agent flow.",
              plainExample: "Run the server, open /docs, and test the chat endpoint.",
              code: `uvicorn app:app --reload`
            }
          ],
          commonMistakes: [
            { mistake: "Accepting unvalidated dicts", better: "Use request models" },
            { mistake: "Putting all logic in the route", better: "Call helper functions or services" },
            { mistake: "Ignoring API docs", better: "Use /docs to test endpoints quickly" }
          ],
          checklist: ["Create a route", "Use a request model", "Use a dependency", "Open automatic docs", "Run with uvicorn"]
        }
      },
      {
        n: "1.8",
        title: "Async Programming",
        items: ["asyncio fundamentals — event loop, coroutines", "async/await syntax", "asyncio.gather for parallel LLM calls", "asyncio.wait_for for timeout protection", "asyncio.create_task for fire-and-forget logging"],
        detail: {
          duration: "60–90 min",
          level: "Intermediate",
          status: "Required",
          goal: "Use async Python to run slow network work without blocking the whole AI app.",
          whyIntro: "LLM calls, retrieval, and API requests are slow network work. Async Python helps keep apps responsive when you are:",
          codeLabel: "Python example",
          showCodeLabel: "Show Python code",
          hideCodeLabel: "Hide Python code",
          conceptsTitle: "Async Concepts",
          whyItMatters: ["Call multiple LLMs", "Run retrieval in parallel", "Avoid blocking APIs", "Handle timeouts", "Log in the background"],
          concepts: [
            {
              title: "Event loop and coroutines",
              explanation: "The event loop schedules async work. Coroutines are async functions waiting to run.",
              aiUseCase: "Let many slow model or retrieval calls share one server process efficiently.",
              plainExample: "While one request waits for an API, the event loop can start work on another request.",
              code: `async def fetch_context(question: str):
    return await retriever.search(question)`
            },
            {
              title: "async and await",
              explanation: "async defines a coroutine. await pauses until an async operation finishes without blocking other work.",
              aiUseCase: "Wait for a model call while the server can still handle other requests.",
              plainExample: "The app should not freeze just because one provider is slow.",
              code: `async def call_model(prompt: str) -> str:
    result = await client.generate(prompt)
    return result`
            },
            {
              title: "Running work in parallel",
              explanation: "asyncio.gather runs multiple async tasks and waits for all of them.",
              aiUseCase: "Call retrieval, moderation, and model routing checks at the same time.",
              plainExample: "Three independent checks can finish in one second instead of three.",
              code: `results = await asyncio.gather(
    search_docs(question),
    check_policy(question),
    classify_intent(question),
)`
            },
            {
              title: "Timeouts and background tasks",
              explanation: "wait_for stops slow calls from hanging forever. create_task starts non-critical work in the background.",
              aiUseCase: "Fail gracefully if a model call is too slow, but still log the request.",
              plainExample: "If a provider takes 30 seconds, return a friendly timeout instead of spinning forever.",
              code: `reply = await asyncio.wait_for(
    call_model(prompt),
    timeout=10
)`
            }
          ],
          commonMistakes: [
            { mistake: "Mixing blocking calls inside async code", better: "Use async libraries for network work" },
            { mistake: "No timeout", better: "Set a timeout around external calls" },
            { mistake: "Parallelizing dependent steps", better: "Only gather independent work" }
          ],
          checklist: ["Explain event loop and coroutines", "Use async/await", "Use gather", "Add a timeout", "Use background tasks carefully"]
        }
      },
      {
        n: "1.9",
        title: "Git + GitHub Workflows",
        items: ["Git basics: clone, branch, commit, merge, rebase", "Pull requests, code review, issues, and project boards", "Resolving merge conflicts without panic", "README-driven portfolio repos — architecture, setup, screenshots, eval numbers"],
        detail: {
          duration: "45–75 min",
          level: "Beginner",
          status: "Required",
          goal: "Use Git and GitHub well enough to work on real teams and present portfolio projects professionally.",
          whyIntro: "Git and GitHub are how real engineering work is shared, reviewed, and shipped. You will use them when you are:",
          codeLabel: "Git command",
          showCodeLabel: "Show command",
          hideCodeLabel: "Hide command",
          conceptsTitle: "Git Workflow Concepts",
          whyItMatters: ["Every job expects it", "Review AI app changes", "Track experiments", "Collaborate on PRs", "Maintain portfolio repos"],
          concepts: [
            {
              title: "Clone, branch, commit, and push",
              explanation: "clone downloads a repo, a branch isolates work, a commit saves a snapshot, and push uploads it to GitHub.",
              aiUseCase: "Work on a new RAG feature without breaking main.",
              plainExample: "Make a branch for eval changes, commit them, then push for review.",
              code: `git clone https://github.com/you/app.git
git checkout -b add-rag-evals
git add .
git commit -m "Add RAG eval cases"
git push`
            },
            {
              title: "Pull requests and review",
              explanation: "A pull request proposes changes and lets teammates review them before merge.",
              aiUseCase: "Show what changed in prompts, retrieval, tests, and deployment config.",
              plainExample: "A reviewer can catch an unsafe tool permission before it reaches production.",
              code: `# Open a PR from your pushed branch on GitHub`
            },
            {
              title: "Merge, rebase, and conflicts",
              explanation: "merge combines branches, rebase replays your work on newer code, and conflicts happen when Git needs a human choice.",
              aiUseCase: "Keep your AI feature branch updated while teammates change the same files.",
              plainExample: "If two people edit the prompt file, Git may ask which version to keep.",
              code: `git pull --rebase
git status`
            },
            {
              title: "Issues and project boards",
              explanation: "Issues track work, bugs, and decisions. Boards organize what is planned, in progress, and done.",
              aiUseCase: "Track tasks like add evals, improve retrieval, fix latency, and update README.",
              plainExample: "Each capstone should have issues for setup, ingestion, evals, deployment, and demo polish.",
              code: `# Use GitHub Issues for task tracking`
            },
            {
              title: "READMEs for portfolio projects",
              explanation: "A good README explains the problem, architecture, setup, screenshots, and evaluation results.",
              aiUseCase: "Recruiters and hiring managers need proof that your AI app actually works.",
              plainExample: "Your repo should answer: what it does, how it works, how to run it, and how well it performs.",
              code: `# Project README sections
# Problem
# Architecture
# Setup
# Evaluation
# Demo`
            }
          ],
          commonMistakes: [
            { mistake: "Committing directly to main", better: "Use feature branches" },
            { mistake: "Huge unclear commits", better: "Make focused commits with useful messages" },
            { mistake: "Empty portfolio READMEs", better: "Show architecture, setup, screenshots, and eval numbers" }
          ],
          checklist: ["Clone a repo", "Create a branch and commit", "Open a pull request", "Handle merge/rebase conflicts", "Use issues/project boards", "Write a useful README"]
        }
      },
      {
        n: "1.10",
        title: "Linux + Shell Basics",
        items: ["Navigation, permissions, processes, environment variables", "grep/rg, find, awk/sed basics for logs and data files", "SSH into a server, tail logs, inspect disk/memory/ports", "Shell scripts for repeatable local workflows"],
        detail: {
          duration: "45–75 min",
          level: "Beginner",
          status: "Required",
          goal: "Use the terminal confidently enough to run apps, inspect logs, debug servers, and automate simple workflows.",
          whyIntro: "AI apps eventually run in terminals, containers, servers, and CI logs. You will use shell basics when you are:",
          codeLabel: "Shell command",
          showCodeLabel: "Show command",
          hideCodeLabel: "Hide command",
          conceptsTitle: "Shell Concepts",
          whyItMatters: ["Run dev servers", "Inspect logs", "Manage env vars", "Debug Docker and cloud apps", "Automate repeatable commands"],
          concepts: [
            {
              title: "Navigation and files",
              explanation: "Basic commands let you move around, list files, read files, and understand where you are.",
              aiUseCase: "Find logs, prompt files, configs, and datasets quickly.",
              plainExample: "When an app fails, first confirm you are in the right folder and the config file exists.",
              code: `pwd
ls
cd app
cat .env.example`
            },
            {
              title: "Permissions",
              explanation: "Permissions control who can read, write, or execute files.",
              aiUseCase: "Fix scripts that cannot run or protect secret files from broad access.",
              plainExample: "If a setup script says permission denied, it may need execute permission.",
              code: `chmod +x setup.sh
ls -l setup.sh`
            },
            {
              title: "Environment variables",
              explanation: "Environment variables store settings outside code, such as API keys and model names.",
              aiUseCase: "Configure model providers without committing secrets.",
              plainExample: "Your app reads OPENAI_API_KEY from the environment instead of from source code.",
              code: `export MODEL_NAME="gpt-4.1-mini"
echo $MODEL_NAME`
            },
            {
              title: "Search commands for logs and files",
              explanation: "rg, grep, find, awk, and sed help you search and reshape text quickly.",
              aiUseCase: "Find errors in logs, locate prompt files, or inspect generated outputs.",
              plainExample: "Search all logs for timeout before changing code.",
              code: `rg "timeout" logs/
find . -name "*.json"`
            },
            {
              title: "SSH, logs, processes, and ports",
              explanation: "Shell commands help you connect to servers and see what is running or failing.",
              aiUseCase: "Check API errors, see whether a server is running, or find a busy port.",
              plainExample: "If localhost is not loading, check whether the server process is actually running.",
              code: `ssh user@server
tail -f app.log
ps aux | grep uvicorn
lsof -i :8000`
            },
            {
              title: "Shell scripts",
              explanation: "Shell scripts save repeatable command sequences in one file.",
              aiUseCase: "Run setup, tests, seed data, or local servers consistently.",
              plainExample: "A run-local.sh script helps you start the same app the same way every time.",
              code: `#!/usr/bin/env bash
python -m pytest
uvicorn app:app --reload`
            }
          ],
          commonMistakes: [
            { mistake: "Pasting commands without reading them", better: "Understand what each command changes" },
            { mistake: "Committing .env files", better: "Commit .env.example, not secrets" },
            { mistake: "Ignoring logs", better: "Read the error before changing code" }
          ],
          checklist: ["Navigate files", "Understand permissions", "Use env vars", "Search logs/files", "SSH and read logs", "Write a small shell script"]
        }
      },
      {
        n: "1.11",
        title: "Testing Fundamentals",
        items: ["pytest unit tests for pure Python functions", "FastAPI integration tests with test clients", "Mocking LLM/API calls without hiding failures", "Golden-file and regression tests for prompts, retrieval, and eval outputs"],
        detail: {
          duration: "60–90 min",
          level: "Beginner",
          status: "Required",
          goal: "Write small tests that catch broken helper functions, API routes, prompts, and evaluation workflows before users do.",
          whyIntro: "Testing keeps AI apps from breaking silently when prompts, retrieval, or APIs change. You will use it when you are:",
          codeLabel: "Python test example",
          showCodeLabel: "Show test code",
          hideCodeLabel: "Hide test code",
          conceptsTitle: "Testing Concepts",
          whyItMatters: ["Prevent regressions", "Test prompt helpers", "Check API routes", "Validate eval datasets", "Ship AI apps with more confidence"],
          concepts: [
            {
              title: "Unit tests",
              explanation: "Unit tests check one small function with known inputs and outputs.",
              aiUseCase: "Test prompt cleaning, chunk formatting, or routing rules without calling an LLM.",
              plainExample: "If clean_input breaks, you want to know before it corrupts every prompt.",
              code: `def test_clean_input():
    assert clean_input("  hi  ") == "hi"`
            },
            {
              title: "Integration tests",
              explanation: "Integration tests check that multiple parts work together.",
              aiUseCase: "Call a FastAPI endpoint and verify the JSON shape.",
              plainExample: "The route should accept a message and return a reply field every time.",
              code: `def test_chat_endpoint(client):
    response = client.post("/chat", json={"message": "hi"})
    assert response.status_code == 200`
            },
            {
              title: "Golden tests and mocks",
              explanation: "Golden tests compare output against expected examples. Mocks replace slow or expensive services in tests.",
              aiUseCase: "Test retrieval formatting or prompt assembly without spending money on model calls.",
              plainExample: "Use fixed fake model output so the test is stable and cheap.",
              code: `expected = "Context:\\nchunk one"
assert build_context(["chunk one"]) == expected`
            },
            {
              title: "Eval regression tests",
              explanation: "Eval regression tests make sure prompt, retrieval, or output changes do not break known examples.",
              aiUseCase: "Run a small golden dataset before merging a RAG change.",
              plainExample: "If a known question used to cite the right document, the test should catch when it stops.",
              code: `def test_expected_source():
    answer = run_rag("What is the refund policy?")
    assert "policy.pdf" in answer.sources`
            }
          ],
          commonMistakes: [
            { mistake: "Only testing happy paths", better: "Test empty input, bad input, and failures" },
            { mistake: "Calling real LLMs in unit tests", better: "Mock model calls for fast, stable tests" },
            { mistake: "Testing too much at once", better: "Start with small helper-function tests" }
          ],
          checklist: ["Write a unit test", "Test a FastAPI route", "Mock an external call", "Add a golden test", "Add one eval regression test"]
        }
      }
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
      {
        n: "2.1",
        title: "What an LLM actually is",
        items: ["Trained on a fixed snapshot", "Knowledge cutoff dates and what they imply", "Probabilistic generation, not retrieval", "Why the same prompt gives different outputs"],
        detail: {
          duration: "30–45 min",
          level: "Beginner",
          status: "Required",
          goal: "Understand what LLMs can and cannot know so you stop treating them like databases.",
          whyIntro: "This mental model prevents bad architecture decisions. You will use it when you are:",
          conceptsTitle: "LLM Basics",
          whyItMatters: ["Explaining hallucinations", "Designing RAG systems", "Choosing when to retrieve data", "Debugging inconsistent answers"],
          concepts: [
            {
              title: "Trained on a fixed snapshot",
              explanation: "A base model learns patterns from training data up to a point in time. It does not automatically know private, new, or changed facts.",
              aiUseCase: "Use retrieval or tools when the answer depends on recent, private, or company-specific data.",
              plainExample: "A model may know general Python, but not your latest internal policy document."
            },
            {
              title: "Knowledge cutoffs",
              explanation: "A cutoff is the approximate boundary of what the model may have seen during training.",
              aiUseCase: "Avoid asking the model for fresh prices, current policies, or new documentation without a live source.",
              plainExample: "If a library changed last month, browse docs or retrieve docs instead of trusting memory."
            },
            {
              title: "Probabilistic generation",
              explanation: "LLMs predict likely next tokens. They generate plausible text, not guaranteed truth.",
              aiUseCase: "Add citations, validation, and evals for factual workflows.",
              plainExample: "A fluent answer can still be wrong if the model is guessing."
            },
            {
              title: "Same prompt, different output",
              explanation: "Sampling settings and model behavior can produce different answers for similar or identical prompts.",
              aiUseCase: "Use low temperature, structured outputs, tests, and guardrails when consistency matters.",
              plainExample: "A support bot should not give three different refund policies for the same question."
            }
          ],
          commonMistakes: [
            { mistake: "Treating the model like a database", better: "Use retrieval/tools for facts that must be current or private" },
            { mistake: "Trusting fluent answers blindly", better: "Ask for evidence or validate outputs" },
            { mistake: "Ignoring nondeterminism", better: "Use settings and tests for repeatable workflows" }
          ],
          checklist: ["Explain training snapshots", "Explain knowledge cutoffs", "Explain why hallucinations happen", "Know when retrieval is needed"]
        }
      },
      {
        n: "2.2",
        title: "How an LLM thinks",
        items: ["BPE tokenization — why \"hello\" is 1 token but \"antidisestablishmentarianism\" is 6", "Context windows — what fits, what gets silently truncated", "Sampling parameters: temperature, top-p, top-k — when to set what", "Transformer at 30,000 feet — attention preserves position, no math, no multi-head diagrams", "Why long context degrades (\"lost in the middle\")"],
        detail: {
          duration: "45–60 min",
          level: "Beginner",
          status: "Required",
          goal: "Understand the practical mechanics that affect prompt length, cost, output style, and reliability.",
          whyIntro: "You do not need transformer math, but you need the operating model. You will use this when you are:",
          conceptsTitle: "LLM Mechanics",
          whyItMatters: ["Budgeting tokens", "Writing prompts", "Handling long docs", "Tuning output randomness", "Debugging missed context"],
          concepts: [
            {
              title: "Tokenization",
              explanation: "Models read text as tokens, not characters or words. Some words are one token, others split into many.",
              aiUseCase: "Estimate prompt cost and avoid oversized context.",
              plainExample: "A long legal document can become expensive because every token counts."
            },
            {
              title: "Context windows",
              explanation: "The context window is the maximum text the model can consider at once.",
              aiUseCase: "Decide how much chat history, retrieved context, and system instruction to include.",
              plainExample: "If you stuff too much into the prompt, important content may be truncated or ignored."
            },
            {
              title: "Sampling parameters",
              explanation: "Temperature, top-p, and top-k affect how varied or conservative the output is.",
              aiUseCase: "Use lower randomness for support answers and higher randomness for brainstorming.",
              plainExample: "A billing assistant should be consistent; an idea generator can be more creative."
            },
            {
              title: "Attention and lost-in-the-middle",
              explanation: "Attention helps the model use context, but long prompts can still make middle sections less reliable.",
              aiUseCase: "Place critical instructions and high-value context where the model is more likely to use them.",
              plainExample: "A key policy buried in the middle of a long prompt may be missed."
            }
          ],
          commonMistakes: [
            { mistake: "Ignoring token limits", better: "Budget system prompt, history, retrieved context, and output" },
            { mistake: "Using high temperature for factual work", better: "Keep factual workflows conservative" },
            { mistake: "Dumping huge context blindly", better: "Retrieve and rank the most relevant context" }
          ],
          checklist: ["Explain tokens", "Explain context windows", "Pick reasonable sampling settings", "Explain lost-in-the-middle"]
        }
      },
      {
        n: "2.3",
        title: "Reasoning models vs base models",
        items: ["The 2025 split: o1 / o3, Claude 3.7 thinking, Gemini 2.5 thinking, DeepSeek R1, Qwen QwQ", "What \"thinking tokens\" actually are and why they're billed", "When reasoning models are worth the latency and cost", "Reasoning effort knobs (low / medium / high) and how to budget them", "When a base model + good prompting beats a thinking model"],
        detail: {
          duration: "45–60 min",
          level: "Beginner",
          status: "Required",
          goal: "Know when to pay for reasoning and when a faster cheaper base model is enough.",
          whyIntro: "Reasoning models are powerful but not free. You will use this judgment when you are:",
          conceptsTitle: "Reasoning Model Concepts",
          whyItMatters: ["Routing tasks", "Controlling latency", "Managing cost", "Improving hard workflows"],
          concepts: [
            {
              title: "Base vs reasoning models",
              explanation: "Base/chat models are usually faster and cheaper. Reasoning models spend more compute on hard multi-step problems.",
              aiUseCase: "Route simple classification to a cheaper model and complex planning to a reasoning model.",
              plainExample: "Do not use a reasoning model to trim whitespace from a prompt."
            },
            {
              title: "Thinking tokens and cost",
              explanation: "Some reasoning models spend hidden or visible tokens working through the problem, and those tokens can affect cost and latency.",
              aiUseCase: "Budget for difficult tasks like code repair, planning, math, or multi-step analysis.",
              plainExample: "A better answer may cost more and take longer."
            },
            {
              title: "Reasoning effort knobs",
              explanation: "Some APIs let you choose lower or higher reasoning effort.",
              aiUseCase: "Use low effort for routine checks and higher effort for expensive decisions.",
              plainExample: "A quick summary may need low effort; a migration plan may need high effort."
            },
            {
              title: "When base + prompting wins",
              explanation: "Good prompting, examples, retrieval, and tools often beat an expensive reasoning model for routine tasks.",
              aiUseCase: "Start simple before paying for more model power.",
              plainExample: "A well-structured extraction prompt can outperform an overpowered model with vague instructions."
            }
          ],
          commonMistakes: [
            { mistake: "Using reasoning models for everything", better: "Route by task difficulty" },
            { mistake: "Ignoring latency", better: "Measure user-facing response time" },
            { mistake: "Skipping prompt/data fixes", better: "Improve inputs before upgrading models" }
          ],
          checklist: ["Compare base and reasoning models", "Explain thinking-token cost", "Use effort settings intentionally", "Route simple tasks cheaply"]
        }
      },
      {
        n: "2.4",
        title: "Reading model evals & benchmarks",
        items: ["The benchmarks worth knowing — MMLU, GSM8K, HumanEval, SWE-bench, GPQA, MMMU, BFCL (function calling)", "Why benchmarks lie — contamination, prompt sensitivity, eval gaming", "How to read a leaderboard skeptically (LMArena, Artificial Analysis, Vellum, Aider)", "Building your own micro-eval for the task you actually care about"],
        detail: {
          duration: "45–60 min",
          level: "Beginner",
          status: "Required",
          goal: "Read model benchmarks skeptically and build small evals for your own task.",
          whyIntro: "Public leaderboards are useful, but your app needs its own proof. You will use this when you are:",
          conceptsTitle: "Eval Concepts",
          whyItMatters: ["Choosing models", "Testing prompts", "Comparing providers", "Avoiding leaderboard hype"],
          concepts: [
            {
              title: "Common benchmarks",
              explanation: "MMLU, GSM8K, HumanEval, SWE-bench, GPQA, MMMU, and BFCL test different capabilities.",
              aiUseCase: "Pick benchmarks related to your task instead of chasing one overall score.",
              plainExample: "A coding benchmark matters more for a coding agent than a general trivia score."
            },
            {
              title: "Why benchmarks can mislead",
              explanation: "Benchmarks can be contaminated, prompt-sensitive, or optimized by providers.",
              aiUseCase: "Treat benchmark scores as a signal, not a guarantee.",
              plainExample: "A model can rank high publicly and still fail your document workflow."
            },
            {
              title: "Reading leaderboards skeptically",
              explanation: "Look at task type, sample size, cost, latency, and whether the benchmark resembles your use case.",
              aiUseCase: "Compare LMArena, Artificial Analysis, Vellum, and Aider results without over-trusting one source.",
              plainExample: "A model that users prefer in chat may not be best for structured JSON extraction."
            },
            {
              title: "Build your own micro-eval",
              explanation: "A micro-eval is a small test set that reflects the exact workflow you care about.",
              aiUseCase: "Compare models on 20 real support questions or 30 extraction cases.",
              plainExample: "Your refund-policy eval matters more than a generic leaderboard."
            }
          ],
          commonMistakes: [
            { mistake: "Picking models from one leaderboard", better: "Compare on your real task" },
            { mistake: "Ignoring cost and latency", better: "Measure quality, cost, and speed together" },
            { mistake: "No regression eval", better: "Keep a small test set for every prompt/model change" }
          ],
          checklist: ["Name key benchmarks", "Explain benchmark weaknesses", "Read leaderboards skeptically", "Design one micro-eval"]
        }
      },
      {
        n: "2.5",
        title: "Comparing the major models",
        items: ["GPT family, Claude family, Gemini, Llama, Mistral, DeepSeek, Qwen", "Cost vs quality vs speed vs context-length tradeoffs", "When model choice matters vs when it really doesn't"],
        detail: {
          duration: "30–45 min",
          level: "Beginner",
          status: "Required",
          goal: "Compare model families by practical tradeoffs instead of brand preference.",
          whyIntro: "Model choice affects cost, reliability, latency, and deployment options. You will use this when you are:",
          conceptsTitle: "Model Comparison Concepts",
          whyItMatters: ["Choosing providers", "Routing requests", "Budgeting costs", "Planning fallbacks"],
          concepts: [
            {
              title: "Major model families",
              explanation: "GPT, Claude, Gemini, Llama, Mistral, DeepSeek, and Qwen each have different strengths, APIs, pricing, and deployment options.",
              aiUseCase: "Shortlist models that fit your task, budget, and hosting constraints.",
              plainExample: "A regulated app may care about hosting and data controls as much as raw quality."
            },
            {
              title: "Cost, quality, speed, and context",
              explanation: "No model wins everything. Stronger models often cost more or respond slower.",
              aiUseCase: "Use cheap fast models for easy work and stronger models for hard work.",
              plainExample: "Classify intent cheaply, then use a stronger model only for complex answers."
            },
            {
              title: "When model choice matters",
              explanation: "Model choice matters for hard reasoning, coding, strict formatting, long context, and safety-critical work.",
              aiUseCase: "Upgrade the model when failures are caused by capability, not by bad prompts or missing context.",
              plainExample: "If retrieval is wrong, switching models may not fix the answer."
            }
          ],
          commonMistakes: [
            { mistake: "Choosing by hype", better: "Run a small eval on your task" },
            { mistake: "Using one model for everything", better: "Route by difficulty and cost" },
            { mistake: "Ignoring fallback plans", better: "Have a backup model/provider for production paths" }
          ],
          checklist: ["Compare major model families", "Explain cost/quality/speed tradeoffs", "Know when model choice matters", "Design a simple routing plan"]
        }
      }
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
      {
        n: "3.1",
        title: "UI vs API — the hinge moment",
        items: ["Same prompt, same model, different output — why?", "System prompts you don't see", "Skills/tools the chat UI calls silently", "Why production work happens via API"],
        detail: {
          duration: "30–45 min",
          level: "Beginner",
          status: "Required",
          goal: "Understand why a chat UI is not the same thing as a production API integration.",
          whyIntro: "This is the point where prompting turns into engineering. You will use it when you are:",
          conceptsTitle: "UI vs API Concepts",
          whyItMatters: ["Reproducing outputs", "Debugging model behavior", "Moving demos into apps", "Controlling tools and hidden context"],
          concepts: [
            {
              title: "Same model, different wrapper",
              explanation: "A chat UI may add hidden instructions, memory, tools, safety layers, or formatting that your API call does not include.",
              aiUseCase: "When an API result differs from ChatGPT, compare the full prompt, system instructions, tools, and settings.",
              plainExample: "The UI may silently search the web, while your API call only sees the text you sent."
            },
            {
              title: "Hidden system prompts",
              explanation: "System prompts shape behavior before the user message is read.",
              aiUseCase: "Production apps need explicit system prompts so behavior is repeatable.",
              plainExample: "A support bot should always know its refund policy style, not infer it from one user question."
            },
            {
              title: "Production happens through APIs",
              explanation: "APIs let you control prompts, tools, structured output, logging, retries, cost, and security.",
              aiUseCase: "Use APIs for real apps, evals, traces, and deployment.",
              plainExample: "A demo chat is fine for exploration; a customer workflow needs code, logs, and tests."
            }
          ],
          commonMistakes: [
            { mistake: "Expecting UI and API outputs to match exactly", better: "Compare hidden context, tools, and generation settings" },
            { mistake: "Copying a chat prompt directly into code", better: "Turn it into system, user, and output contracts" },
            { mistake: "No logs for API calls", better: "Log prompt version, model, latency, tokens, and output status" }
          ],
          checklist: ["Explain UI/API differences", "Identify hidden system context", "Know why APIs are needed", "Log model calls in production"]
        }
      },
      {
        n: "3.2",
        title: "Calling LLMs via API",
        items: ["OpenAI SDK, Anthropic SDK", "Message format (system / user / assistant)", "Streaming responses", "Structured output (JSON mode, tool-call schemas, XML tags)"],
        detail: {
          duration: "60–90 min",
          level: "Beginner",
          status: "Required",
          showCodeLabel: "Show API example",
          hideCodeLabel: "Hide API example",
          codeLabel: "API example",
          goal: "Make a basic LLM API call, stream text, and request structured output.",
          whyIntro: "Almost every AI app starts here. You will use this when you are:",
          conceptsTitle: "API Calling Concepts",
          whyItMatters: ["Building chat apps", "Creating eval scripts", "Returning JSON", "Streaming responses to users"],
          concepts: [
            {
              title: "SDK clients",
              explanation: "SDKs wrap HTTP calls so you can send messages, set models, stream output, and handle errors from code.",
              aiUseCase: "Use SDK calls inside FastAPI routes, workers, eval scripts, and agent tools.",
              plainExample: "Your backend sends a user question to the model and receives an answer object.",
              code: `from openai import OpenAI\n\nclient = OpenAI()\n\nresponse = client.responses.create(\n    model=\"gpt-4.1-mini\",\n    input=\"Explain RAG in one paragraph.\"\n)\n\nprint(response.output_text)`
            },
            {
              title: "Message roles",
              explanation: "System messages set behavior, user messages carry user input, and assistant messages can preserve conversation context.",
              aiUseCase: "Separate app instructions from user data so the model has a stable contract.",
              plainExample: "The system says 'answer as a support assistant'; the user asks the actual question.",
              code: `messages = [\n    {\"role\": \"system\", \"content\": \"You are a concise AI tutor.\"},\n    {\"role\": \"user\", \"content\": \"What is tokenization?\"}\n]`
            },
            {
              title: "Structured output",
              explanation: "Structured output asks the model for predictable data instead of a loose paragraph.",
              aiUseCase: "Return JSON for classification, extraction, routing, and downstream code.",
              plainExample: "Instead of 'this sounds urgent', return {\"priority\": \"high\"}.",
              code: `expected = {\n    \"intent\": \"refund_request\",\n    \"priority\": \"high\",\n    \"needs_human\": True\n}`
            },
            {
              title: "Streaming responses",
              explanation: "Streaming sends partial output as it is generated, improving perceived speed.",
              aiUseCase: "Use streaming for chat UIs, long answers, and demos where waiting feels broken.",
              plainExample: "The user sees words appear instead of staring at a spinner."
            }
          ],
          commonMistakes: [
            { mistake: "Hardcoding API keys", better: "Use environment variables and secret stores" },
            { mistake: "Parsing free text as if it were JSON", better: "Request structured output and validate it" },
            { mistake: "No timeout or retry policy", better: "Handle rate limits, timeouts, and provider failures" }
          ],
          checklist: ["Make one SDK call", "Use system/user roles", "Request structured output", "Understand streaming"]
        }
      },
      {
        n: "3.3",
        title: "Prompt anatomy",
        items: ["System prompt vs user turn vs assistant prefill", "Role and persona assignment", "Positive framing over negative constraints", "Markdown vs XML structure"],
        detail: {
          duration: "45–60 min",
          level: "Beginner",
          status: "Required",
          showCodeLabel: "Show prompt example",
          hideCodeLabel: "Hide prompt example",
          codeLabel: "Prompt example",
          goal: "Structure prompts so instructions, context, and user input are clearly separated.",
          whyIntro: "Prompt structure is a reliability tool. You will use it when you are:",
          conceptsTitle: "Prompt Anatomy",
          whyItMatters: ["Reducing ambiguity", "Defending against messy input", "Improving formatting", "Making prompts testable"],
          concepts: [
            {
              title: "System vs user",
              explanation: "System instructions define app behavior. User content is data that should not rewrite those rules.",
              aiUseCase: "Keep policies, style, and output rules outside the user message.",
              plainExample: "The user can ask anything, but the app still follows your system contract.",
              code: `SYSTEM = \"\"\"You are a support assistant.\nFollow company policy. Return concise answers.\n\"\"\"\n\nUSER = \"Where is my refund?\"`
            },
            {
              title: "Role and persona",
              explanation: "Roles should clarify task behavior, not add fake personality fluff.",
              aiUseCase: "Use role instructions for domain, tone, and boundaries.",
              plainExample: "Say 'act as a careful technical support assistant', not 'act like a genius wizard'."
            },
            {
              title: "Positive framing",
              explanation: "Tell the model what to do, not only what to avoid.",
              aiUseCase: "Replace vague negatives with specific allowed behavior and fallback rules.",
              plainExample: "Use 'answer only from provided context' instead of only 'do not hallucinate'."
            },
            {
              title: "Markdown and XML structure",
              explanation: "Clear tags and headings help separate instructions, examples, context, and output format.",
              aiUseCase: "Use structure for long prompts, RAG context, and extraction tasks.",
              plainExample: "Put retrieved chunks inside <context> so they are visibly separate from user input."
            }
          ],
          commonMistakes: [
            { mistake: "Mixing instructions and user data", better: "Separate system, context, and user sections" },
            { mistake: "Only saying what not to do", better: "State the desired behavior directly" },
            { mistake: "Vague output format", better: "Specify fields, order, and fallback values" }
          ],
          checklist: ["Separate system and user content", "Write useful role instructions", "Use positive rules", "Structure long prompts"]
        }
      },
      {
        n: "3.4",
        title: "Core techniques",
        items: ["Zero-shot", "Few-shot with curated examples", "COSTAR framework (Context, Objective, Style, Tone, Audience, Response)", "Iterative refinement loop"],
        detail: {
          duration: "45–60 min",
          level: "Beginner",
          status: "Required",
          showCodeLabel: "Show prompt example",
          hideCodeLabel: "Hide prompt example",
          codeLabel: "Prompt example",
          goal: "Use a small set of prompt techniques before reaching for complex agent patterns.",
          whyIntro: "Most prompt problems can be improved with simple techniques. You will use these when you are:",
          conceptsTitle: "Core Prompt Techniques",
          whyItMatters: ["Writing first prompts", "Improving quality", "Reducing retries", "Teaching output patterns"],
          concepts: [
            {
              title: "Zero-shot",
              explanation: "Zero-shot means asking directly without examples.",
              aiUseCase: "Use it for simple tasks where the format is obvious.",
              plainExample: "Ask the model to summarize one support ticket in three bullets."
            },
            {
              title: "Few-shot examples",
              explanation: "Few-shot prompting gives the model examples of the input and output pattern you want.",
              aiUseCase: "Use examples for classification, extraction, style matching, and tricky formatting.",
              plainExample: "Show two labeled tickets before asking it to label a third.",
              code: `Task: classify intent.\n\nExample 1:\nUser: I want my money back.\nIntent: refund_request\n\nExample 2:\nUser: Can I change my email?\nIntent: account_update\n\nUser: My card was charged twice.\nIntent:`
            },
            {
              title: "COSTAR",
              explanation: "COSTAR organizes Context, Objective, Style, Tone, Audience, and Response.",
              aiUseCase: "Use it when a prompt is growing messy and needs structure.",
              plainExample: "It turns 'write this better' into a complete task brief."
            },
            {
              title: "Iterative refinement",
              explanation: "Prompting is an engineering loop: test, inspect failures, adjust, and retest.",
              aiUseCase: "Use small eval sets to improve prompts instead of guessing.",
              plainExample: "If the model misses dates, add examples and a required date field."
            }
          ],
          commonMistakes: [
            { mistake: "Using few-shot examples that conflict", better: "Curate examples carefully" },
            { mistake: "Changing prompts without testing", better: "Keep sample inputs and compare outputs" },
            { mistake: "Overcomplicating simple tasks", better: "Start zero-shot, then add structure only as needed" }
          ],
          checklist: ["Use zero-shot appropriately", "Create useful few-shot examples", "Apply COSTAR", "Run a refinement loop"]
        }
      },
      {
        n: "3.5",
        title: "Applied prompt patterns",
        items: ["Extraction (entities, dates, relationships)", "Classification (intent, sentiment, routing)", "Transformation (summarize, translate, reformat)", "Generation (reports, SQL, code)", "Decomposition (break complex queries into sub-prompts)"],
        detail: {
          duration: "60–75 min",
          level: "Beginner",
          status: "Required",
          showCodeLabel: "Show prompt example",
          hideCodeLabel: "Hide prompt example",
          codeLabel: "Pattern example",
          goal: "Recognize the main prompt patterns used in real AI products.",
          whyIntro: "These patterns show up in almost every app. You will use them when you are:",
          conceptsTitle: "Applied Patterns",
          whyItMatters: ["Extracting data", "Routing requests", "Summarizing content", "Breaking down complex work"],
          concepts: [
            {
              title: "Extraction",
              explanation: "Extraction pulls structured fields from messy text.",
              aiUseCase: "Extract names, dates, entities, claims, requirements, or action items.",
              plainExample: "Turn an email into customer name, issue type, due date, and priority.",
              code: `Extract JSON with fields:\n- customer_name\n- issue\n- due_date\n- priority\n\nIf a field is missing, use null.`
            },
            {
              title: "Classification",
              explanation: "Classification maps input into known labels.",
              aiUseCase: "Route tickets, detect sentiment, choose tools, or flag risky content.",
              plainExample: "Classify a request as billing, technical, sales, or legal."
            },
            {
              title: "Transformation",
              explanation: "Transformation rewrites content while preserving meaning.",
              aiUseCase: "Summarize, translate, reformat, normalize, or simplify text.",
              plainExample: "Turn a long meeting transcript into decisions and next steps."
            },
            {
              title: "Decomposition",
              explanation: "Decomposition breaks a complex task into smaller prompts or steps.",
              aiUseCase: "Use it for research, planning, multi-document analysis, and agent workflows.",
              plainExample: "First identify questions, then retrieve context, then answer each question."
            }
          ],
          commonMistakes: [
            { mistake: "Using generation for everything", better: "Choose extraction, classification, transformation, or decomposition intentionally" },
            { mistake: "Too many labels", better: "Start with a small label set and add only needed labels" },
            { mistake: "No fallback for unknowns", better: "Allow unknown/null instead of forcing bad answers" }
          ],
          checklist: ["Use extraction prompts", "Use classification prompts", "Use transformation prompts", "Break complex tasks into steps"]
        }
      },
      {
        n: "3.6",
        title: "Advanced reasoning techniques",
        items: ["Chain of Thought — \"think step by step\"", "Self-Consistency — sample multiple paths, majority vote", "Self-Refine — generate, critique, refine loop", "Least-to-Most — decompose hard problems into ordered sub-problems", "Tree of Thought (research-flavoured; mention but don't drill)"],
        detail: {
          duration: "45–60 min",
          level: "Intermediate",
          status: "Required",
          goal: "Use reasoning techniques carefully without making prompts slower, leakier, or harder to evaluate.",
          whyIntro: "Reasoning patterns help on hard tasks, but they are not magic. You will use them when you are:",
          conceptsTitle: "Reasoning Techniques",
          whyItMatters: ["Solving hard tasks", "Improving reliability", "Reducing brittle answers", "Choosing when to decompose"],
          concepts: [
            {
              title: "Chain of thought",
              explanation: "Asking a model to reason step by step can improve difficult tasks, but production apps often should request concise reasoning or hidden reasoning instead of exposing every thought.",
              aiUseCase: "Use reasoning for planning, math, coding, and multi-step decisions.",
              plainExample: "Ask for a final answer plus a short explanation, not a long internal monologue."
            },
            {
              title: "Self-consistency",
              explanation: "Self-consistency samples multiple answers and chooses the strongest or most common result.",
              aiUseCase: "Use it when accuracy is more important than latency or cost.",
              plainExample: "Run three classifications and accept the majority label."
            },
            {
              title: "Self-refine",
              explanation: "Self-refine asks the model to draft, critique, and improve its answer.",
              aiUseCase: "Use it for reports, code review, summaries, and long-form quality checks.",
              plainExample: "Generate an answer, check it against requirements, then rewrite the weak parts."
            },
            {
              title: "Least-to-most",
              explanation: "Least-to-most solves smaller sub-problems before the main problem.",
              aiUseCase: "Use it for multi-hop research, document comparison, and planning.",
              plainExample: "Find the relevant policy first, then answer the employee's exact question."
            }
          ],
          commonMistakes: [
            { mistake: "Forcing step-by-step on simple tasks", better: "Use reasoning only when the task needs it" },
            { mistake: "Exposing too much internal reasoning", better: "Return concise explanations and final answers" },
            { mistake: "Ignoring cost", better: "Measure extra calls and latency" }
          ],
          checklist: ["Explain chain-of-thought tradeoffs", "Use self-consistency", "Use self-refine", "Use least-to-most decomposition"]
        }
      },
      {
        n: "3.7",
        title: "Prompt management & cost in production",
        items: ["Versioning prompts in code vs as managed resources", "A/B testing prompt variants", "AWS Bedrock Prompt Management for the lifecycle without code deploys", "Prompt caching — Anthropic cache_control and OpenAI's automatic cached input pricing (5–10× cost cuts on long system prompts)", "DSPy — programmatic prompt optimisation when you want the framework to tune your prompts for you (mention; depth is optional)"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show config example",
          hideCodeLabel: "Hide config example",
          codeLabel: "Prompt config example",
          goal: "Treat prompts like production assets: versioned, tested, measured, and cost-aware.",
          whyIntro: "Prompts become product logic once users depend on them. You will use this when you are:",
          conceptsTitle: "Production Prompt Management",
          whyItMatters: ["Shipping prompt changes", "Running A/B tests", "Reducing token spend", "Debugging regressions"],
          concepts: [
            {
              title: "Version prompts",
              explanation: "Keep prompt versions tied to code, evals, and release notes so behavior changes are traceable.",
              aiUseCase: "Roll back a bad prompt quickly when customer answers regress.",
              plainExample: "Use prompt_id=refund_answer_v3 instead of editing a mystery string in production.",
              code: `PROMPTS = {\n    \"refund_answer_v3\": {\n        \"model\": \"gpt-4.1-mini\",\n        \"temperature\": 0.2,\n        \"system\": \"Answer refund questions from policy context only.\"\n    }\n}`
            },
            {
              title: "A/B prompt variants",
              explanation: "A/B tests compare prompt versions with real metrics instead of opinions.",
              aiUseCase: "Compare accuracy, user satisfaction, escalation rate, latency, and cost.",
              plainExample: "Send 10% of traffic to a new prompt before replacing the old one."
            },
            {
              title: "Prompt caching",
              explanation: "Caching can reduce cost when large repeated instructions or context appear across requests.",
              aiUseCase: "Cache long system prompts, policy blocks, tool instructions, or stable context.",
              plainExample: "If every request includes the same 4,000-token policy, caching matters."
            },
            {
              title: "DSPy and optimization",
              explanation: "DSPy treats prompting more like a program that can be optimized against examples.",
              aiUseCase: "Use it when manual prompt tuning becomes slow and you have examples to optimize against.",
              plainExample: "Let the framework search for better instructions using your eval set."
            }
          ],
          commonMistakes: [
            { mistake: "Editing prompts without versions", better: "Store prompt IDs and changelogs" },
            { mistake: "Optimizing only for quality", better: "Track quality, latency, and cost together" },
            { mistake: "No rollback plan", better: "Keep the previous prompt ready" }
          ],
          checklist: ["Version prompts", "Run prompt A/B tests", "Understand prompt caching", "Know when DSPy is useful"]
        }
      },
      {
        n: "3.8",
        title: "Frontend basics for AI demos",
        items: ["HTML/CSS/JS fundamentals — forms, fetch, loading states, error states", "Streamlit for internal tools and quick evaluation UIs", "React/Next.js basics for a real chat experience", "Streaming UI patterns: token stream, cancel button, retry, citations, trace link"],
        detail: {
          duration: "60–90 min",
          level: "Beginner",
          status: "Required",
          showCodeLabel: "Show UI example",
          hideCodeLabel: "Hide UI example",
          codeLabel: "Frontend example",
          goal: "Build simple AI demos that feel usable instead of like raw scripts.",
          whyIntro: "AI engineers often need to show workflows, not just backend code. You will use this when you are:",
          conceptsTitle: "AI Demo Frontend Basics",
          whyItMatters: ["Building demos", "Testing prompts with users", "Showing loading states", "Presenting citations and traces"],
          concepts: [
            {
              title: "Forms and fetch",
              explanation: "A basic UI needs an input, a submit action, a request to your backend, and a rendered response.",
              aiUseCase: "Create a chat box, document Q&A form, or prompt testing panel.",
              plainExample: "User types a question, your frontend calls /api/chat, then displays the answer.",
              code: `async function ask(question) {\n  const res = await fetch('/api/chat', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ question })\n  });\n  return await res.json();\n}`
            },
            {
              title: "Loading and error states",
              explanation: "Users need to know when the model is working, when it failed, and what they can do next.",
              aiUseCase: "Show loading, retry, timeout, and safe error messages.",
              plainExample: "Replace a blank screen with 'Generating...' and a retry button."
            },
            {
              title: "Streamlit vs React",
              explanation: "Streamlit is fast for internal tools. React or Next.js is better for polished user-facing apps.",
              aiUseCase: "Use Streamlit for eval dashboards and React for product demos.",
              plainExample: "A researcher can use Streamlit; customers usually expect a real web app."
            },
            {
              title: "Streaming UI patterns",
              explanation: "Streaming UIs show partial text, let users cancel, retry failed responses, and inspect citations or traces.",
              aiUseCase: "Make long LLM responses feel responsive and debuggable.",
              plainExample: "Show answer text as it arrives, then attach sources and trace links below it."
            }
          ],
          commonMistakes: [
            { mistake: "No loading state", better: "Show progress while the model responds" },
            { mistake: "Showing raw errors", better: "Show safe user-facing errors and log details server-side" },
            { mistake: "No citations or trace links", better: "Surface sources and debug metadata when useful" }
          ],
          checklist: ["Build a form with fetch", "Add loading and error states", "Know when to use Streamlit", "Design a basic streaming chat UI"]
        }
      }
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
      {
        n: "4.1",
        title: "Why RAG exists",
        items: ["LLMs can't see your private data", "The brain-in-a-windowless-room reaches its limit", "Use cases: internal docs, company policies, recent data"],
        detail: {
          duration: "45–60 min",
          level: "Beginner",
          status: "Required",
          goal: "Understand when Retrieval-Augmented Generation is needed and what problem it actually solves.",
          whyIntro: "RAG is the default pattern for private or changing knowledge. You will use it when you are:",
          conceptsTitle: "RAG Foundations",
          whyItMatters: ["Answering from private docs", "Reducing hallucinations", "Citing sources", "Keeping answers current"],
          concepts: [
            {
              title: "LLMs cannot see private data",
              explanation: "A model only sees the prompt, its training, and any tools or context you provide.",
              aiUseCase: "Retrieve company docs, tickets, policies, or database records before asking the model to answer.",
              plainExample: "The model cannot know your internal PTO policy unless you put that policy in context."
            },
            {
              title: "Retrieval before generation",
              explanation: "RAG first finds relevant context, then asks the model to answer using that context.",
              aiUseCase: "Use retrieval for support bots, knowledge bases, policy assistants, and document Q&A.",
              plainExample: "Search the handbook first, then generate the answer with citations."
            },
            {
              title: "Grounding and citations",
              explanation: "Grounding means tying answers to retrieved evidence instead of model memory.",
              aiUseCase: "Show users source chunks, page numbers, or document links so answers can be checked.",
              plainExample: "A legal assistant should point to the clause it used."
            },
            {
              title: "When RAG is not enough",
              explanation: "Bad documents, poor chunking, weak retrieval, or missing permissions still produce bad answers.",
              aiUseCase: "Debug the full pipeline, not only the final prompt.",
              plainExample: "If retrieval returns the wrong page, the model will answer from the wrong evidence."
            }
          ],
          commonMistakes: [
            { mistake: "Using RAG for facts already in the prompt", better: "Keep simple prompts simple" },
            { mistake: "Blaming the model for bad retrieval", better: "Inspect retrieved chunks first" },
            { mistake: "No citations", better: "Return source metadata with every grounded answer" }
          ],
          checklist: ["Explain why RAG exists", "Describe retrieve-then-generate", "Know when citations matter", "Inspect retrieved context before debugging prompts"]
        }
      },
      {
        n: "4.2",
        title: "Embeddings",
        items: ["What an embedding actually is (vector in N-dim space)", "Cosine similarity, dot product, Euclidean distance", "Embedding models — Titan Multimodal, SentenceTransformer, OpenAI ada/text-embedding-3, Cohere", "Choosing dimensions vs cost"],
        detail: {
          duration: "60–75 min",
          level: "Beginner",
          status: "Required",
          showCodeLabel: "Show embedding example",
          hideCodeLabel: "Hide embedding example",
          codeLabel: "Embedding example",
          goal: "Understand embeddings as searchable meaning vectors and choose them with cost and quality in mind.",
          whyIntro: "Embeddings power most semantic search systems. You will use them when you are:",
          conceptsTitle: "Embedding Concepts",
          whyItMatters: ["Semantic search", "Document similarity", "Deduplication", "RAG retrieval"],
          concepts: [
            {
              title: "Vectors for meaning",
              explanation: "An embedding turns text into a list of numbers that roughly represents meaning.",
              aiUseCase: "Store document chunks as vectors, then find chunks close to a user question.",
              plainExample: "Two refund-policy paragraphs should be closer to each other than to a recipe.",
              code: `question = embed(\"How do refunds work?\")\nchunk = embed(\"Customers can request a refund within 30 days.\")\nscore = cosine_similarity(question, chunk)`
            },
            {
              title: "Similarity metrics",
              explanation: "Cosine similarity, dot product, and Euclidean distance compare vectors in different ways.",
              aiUseCase: "Use the metric expected by your embedding model and vector database.",
              plainExample: "Higher similarity usually means the chunk is more relevant to the query."
            },
            {
              title: "Model choice",
              explanation: "Embedding models differ in language coverage, dimensions, cost, speed, and multimodal support.",
              aiUseCase: "Pick based on documents, query language, budget, and retrieval quality.",
              plainExample: "A PDF-image workflow may need multimodal embeddings, not just text embeddings."
            },
            {
              title: "Dimensions and storage",
              explanation: "Higher-dimensional vectors can improve quality but increase storage, memory, and search cost.",
              aiUseCase: "Balance retrieval quality against database cost and latency.",
              plainExample: "Millions of large vectors can become expensive fast."
            }
          ],
          commonMistakes: [
            { mistake: "Assuming bigger embeddings always win", better: "Evaluate quality, cost, and latency together" },
            { mistake: "Mixing embedding models in one index", better: "Re-embed consistently when changing models" },
            { mistake: "Ignoring query/document mismatch", better: "Test retrieval with real user questions" }
          ],
          checklist: ["Explain embeddings", "Compare similarity metrics", "Choose an embedding model", "Understand dimension tradeoffs"]
        }
      },
      {
        n: "4.3",
        title: "Document ingestion pipeline",
        items: ["Layout identification with Docling (headers, paragraphs, tables, code blocks, formulas)", "Serialization to structured objects", "Why PyMuPDF alone fails on complex PDFs"],
        detail: {
          duration: "60–90 min",
          level: "Intermediate",
          status: "Required",
          goal: "Turn messy documents into structured, searchable records before chunking and embedding.",
          whyIntro: "RAG quality starts before embeddings. You will use ingestion when you are:",
          conceptsTitle: "Ingestion Pipeline",
          whyItMatters: ["Parsing PDFs", "Preserving tables", "Keeping page metadata", "Preparing reliable chunks"],
          concepts: [
            {
              title: "Layout identification",
              explanation: "Good ingestion detects headings, paragraphs, tables, lists, code blocks, images, and page structure.",
              aiUseCase: "Use tools like Docling when document layout matters for answer quality.",
              plainExample: "A table row should stay connected to its header, not become random text."
            },
            {
              title: "Structured serialization",
              explanation: "After parsing, convert document parts into objects with text, type, page, section, and source metadata.",
              aiUseCase: "Store structured records so retrieval can filter and cite correctly.",
              plainExample: "A chunk should know it came from page 12, section 'Benefits'."
            },
            {
              title: "PDF extraction limits",
              explanation: "Simple PDF text extraction often loses reading order, tables, columns, and formatting.",
              aiUseCase: "Inspect extraction output before trusting retrieval results.",
              plainExample: "A two-column policy can be read in the wrong order if parsed naively."
            },
            {
              title: "Metadata from day one",
              explanation: "Capture document ID, version, page, section, timestamps, permissions, and checksum during ingestion.",
              aiUseCase: "Use metadata for filtering, citations, updates, and access control.",
              plainExample: "Without document version, you may answer from an old policy."
            }
          ],
          commonMistakes: [
            { mistake: "Embedding raw PDF text blindly", better: "Inspect layout and extraction quality first" },
            { mistake: "Dropping page numbers", better: "Keep source metadata for citations" },
            { mistake: "No document versioning", better: "Track source version and reprocessing status" }
          ],
          checklist: ["Parse document layout", "Serialize structured records", "Preserve metadata", "Inspect extraction quality"]
        }
      },
      {
        n: "4.4",
        title: "Chunking strategies",
        items: ["Fixed-width chunking and why it breaks", "Semantic chunking by structure", "Overlap windows", "Parent-child chunking", "Late chunking — embed first, chunk later — preserves context across boundaries", "Chunk size vs retrieval quality tradeoff"],
        detail: {
          duration: "75–90 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show chunking example",
          hideCodeLabel: "Hide chunking example",
          codeLabel: "Chunking example",
          goal: "Choose chunking strategies that preserve meaning and improve retrieval quality.",
          whyIntro: "Chunking decides what evidence the model can see. You will use it when you are:",
          conceptsTitle: "Chunking Strategies",
          whyItMatters: ["Improving retrieval", "Reducing hallucinations", "Handling long docs", "Preserving context"],
          concepts: [
            {
              title: "Fixed-width chunking",
              explanation: "Fixed-width chunks split text by character or token count. It is simple but can cut through ideas.",
              aiUseCase: "Use as a baseline, then improve when retrieval misses context.",
              plainExample: "A refund rule split across two chunks can make both chunks incomplete."
            },
            {
              title: "Semantic chunking",
              explanation: "Semantic chunking follows document structure such as headings, paragraphs, lists, and sections.",
              aiUseCase: "Use for policies, docs, manuals, and guides where structure matters.",
              plainExample: "Keep all bullets under 'Eligibility' together when possible.",
              code: `chunk = {\n    \"section\": \"Refund eligibility\",\n    \"text\": \"Customers may request a refund within 30 days...\",\n    \"page\": 4\n}`
            },
            {
              title: "Overlap and parent-child",
              explanation: "Overlap repeats nearby context. Parent-child stores small searchable chunks linked to larger parent sections.",
              aiUseCase: "Search precise text, then send a larger parent section to the model.",
              plainExample: "Find the matching sentence, but answer with the full policy paragraph."
            },
            {
              title: "Chunk size tradeoff",
              explanation: "Small chunks are precise but may lack context. Large chunks carry context but can reduce retrieval precision.",
              aiUseCase: "Tune chunk size with retrieval evals instead of guessing.",
              plainExample: "A 200-token chunk may be too narrow; a 2,000-token chunk may be noisy."
            }
          ],
          commonMistakes: [
            { mistake: "One chunk size for every document type", better: "Tune by content type and eval results" },
            { mistake: "No overlap where context spans boundaries", better: "Use overlap or parent-child retrieval" },
            { mistake: "Ignoring headings", better: "Include section titles in chunk text or metadata" }
          ],
          checklist: ["Explain fixed-width limits", "Use semantic chunking", "Use overlap or parent-child retrieval", "Tune chunk size with evals"]
        }
      },
      {
        n: "4.5",
        title: "Chunk enrichment",
        items: ["PII detection and redaction", "NER for entities", "Key-phrase extraction", "Metadata for hybrid search"],
        detail: {
          duration: "45–60 min",
          level: "Intermediate",
          status: "Required",
          goal: "Add metadata and safety processing that makes chunks easier to search, filter, and protect.",
          whyIntro: "Raw chunks are rarely enough in production. You will enrich chunks when you are:",
          conceptsTitle: "Chunk Enrichment",
          whyItMatters: ["Protecting PII", "Filtering retrieval", "Improving hybrid search", "Supporting analytics"],
          concepts: [
            {
              title: "PII redaction",
              explanation: "Detect and remove or mask sensitive information before storage or model calls.",
              aiUseCase: "Prevent private emails, phone numbers, account IDs, or health data from leaking into prompts.",
              plainExample: "Store 'Email: [REDACTED]' instead of a real customer email."
            },
            {
              title: "Named entities",
              explanation: "NER identifies people, companies, products, locations, dates, and other entities.",
              aiUseCase: "Attach entities as metadata so retrieval can filter or boost relevant chunks.",
              plainExample: "A chunk tagged with 'AWS Bedrock' can rank higher for Bedrock questions."
            },
            {
              title: "Key phrases",
              explanation: "Key phrases summarize what a chunk is about in searchable terms.",
              aiUseCase: "Improve keyword search and make retrieval debugging easier.",
              plainExample: "A chunk can carry key phrases like 'refund window' and 'proof of purchase'."
            },
            {
              title: "Metadata for hybrid search",
              explanation: "Metadata such as document type, source, tenant, date, permissions, and section supports filtering and ranking.",
              aiUseCase: "Search only documents a user is allowed to see.",
              plainExample: "A sales user should not retrieve HR-only documents."
            }
          ],
          commonMistakes: [
            { mistake: "Storing sensitive raw text unnecessarily", better: "Redact or tokenize PII early" },
            { mistake: "Metadata as an afterthought", better: "Design metadata fields before indexing" },
            { mistake: "No permission filters", better: "Filter retrieval by tenant, role, and document ACLs" }
          ],
          checklist: ["Redact PII", "Extract entities", "Add key phrases", "Use metadata filters"]
        }
      },
      {
        n: "4.6",
        title: "Vector databases",
        items: ["Pinecone, Weaviate, pgvector", "Chroma for local dev", "S3 Vector Buckets, OpenSearch", "HNSW vs IVF indexes", "Decision matrix: managed (Pinecone) vs self-hosted (Weaviate, Qdrant) vs in-process (Chroma, FAISS) vs already-in-your-stack (pgvector)"],
        detail: {
          duration: "60–90 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show pgvector example",
          hideCodeLabel: "Hide pgvector example",
          codeLabel: "Vector query example",
          goal: "Choose and operate a vector store based on scale, latency, team skill, and deployment constraints.",
          whyIntro: "The vector database is where retrieval becomes infrastructure. You will use it when you are:",
          conceptsTitle: "Vector Database Concepts",
          whyItMatters: ["Storing embeddings", "Serving semantic search", "Filtering by metadata", "Scaling retrieval"],
          concepts: [
            {
              title: "Vector store options",
              explanation: "Pinecone, Weaviate, Qdrant, pgvector, Chroma, FAISS, OpenSearch, and cloud vector services fit different needs.",
              aiUseCase: "Use Chroma or FAISS locally, pgvector when Postgres is enough, and managed stores when scale or ops matter.",
              plainExample: "A prototype can use Chroma; a production multi-tenant app may need managed scaling."
            },
            {
              title: "Indexes",
              explanation: "Indexes like HNSW and IVF speed up approximate nearest-neighbor search.",
              aiUseCase: "Tune index settings for recall, latency, memory, and ingestion speed.",
              plainExample: "Faster search may miss some relevant chunks if recall is too low."
            },
            {
              title: "Metadata filters",
              explanation: "Most real searches combine vector similarity with metadata constraints.",
              aiUseCase: "Filter by tenant, document type, product, language, timestamp, or permissions.",
              plainExample: "Find similar chunks, but only inside the user's workspace.",
              code: `SELECT text, source\nFROM chunks\nWHERE tenant_id = 'acme'\nORDER BY embedding <=> $1\nLIMIT 5;`
            },
            {
              title: "Managed vs self-hosted",
              explanation: "Managed stores reduce ops work. Self-hosting gives more control but adds maintenance.",
              aiUseCase: "Choose based on compliance, scale, budget, and team capacity.",
              plainExample: "If your team already runs Postgres well, pgvector may be enough."
            }
          ],
          commonMistakes: [
            { mistake: "Choosing a database by hype", better: "Choose by workload, scale, filters, and ops model" },
            { mistake: "No metadata filtering", better: "Design filters before indexing" },
            { mistake: "Ignoring reindexing cost", better: "Plan for embedding model changes and document updates" }
          ],
          checklist: ["Compare vector store options", "Explain HNSW/IVF tradeoffs", "Use metadata filters", "Choose managed vs self-hosted intentionally"]
        }
      },
      {
        n: "4.7",
        title: "Hybrid retrieval & next-gen retrievers",
        items: ["Vector search + BM25 keyword", "Reranking with cross-encoders (Cohere Rerank, BGE)", "Metadata filtering", "Query expansion", "Late-interaction retrievers — ColBERT (text), ColPali (multimodal/PDF pages as images) — when they beat dense retrieval and what they cost"],
        detail: {
          duration: "75–90 min",
          level: "Intermediate",
          status: "Required",
          goal: "Improve retrieval by combining semantic search, keyword search, filters, reranking, and specialized retrievers.",
          whyIntro: "Dense vectors alone miss exact terms and rare facts. You will use hybrid retrieval when you are:",
          conceptsTitle: "Hybrid Retrieval",
          whyItMatters: ["Improving recall", "Handling exact terms", "Reranking chunks", "Retrieving PDFs and tables"],
          concepts: [
            {
              title: "Vector plus BM25",
              explanation: "Hybrid search combines semantic similarity with keyword matching.",
              aiUseCase: "Find conceptually related chunks while still respecting exact product names, IDs, and legal terms.",
              plainExample: "A query for 'Form 1099-K' should match the exact form name, not only similar tax content."
            },
            {
              title: "Reranking",
              explanation: "A reranker scores candidate chunks more carefully after initial retrieval.",
              aiUseCase: "Retrieve 30 candidates cheaply, rerank them, then send the best 5 to the model.",
              plainExample: "Reranking is slower but often improves final context quality."
            },
            {
              title: "Query expansion",
              explanation: "Query expansion rewrites or adds related terms to improve recall.",
              aiUseCase: "Expand user language into domain terms before retrieval.",
              plainExample: "'Can I get my money back?' can expand to 'refund, reimbursement, return policy'."
            },
            {
              title: "Late-interaction retrievers",
              explanation: "Retrievers like ColBERT and ColPali keep richer token or visual interactions than a single dense vector.",
              aiUseCase: "Use them for hard text retrieval, page-image PDFs, tables, and visual layouts when budget allows.",
              plainExample: "A scanned PDF page may retrieve better as an image-aware representation."
            }
          ],
          commonMistakes: [
            { mistake: "Only using top-3 vector search", better: "Test hybrid retrieval and reranking" },
            { mistake: "No exact keyword support", better: "Add BM25 for codes, names, and rare terms" },
            { mistake: "Reranking too many chunks", better: "Limit candidates and measure latency" }
          ],
          checklist: ["Combine vector and BM25", "Use reranking", "Apply metadata filters", "Know when late-interaction retrievers help"]
        }
      },
      {
        n: "4.8",
        title: "Graph-augmented RAG",
        items: ["Neo4j basics", "Cypher query language", "When graph relationships beat pure vector search", "Multi-hop queries"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show Cypher example",
          hideCodeLabel: "Hide Cypher example",
          codeLabel: "Cypher example",
          goal: "Know when relationships and multi-hop queries need a graph instead of only vector search.",
          whyIntro: "Graphs help when relationships are the answer. You will use graph RAG when you are:",
          conceptsTitle: "Graph RAG Concepts",
          whyItMatters: ["Multi-hop questions", "Entity relationships", "Compliance queries", "Knowledge graphs"],
          concepts: [
            {
              title: "Graph basics",
              explanation: "Graphs store entities as nodes and relationships as edges.",
              aiUseCase: "Represent people, systems, documents, products, owners, dependencies, and policies.",
              plainExample: "A system owns a database, the database stores PII, and a policy controls access."
            },
            {
              title: "Cypher queries",
              explanation: "Cypher is a query language for matching graph patterns.",
              aiUseCase: "Find connected entities before sending evidence to the model.",
              plainExample: "Find all services owned by a team that touch customer data.",
              code: `MATCH (team:Team {name: \"Payments\"})-[:OWNS]->(svc)-[:USES]->(db)\nRETURN svc.name, db.name`
            },
            {
              title: "When graphs beat vectors",
              explanation: "Vectors are good for similarity. Graphs are better for explicit relationships and paths.",
              aiUseCase: "Use graphs for dependency analysis, lineage, ownership, and multi-hop reasoning.",
              plainExample: "Similarity search may not reveal that Service A depends on Database B through Queue C."
            },
            {
              title: "Graph plus RAG",
              explanation: "Graph RAG can retrieve entities and relationships, then attach relevant text chunks for grounding.",
              aiUseCase: "Combine structured relationship queries with unstructured document evidence.",
              plainExample: "Use the graph to find affected systems, then retrieve their runbooks."
            }
          ],
          commonMistakes: [
            { mistake: "Using a graph for simple text Q&A", better: "Use graphs when relationships matter" },
            { mistake: "No entity normalization", better: "Deduplicate entities before building edges" },
            { mistake: "Sending graph facts without evidence", better: "Attach source documents or provenance" }
          ],
          checklist: ["Explain nodes and edges", "Read a simple Cypher query", "Know when graphs beat vectors", "Combine graph facts with text evidence"]
        }
      },
      {
        n: "4.9",
        title: "RAG evaluation — the part most courses skip",
        items: ["LLM-as-judge: RAG Triad — Faithfulness, Context Relevance, Answer Relevance", "Deterministic retrieval metrics: Precision@k, Recall@k, F1, Hit Rate@k, MRR, NDCG@k", "Tooling: Ragas (the de-facto eval framework), MLflow for run logging, LangSmith for tracing", "Golden datasets: Q&A pairs with expected chunks, regression testing on every code change"],
        detail: {
          duration: "90–120 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show eval example",
          hideCodeLabel: "Hide eval example",
          codeLabel: "Eval example",
          goal: "Measure RAG failures with retrieval metrics, answer metrics, traces, and regression datasets.",
          whyIntro: "Without evals, RAG debugging becomes guessing. You will use RAG evals when you are:",
          conceptsTitle: "RAG Evaluation",
          whyItMatters: ["Finding retrieval failures", "Preventing regressions", "Comparing chunking strategies", "Proving answer quality"],
          concepts: [
            {
              title: "RAG Triad",
              explanation: "Faithfulness checks whether the answer follows context. Context relevance checks whether retrieved chunks matter. Answer relevance checks whether the answer addresses the question.",
              aiUseCase: "Separate retrieval problems from generation problems.",
              plainExample: "A faithful answer can still be useless if retrieval brought irrelevant chunks."
            },
            {
              title: "Retrieval metrics",
              explanation: "Precision@k, Recall@k, Hit Rate, MRR, and NDCG measure whether the right chunks appear in search results.",
              aiUseCase: "Compare chunking, embedding models, filters, and rerankers.",
              plainExample: "If the gold chunk is never in top 10, prompt changes will not fix the system.",
              code: `def hit_rate_at_k(results, expected_chunk_id, k):\n    top_ids = [r[\"chunk_id\"] for r in results[:k]]\n    return expected_chunk_id in top_ids`
            },
            {
              title: "Golden datasets",
              explanation: "A golden dataset contains representative questions, expected answers, and expected supporting chunks.",
              aiUseCase: "Run it in CI before changing prompts, chunking, embeddings, or models.",
              plainExample: "Keep 50 real policy questions that must keep passing after every retrieval change."
            },
            {
              title: "Tracing and run logging",
              explanation: "Tools like LangSmith, LangFuse, MLflow, and Ragas help record inputs, retrieved chunks, scores, outputs, and failures.",
              aiUseCase: "Debug individual bad answers and compare experiments.",
              plainExample: "A trace shows the query, retrieved chunks, reranker scores, model call, and final answer."
            }
          ],
          commonMistakes: [
            { mistake: "Only judging final answers", better: "Evaluate retrieval and generation separately" },
            { mistake: "No golden dataset", better: "Collect real representative questions" },
            { mistake: "Changing chunking without regression tests", better: "Run evals before and after every pipeline change" }
          ],
          checklist: ["Explain the RAG Triad", "Use retrieval metrics", "Create a golden dataset", "Log traces and compare runs"]
        }
      },
      {
        n: "4.10",
        title: "Data engineering basics for AI systems",
        items: ["ETL vs ELT — ingest, clean, normalize, enrich, load", "Batch jobs and worker queues for document processing", "SQL joins, indexes, migrations, and query plans", "Object storage layouts: raw / processed / embeddings / eval artifacts", "Idempotency and retry-safe jobs so reprocessing does not duplicate data"],
        detail: {
          duration: "75–90 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show pipeline example",
          hideCodeLabel: "Hide pipeline example",
          codeLabel: "Pipeline example",
          goal: "Build ingestion and processing flows that can be rerun safely without corrupting data.",
          whyIntro: "AI systems are data systems with model calls attached. You will use these basics when you are:",
          conceptsTitle: "Data Engineering Basics",
          whyItMatters: ["Processing documents", "Running batch jobs", "Avoiding duplicate data", "Managing eval artifacts"],
          concepts: [
            {
              title: "ETL and ELT",
              explanation: "ETL extracts, transforms, then loads data. ELT loads raw data first, then transforms it later.",
              aiUseCase: "Keep raw documents, parsed records, chunks, embeddings, and eval outputs as separate stages.",
              plainExample: "Do not overwrite the original PDF when you create cleaned chunks."
            },
            {
              title: "Workers and queues",
              explanation: "Queues let background workers process slow jobs like parsing, embedding, enrichment, and indexing.",
              aiUseCase: "Keep uploads responsive while workers handle expensive document processing.",
              plainExample: "User uploads a file, gets 'processing', and the worker embeds it later."
            },
            {
              title: "SQL and indexes",
              explanation: "SQL joins, indexes, migrations, and query plans matter for metadata, jobs, permissions, and evals.",
              aiUseCase: "Store document records, chunk metadata, user access, and job states reliably.",
              plainExample: "Index document_id and tenant_id so retrieval filters do not become slow."
            },
            {
              title: "Idempotent jobs",
              explanation: "An idempotent job can run more than once without duplicating or corrupting records.",
              aiUseCase: "Safely retry failed ingestion and reprocess documents after model changes.",
              plainExample: "Use a document checksum and chunk IDs so reruns update existing rows.",
              code: `chunk_id = f\"{document_id}:{section}:{index}\"\nupsert_chunk(chunk_id=chunk_id, text=text, embedding=embedding)`
            }
          ],
          commonMistakes: [
            { mistake: "No raw/processed separation", better: "Keep raw, parsed, chunks, embeddings, and evals separate" },
            { mistake: "Jobs cannot be retried safely", better: "Use idempotent IDs and upserts" },
            { mistake: "No object storage layout", better: "Organize artifacts by stage, tenant, document, and version" }
          ],
          checklist: ["Explain ETL vs ELT", "Use workers for slow jobs", "Store metadata in SQL", "Make ingestion idempotent"]
        }
      }
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
      {
        n: "5.1",
        title: "Function calling / tool use",
        items: ["Tool schemas (JSON Schema, Pydantic)", "How the LLM decides which tool to call", "Structured outputs for predictable downstream code", "Parsing tool-call responses", "Handling tool errors gracefully"],
        detail: {
          duration: "60–90 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show tool schema example",
          hideCodeLabel: "Hide tool schema example",
          codeLabel: "Tool schema example",
          goal: "Understand how models call tools and how to turn tool outputs into reliable application behavior.",
          whyIntro: "Tools let models act on real systems. You will use function calling when you are:",
          conceptsTitle: "Tool Use Concepts",
          whyItMatters: ["Calling APIs", "Querying databases", "Returning structured data", "Handling failures safely"],
          concepts: [
            {
              title: "Tool schemas",
              explanation: "A tool schema describes the tool name, purpose, inputs, and expected types.",
              aiUseCase: "Give the model enough structure to call search, database, email, or file tools correctly.",
              plainExample: "A weather tool needs a city and date, not a free-form paragraph.",
              code: `class SearchInput(BaseModel):\n    query: str\n    top_k: int = 5\n\n# The model sees this as the contract for search.`
            },
            {
              title: "Tool selection",
              explanation: "The model chooses a tool based on the user request, tool names, descriptions, and schemas.",
              aiUseCase: "Write tool descriptions that clearly say when to use the tool and when not to.",
              plainExample: "A 'search_docs' tool should say it searches internal docs, not the public web."
            },
            {
              title: "Structured outputs",
              explanation: "Structured outputs make downstream code predictable after a model or tool call.",
              aiUseCase: "Validate routing decisions, extracted fields, and tool arguments before taking action.",
              plainExample: "Return {\"tool\": \"search_docs\", \"query\": \"refund policy\"}, not vague text."
            },
            {
              title: "Tool errors",
              explanation: "Tools fail because APIs time out, permissions block access, inputs are invalid, or data is missing.",
              aiUseCase: "Return clear, safe errors to the agent and log detailed errors for engineers.",
              plainExample: "If search times out, the agent should say it could not verify the answer, not invent one."
            }
          ],
          commonMistakes: [
            { mistake: "Vague tool schemas", better: "Use specific names, descriptions, and typed inputs" },
            { mistake: "Letting tools return messy text", better: "Return structured data with status and errors" },
            { mistake: "Ignoring failures", better: "Handle timeouts, invalid input, and permission errors" }
          ],
          checklist: ["Define typed tool schemas", "Explain tool selection", "Validate structured outputs", "Handle tool errors gracefully"]
        }
      },
      {
        n: "5.2",
        title: "Tool design principles",
        items: ["One tool, one job", "Clear docstrings — the LLM reads them", "Return structured data, not free text", "Fallbacks inside tools, not in the agent"],
        detail: {
          duration: "45–60 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show tool example",
          hideCodeLabel: "Hide tool example",
          codeLabel: "Tool design example",
          goal: "Design tools that are narrow, understandable, safe, and easy for an agent to use.",
          whyIntro: "Bad tools make agents look unreliable. You will apply these principles when you are:",
          conceptsTitle: "Tool Design Principles",
          whyItMatters: ["Reducing wrong tool calls", "Improving reliability", "Making debugging easier", "Keeping side effects safe"],
          concepts: [
            {
              title: "One tool, one job",
              explanation: "A tool should perform one clear action instead of hiding a whole workflow behind a vague name.",
              aiUseCase: "Separate search_docs, get_order_status, and send_email instead of one do_everything tool.",
              plainExample: "The model can choose better when each tool has a clear purpose."
            },
            {
              title: "Clear docstrings",
              explanation: "The model reads tool descriptions, so the wording should explain inputs, outputs, and when to use it.",
              aiUseCase: "Use docstrings as the model-facing instruction manual for the tool.",
              plainExample: "Say 'Search internal HR policies' instead of 'Search stuff'.",
              code: `def search_hr_policy(query: str) -> dict:\n    \"\"\"Search approved HR policy documents. Use only for HR-policy questions.\"\"\"\n    ...`
            },
            {
              title: "Structured returns",
              explanation: "Tools should return objects with fields like status, data, source, and error instead of loose paragraphs.",
              aiUseCase: "Let the agent decide the next step based on predictable fields.",
              plainExample: "Return status='not_found' so the agent can ask a follow-up question."
            },
            {
              title: "Fallbacks inside tools",
              explanation: "Tools should handle retries, defaults, and safe fallbacks internally where possible.",
              aiUseCase: "Keep the agent focused on reasoning, not low-level API recovery.",
              plainExample: "The search tool can retry once before telling the agent it failed."
            }
          ],
          commonMistakes: [
            { mistake: "Tools that do too much", better: "Split into small focused tools" },
            { mistake: "Descriptions written for humans only", better: "Write docstrings the model can act on" },
            { mistake: "Returning unstructured text", better: "Return typed fields and status values" }
          ],
          checklist: ["Design focused tools", "Write clear docstrings", "Return structured data", "Put fallbacks inside tools"]
        }
      },
      {
        n: "5.3",
        title: "MCP — Model Context Protocol",
        items: ["What MCP is and why it exists (universal adapter for tools)", "MCP servers vs MCP clients", "Using existing MCP servers (filesystem, GitHub, Slack)", "Building your own MCP server", "stdio vs HTTP transports", "MCP is moving fast — bookmark modelcontextprotocol.io and re-read the spec every few months; the registry, auth model, and resource semantics are still evolving"],
        detail: {
          duration: "75–90 min",
          level: "Intermediate",
          status: "Required",
          goal: "Understand MCP as a standard way for agents and apps to discover and use external tools and resources.",
          whyIntro: "MCP turns integrations into reusable agent infrastructure. You will use it when you are:",
          conceptsTitle: "MCP Concepts",
          whyItMatters: ["Connecting tools", "Reusing integrations", "Accessing files and apps", "Separating agent logic from tool servers"],
          concepts: [
            {
              title: "Why MCP exists",
              explanation: "MCP provides a common protocol so different agents can connect to tools, resources, and prompts without custom glue every time.",
              aiUseCase: "Expose GitHub, Slack, databases, files, or internal systems through a standard interface.",
              plainExample: "Instead of rebuilding a GitHub integration for every agent, connect to a GitHub MCP server."
            },
            {
              title: "Servers and clients",
              explanation: "An MCP server exposes capabilities. An MCP client connects to the server and lets the model use those capabilities.",
              aiUseCase: "Run a filesystem server locally or an internal company tool server remotely.",
              plainExample: "The agent app is the client; the tool provider is the server."
            },
            {
              title: "Transports",
              explanation: "MCP can run over transports such as stdio for local tools or HTTP-style transports for remote services.",
              aiUseCase: "Use local stdio tools during development and networked transports for shared services.",
              plainExample: "A local file tool can run beside your app; a company CRM tool may live behind an HTTP endpoint."
            },
            {
              title: "Moving protocol surface",
              explanation: "MCP is evolving, so auth, registry, resource patterns, and hosting practices may change.",
              aiUseCase: "Treat MCP integrations like dependencies that need periodic review.",
              plainExample: "Bookmark the official spec and re-check it before building a production server."
            }
          ],
          commonMistakes: [
            { mistake: "Treating MCP as an agent framework", better: "Use it as a tool/resource protocol" },
            { mistake: "Ignoring auth and permissions", better: "Design access control per server and tool" },
            { mistake: "Assuming the spec is frozen", better: "Revisit MCP docs as it evolves" }
          ],
          checklist: ["Explain MCP's purpose", "Differentiate client and server", "Compare stdio and HTTP transports", "Plan auth and permissions"]
        }
      },
      {
        n: "5.4",
        title: "The ReAct pattern",
        items: ["Reasoning + Acting loop", "Thought → action → observation → thought", "Why \"thinking\" models exist", "When to force ReAct vs let the model decide"],
        detail: {
          duration: "45–60 min",
          level: "Intermediate",
          status: "Required",
          goal: "Understand the reasoning-action-observation loop behind many practical agents.",
          whyIntro: "ReAct is the basic shape of tool-using agents. You will use it when you are:",
          conceptsTitle: "ReAct Pattern",
          whyItMatters: ["Planning tool calls", "Using observations", "Debugging loops", "Choosing agent control flow"],
          concepts: [
            {
              title: "Reasoning plus acting",
              explanation: "ReAct alternates between deciding what to do, calling a tool, reading the result, and deciding the next step.",
              aiUseCase: "Use it for search, database lookup, file analysis, and multi-step support workflows.",
              plainExample: "Question -> search docs -> read chunk -> maybe search again -> answer."
            },
            {
              title: "Observation matters",
              explanation: "The observation is the tool result the model uses to continue.",
              aiUseCase: "Return concise observations that contain enough evidence for the next decision.",
              plainExample: "A search tool should return top chunks and sources, not a vague 'found results'."
            },
            {
              title: "Thinking models",
              explanation: "Reasoning models can perform harder planning, but they still need good tools and guardrails.",
              aiUseCase: "Use stronger reasoning for complex tool workflows, not for every simple lookup.",
              plainExample: "A refund lookup does not need a high-cost reasoning model."
            },
            {
              title: "When to force ReAct",
              explanation: "Use explicit ReAct loops when you need inspectable steps. Let the model decide when the task is simple and low-risk.",
              aiUseCase: "Use explicit loops for regulated, high-impact, or hard-to-debug workflows.",
              plainExample: "A financial workflow should show which tool result caused the final answer."
            }
          ],
          commonMistakes: [
            { mistake: "Letting loops run forever", better: "Set max tool calls, retries, and stop conditions" },
            { mistake: "Verbose observations", better: "Return compact, relevant tool results" },
            { mistake: "Using ReAct for trivial tasks", better: "Use direct calls for simple workflows" }
          ],
          checklist: ["Explain ReAct", "Use observations correctly", "Set stop conditions", "Know when explicit loops help"]
        }
      },
      {
        n: "5.5",
        title: "LangChain agents",
        items: ["create_agent — model + tools + middleware + store", "@tool(parse_docstring=True) for auto schemas", "Parallel tool execution with asyncio.gather", "Structured outputs via Pydantic"],
        detail: {
          duration: "75–90 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show LangChain example",
          hideCodeLabel: "Hide LangChain example",
          codeLabel: "LangChain example",
          goal: "Build a simple LangChain agent with typed tools, structured output, and predictable execution.",
          whyIntro: "LangChain is common in agent prototypes and production stacks. You will use it when you are:",
          conceptsTitle: "LangChain Agent Basics",
          whyItMatters: ["Building tool agents", "Generating tool schemas", "Using middleware", "Returning typed outputs"],
          concepts: [
            {
              title: "create_agent",
              explanation: "create_agent combines a model, tools, instructions, middleware, and optional state or store.",
              aiUseCase: "Build a single agent that can search docs, call APIs, or route user requests.",
              plainExample: "Give the agent a model and a search tool, then ask it to answer from documents."
            },
            {
              title: "Tool decorators",
              explanation: "Decorators can turn normal Python functions into model-callable tools with schemas.",
              aiUseCase: "Expose focused functions without hand-writing every JSON schema.",
              plainExample: "A function named get_order_status becomes a tool the model can call.",
              code: `@tool(parse_docstring=True)\ndef get_order_status(order_id: str) -> dict:\n    \"\"\"Look up one order by ID.\"\"\"\n    return {\"order_id\": order_id, \"status\": \"shipped\"}`
            },
            {
              title: "Parallel tool execution",
              explanation: "Independent tool calls can run concurrently to reduce latency.",
              aiUseCase: "Search docs, fetch user profile, and query account status at the same time when they do not depend on each other.",
              plainExample: "Three slow calls in parallel can feel like one slow call."
            },
            {
              title: "Pydantic outputs",
              explanation: "Typed output models make agent results easier to validate and use in code.",
              aiUseCase: "Return final answers, citations, confidence, and next actions with a predictable shape.",
              plainExample: "The UI can render citations because the agent always returns a citations array."
            }
          ],
          commonMistakes: [
            { mistake: "Too many tools at once", better: "Start with a small tool set and add as needed" },
            { mistake: "No typed final output", better: "Use schemas for important results" },
            { mistake: "Parallelizing dependent calls", better: "Only run independent tools concurrently" }
          ],
          checklist: ["Create a simple agent", "Decorate tools", "Use typed outputs", "Know when parallel tool calls help"]
        }
      },
      {
        n: "5.6",
        title: "Human approval flows",
        items: ["Human-in-the-loop gates for sensitive operations", "Approval objects: who approved, what changed, when it expires", "Checkpointers and resumable execution after approval", "When to pause (DB writes, payments, emails, external messages, production changes)"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          goal: "Design approval gates so agents pause before high-impact actions and resume safely after approval.",
          whyIntro: "Agents should not silently take risky actions. You will use approval flows when you are:",
          conceptsTitle: "Human Approval Flows",
          whyItMatters: ["Sending emails", "Writing databases", "Making payments", "Changing production systems"],
          concepts: [
            {
              title: "Approval gates",
              explanation: "An approval gate pauses the workflow before a sensitive operation.",
              aiUseCase: "Require a human before sending external messages, charging money, deleting files, or changing records.",
              plainExample: "Draft the email, show it to a user, then send only after approval."
            },
            {
              title: "Approval objects",
              explanation: "Approval records should capture who approved, what was approved, when it expires, and what changed.",
              aiUseCase: "Create audit trails for compliance and incident review.",
              plainExample: "Approval should attach to the exact email body, not just 'send something'."
            },
            {
              title: "Resumable execution",
              explanation: "Checkpointers let a workflow pause, persist state, and resume after approval.",
              aiUseCase: "Use checkpointers for long-running agents and human-in-the-loop flows.",
              plainExample: "The agent waits overnight for approval, then continues from the same state."
            },
            {
              title: "When to pause",
              explanation: "Pause before irreversible, externally visible, expensive, or permission-sensitive actions.",
              aiUseCase: "Gate DB writes, payments, emails, Slack messages, file deletion, and production changes.",
              plainExample: "Reading an invoice is fine; paying it needs approval."
            }
          ],
          commonMistakes: [
            { mistake: "Approving vague intent", better: "Approve the exact action payload" },
            { mistake: "No expiry", better: "Expire stale approvals" },
            { mistake: "No audit record", better: "Log actor, payload, timestamp, and trace ID" }
          ],
          checklist: ["Add approval gates", "Record approval objects", "Use resumable state", "Know which actions must pause"]
        }
      },
      {
        n: "5.7",
        title: "Tool permissions and least privilege",
        items: ["Read-only vs write tools — separate them at the schema and IAM level", "Allow-lists for tables, directories, domains, and API operations", "Per-tool timeouts, max retries, max spend, and max records touched", "Audit logs for every tool call: input, output, actor, trace ID"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          goal: "Limit what each tool can do so agent mistakes are contained.",
          whyIntro: "Least privilege is how agents stay useful without becoming dangerous. You will apply it when you are:",
          conceptsTitle: "Tool Permissions",
          whyItMatters: ["Protecting data", "Limiting blast radius", "Auditing actions", "Preventing runaway costs"],
          concepts: [
            {
              title: "Read vs write tools",
              explanation: "Separate read-only tools from tools that mutate state, and protect them differently.",
              aiUseCase: "Let most users search docs, but restrict who can send messages or update records.",
              plainExample: "search_orders is lower risk than refund_order."
            },
            {
              title: "Allow-lists",
              explanation: "Allow-lists restrict which tables, directories, domains, API methods, or resources a tool can touch.",
              aiUseCase: "Prevent broad access even if the model asks for it.",
              plainExample: "A SQL tool can query approved views only, not every database table."
            },
            {
              title: "Limits and budgets",
              explanation: "Each tool should have timeouts, retries, max records, max spend, and max calls per request.",
              aiUseCase: "Stop loops, runaway queries, and expensive mistakes.",
              plainExample: "A search tool should not retrieve 10,000 records because the model asked nicely."
            },
            {
              title: "Audit logs",
              explanation: "Log every tool call with input, output summary, actor, timestamp, and trace ID.",
              aiUseCase: "Debug incidents and prove what the agent did.",
              plainExample: "You should know exactly which tool call changed a customer record."
            }
          ],
          commonMistakes: [
            { mistake: "One powerful admin tool", better: "Split tools by permission and risk" },
            { mistake: "No hard limits", better: "Enforce caps inside tools" },
            { mistake: "Logs without trace IDs", better: "Correlate tool calls with model traces and user sessions" }
          ],
          checklist: ["Separate read and write tools", "Use allow-lists", "Set per-tool limits", "Log every tool call"]
        }
      },
      {
        n: "5.8",
        title: "Agent tracing and debugging",
        items: ["Trace every model call, tool call, handoff, retry, and guardrail decision", "Correlate trace IDs with backend logs and user sessions", "Inspect token usage, latency, tool failures, and bad routing decisions", "Use trace screenshots in portfolio demos and incident reviews"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          goal: "Trace agent decisions so failures can be reproduced, understood, and fixed.",
          whyIntro: "Agents fail across prompts, tools, state, and permissions. You will use tracing when you are:",
          conceptsTitle: "Agent Tracing",
          whyItMatters: ["Debugging tool calls", "Finding cost spikes", "Investigating bad answers", "Showing portfolio evidence"],
          concepts: [
            {
              title: "Trace the full path",
              explanation: "A useful trace records model calls, tool calls, retries, guardrails, handoffs, inputs, outputs, and final answer.",
              aiUseCase: "Understand exactly where an agent made a bad decision.",
              plainExample: "The answer was wrong because the first tool returned stale data."
            },
            {
              title: "Correlate IDs",
              explanation: "Trace IDs should connect frontend requests, backend logs, tool logs, and model calls.",
              aiUseCase: "Follow one user request across your whole system.",
              plainExample: "A support ticket should link to the exact agent trace."
            },
            {
              title: "Inspect cost and latency",
              explanation: "Traces should show token usage, model latency, tool latency, retries, and failure points.",
              aiUseCase: "Optimize slow or expensive workflows based on evidence.",
              plainExample: "A single reranker call may be responsible for most latency."
            },
            {
              title: "Use traces as artifacts",
              explanation: "Good traces explain system behavior to engineers, reviewers, and incident teams.",
              aiUseCase: "Include trace screenshots in demos and postmortems.",
              plainExample: "A portfolio demo can show model call, tool call, citation, and final answer path."
            }
          ],
          commonMistakes: [
            { mistake: "Only logging final answers", better: "Trace every important step" },
            { mistake: "No redaction", better: "Redact secrets and sensitive user data in traces" },
            { mistake: "Unlinked logs", better: "Use trace IDs across frontend, backend, tools, and evals" }
          ],
          checklist: ["Trace model and tool calls", "Correlate trace IDs", "Inspect token and latency costs", "Redact sensitive trace data"]
        }
      },
      {
        n: "5.9",
        title: "Computer use & app SDKs — agents with eyes and a mouse",
        items: ["Anthropic Computer Use — agent takes screenshots and drives a desktop/browser", "OpenAI Operator / Apps SDK — agent runs inside ChatGPT or controls a browser tab", "Browser-automation agents (Playwright + LLM, browser-use, Stagehand)", "When this is the right tool vs API integration", "Sandboxing, audit trails, and \"are you sure?\" gates — these agents can do real damage"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          goal: "Know when visual/browser agents are useful and how to control their risk.",
          whyIntro: "Computer-use agents interact with real interfaces, so mistakes are visible and costly. You will use them when you are:",
          conceptsTitle: "Computer-Use Agent Basics",
          whyItMatters: ["Automating legacy UIs", "Testing apps", "Using browser workflows", "Adding safety gates"],
          concepts: [
            {
              title: "Agents with eyes",
              explanation: "Computer-use agents observe screens or browser pages, then click, type, scroll, and inspect results.",
              aiUseCase: "Automate workflows where no clean API exists.",
              plainExample: "An agent can fill a web form when the vendor does not provide an API."
            },
            {
              title: "Browser automation agents",
              explanation: "Tools like Playwright plus LLMs, browser-use, and Stagehand combine deterministic browser control with model reasoning.",
              aiUseCase: "Use them for testing, data entry, QA flows, and controlled browser tasks.",
              plainExample: "The agent can open a dashboard, filter a table, and report visible status."
            },
            {
              title: "API first when possible",
              explanation: "APIs are usually faster, safer, cheaper, and easier to test than UI automation.",
              aiUseCase: "Use computer use only when APIs are missing, incomplete, or unsuitable.",
              plainExample: "Call the CRM API if it exists; use browser control only for gaps."
            },
            {
              title: "Sandbox and approval",
              explanation: "Computer-use agents can click destructive buttons, submit forms, and expose data, so they need sandboxing, audit trails, and confirmations.",
              aiUseCase: "Require approval before sending, deleting, buying, or changing external state.",
              plainExample: "Let the agent draft the form, but ask before it submits."
            }
          ],
          commonMistakes: [
            { mistake: "Using UI automation when an API exists", better: "Prefer APIs for reliability and safety" },
            { mistake: "No confirmation before side effects", better: "Gate destructive or external actions" },
            { mistake: "No sandbox", better: "Run agents in controlled environments with audit logs" }
          ],
          checklist: ["Explain computer-use agents", "Know browser automation use cases", "Prefer APIs when available", "Add sandboxing and approval gates"]
        }
      }
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
      {
        n: "6.1",
        title: "The context window as working memory",
        items: ["Why agents \"forget\" mid-conversation", "Token budgeting per section", "The lost-in-the-middle problem", "Recency bias"],
        detail: {
          duration: "45–60 min",
          level: "Intermediate",
          status: "Required",
          goal: "Understand the context window as the agent's short-term working memory, not permanent knowledge.",
          whyIntro: "Context is the budget every agent spends. You will use this when you are:",
          conceptsTitle: "Context Window Basics",
          whyItMatters: ["Budgeting tokens", "Debugging forgotten instructions", "Handling long chats", "Choosing what context to include"],
          concepts: [
            {
              title: "Working memory",
              explanation: "The context window is the text the model can use for the current response. Anything outside it is unavailable unless retrieved or summarized back in.",
              aiUseCase: "Keep only the instructions, history, tool results, and retrieved context needed for the next answer.",
              plainExample: "If an old user preference falls out of context, the model cannot use it."
            },
            {
              title: "Token budgeting",
              explanation: "Each request has a limited budget for system instructions, user input, history, retrieved context, tool results, and output.",
              aiUseCase: "Reserve space for the answer instead of filling the entire window with context.",
              plainExample: "A 16k-token window still needs room for the model's response."
            },
            {
              title: "Lost in the middle",
              explanation: "Models often use the beginning and end of long context better than the middle.",
              aiUseCase: "Place critical rules and the most relevant evidence in strong positions.",
              plainExample: "A safety rule buried in a long transcript may be ignored."
            },
            {
              title: "Recency bias",
              explanation: "Recent turns can dominate earlier instructions or facts if context is not structured carefully.",
              aiUseCase: "Keep stable instructions in system context and user-specific facts in memory/context sections.",
              plainExample: "A recent joke from the user should not override compliance rules."
            }
          ],
          commonMistakes: [
            { mistake: "Stuffing everything into context", better: "Budget context by priority" },
            { mistake: "Assuming old chat is remembered", better: "Retrieve or summarize important facts back into context" },
            { mistake: "Putting key rules in the middle", better: "Keep critical instructions visible and structured" }
          ],
          checklist: ["Explain context as working memory", "Budget tokens by section", "Account for lost-in-the-middle", "Handle recency bias"]
        }
      },
      {
        n: "6.2",
        title: "Context structure — SYSTEM / CONTEXT / USER separation",
        items: ["What goes where", "@dynamic_prompt patterns", "Structural separation as a security defence against prompt injection", "Token budgets per section (e.g. SYSTEM=instructions, CONTEXT=retrieved data, ~2000 tokens each)"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show context template",
          hideCodeLabel: "Hide context template",
          codeLabel: "Context template",
          goal: "Separate instructions, retrieved data, memory, and user input so the model can follow the right authority.",
          whyIntro: "Context structure is reliability and security work. You will use it when you are:",
          conceptsTitle: "Context Structure",
          whyItMatters: ["Reducing prompt injection risk", "Making prompts readable", "Controlling token budgets", "Keeping data separate from instructions"],
          concepts: [
            {
              title: "SYSTEM section",
              explanation: "System content contains stable rules, behavior, safety limits, and output contracts.",
              aiUseCase: "Keep non-negotiable app instructions away from user-provided text.",
              plainExample: "A user document should not be able to rewrite the assistant's safety rules."
            },
            {
              title: "CONTEXT section",
              explanation: "Context contains retrieved chunks, memory facts, tool observations, and other data the model should use.",
              aiUseCase: "Label context clearly so the model treats it as evidence, not instructions.",
              plainExample: "Put handbook chunks under <context>, not mixed into the user question.",
              code: `<system>\nAnswer only from context when policy facts are requested.\n</system>\n\n<context>\nRetrieved policy chunks go here.\n</context>\n\n<user>\nCan I expense my home monitor?\n</user>`
            },
            {
              title: "USER section",
              explanation: "The user section carries the user's request and should not be allowed to override higher-priority instructions.",
              aiUseCase: "Defend against prompts like 'ignore previous instructions' inside user messages or documents.",
              plainExample: "The user can ask a question, but cannot grant the agent new permissions."
            },
            {
              title: "Dynamic prompts",
              explanation: "Dynamic prompts assemble context based on route, user, tools, memory, and retrieved data.",
              aiUseCase: "Build different prompt packages for support, coding, research, or approval flows.",
              plainExample: "A billing route includes billing policy; a technical route includes runbooks."
            }
          ],
          commonMistakes: [
            { mistake: "Mixing data and instructions", better: "Use clear SYSTEM / CONTEXT / USER boundaries" },
            { mistake: "No context budget", better: "Allocate approximate token budgets per section" },
            { mistake: "Trusting retrieved text as instructions", better: "Treat retrieved text as untrusted evidence" }
          ],
          checklist: ["Separate system/context/user", "Use dynamic prompts", "Budget each context section", "Reduce prompt injection risk"]
        }
      },
      {
        n: "6.3",
        title: "Short-term memory — session history",
        items: ["Sliding window of last N turns", "Message-pair preservation (don't split user from assistant)", "When to keep tool calls in history vs strip them"],
        detail: {
          duration: "45–60 min",
          level: "Intermediate",
          status: "Required",
          goal: "Manage recent conversation history without wasting context or breaking turn meaning.",
          whyIntro: "Session history is useful until it becomes noise. You will use it when you are:",
          conceptsTitle: "Short-Term Memory",
          whyItMatters: ["Maintaining conversation flow", "Keeping context small", "Preserving tool results", "Avoiding broken history"],
          concepts: [
            {
              title: "Sliding window",
              explanation: "A sliding window keeps the most recent turns and drops older turns when context grows too large.",
              aiUseCase: "Preserve recent user intent while staying within token budget.",
              plainExample: "Keep the last 10 turns, not every message from a month-long chat."
            },
            {
              title: "Message pairs",
              explanation: "User and assistant messages often depend on each other, so avoid splitting them apart.",
              aiUseCase: "Keep question-answer pairs together for coherent context.",
              plainExample: "Keeping an answer without the question can confuse the model."
            },
            {
              title: "Tool calls in history",
              explanation: "Tool calls can be useful evidence, but verbose raw outputs can overwhelm context.",
              aiUseCase: "Keep compact tool summaries or source IDs instead of full raw responses.",
              plainExample: "Store 'order status: shipped' instead of the entire API response."
            },
            {
              title: "Session vs memory",
              explanation: "Session history is temporary. Important durable facts should be promoted to longer-term memory deliberately.",
              aiUseCase: "Remember a user preference only after deciding it is stable and appropriate.",
              plainExample: "A one-time typo should not become a permanent user preference."
            }
          ],
          commonMistakes: [
            { mistake: "Keeping all chat history", better: "Use a sliding window and summaries" },
            { mistake: "Splitting message pairs", better: "Preserve user/assistant pairs" },
            { mistake: "Keeping huge tool outputs", better: "Store compact observations and references" }
          ],
          checklist: ["Use a sliding window", "Preserve message pairs", "Summarize tool results", "Separate session history from durable memory"]
        }
      },
      {
        n: "6.4",
        title: "Semantic caching",
        items: ["FAISS IndexFlatIP for sub-millisecond cosine search", "Similarity thresholds (0.97 high-stakes, 0.88 general Q&A)", "Cache HIT skips everything downstream", "Daemon-thread writes so cache never blocks response"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show cache example",
          hideCodeLabel: "Hide cache example",
          codeLabel: "Semantic cache example",
          goal: "Use semantic caching to skip repeated work when new questions are close enough to previous ones.",
          whyIntro: "Semantic caching cuts latency and cost, but only when thresholds are chosen carefully. You will use it when you are:",
          conceptsTitle: "Semantic Caching",
          whyItMatters: ["Reducing token spend", "Improving latency", "Avoiding repeated retrieval", "Scaling common Q&A"],
          concepts: [
            {
              title: "Similarity-based hits",
              explanation: "Semantic caches embed the new query and compare it to past queries.",
              aiUseCase: "Reuse an answer when the new question means the same thing as a cached one.",
              plainExample: "'How do refunds work?' and 'What's the refund policy?' may hit the same cache entry.",
              code: `if similarity(query_embedding, cached_embedding) > 0.92:\n    return cached_answer\n\nanswer = run_rag_pipeline(query)`
            },
            {
              title: "Thresholds",
              explanation: "Higher thresholds reduce wrong cache hits. Lower thresholds increase reuse but can return stale or mismatched answers.",
              aiUseCase: "Use strict thresholds for legal, medical, financial, or account-specific answers.",
              plainExample: "A password-reset question should not reuse an answer for refund policy."
            },
            {
              title: "Cache HIT path",
              explanation: "A cache hit can skip retrieval, reranking, model calls, and tool calls.",
              aiUseCase: "Serve repeated FAQ-style questions quickly and cheaply.",
              plainExample: "A cached answer can return in milliseconds instead of seconds."
            },
            {
              title: "Non-blocking writes",
              explanation: "Cache writes should not slow the user response path.",
              aiUseCase: "Write cache entries asynchronously after a successful answer.",
              plainExample: "Return the answer first, then store the embedding and answer in the background."
            }
          ],
          commonMistakes: [
            { mistake: "Threshold too low", better: "Use stricter thresholds for high-stakes answers" },
            { mistake: "Caching user-specific answers globally", better: "Scope cache by tenant, user, permissions, and data version" },
            { mistake: "Blocking on cache writes", better: "Write asynchronously after response" }
          ],
          checklist: ["Explain semantic cache hits", "Choose thresholds by risk", "Scope cache entries", "Write cache entries asynchronously"]
        }
      },
      {
        n: "6.5",
        title: "Episodic memory",
        items: ["LangChain's InMemoryStore", "LLM tags answers as EPISODIC: YES/NO so the model decides what's worth remembering", "Episodic hits enrich CONTEXT only — tools and LLM still run"],
        detail: {
          duration: "45–60 min",
          level: "Intermediate",
          status: "Required",
          goal: "Store useful past events as optional context without replacing retrieval, tools, or fresh reasoning.",
          whyIntro: "Episodic memory helps agents learn from prior interactions. You will use it when you are:",
          conceptsTitle: "Episodic Memory",
          whyItMatters: ["Remembering useful events", "Personalizing context", "Avoiding repeated explanations", "Keeping memory optional"],
          concepts: [
            {
              title: "Event memories",
              explanation: "Episodic memories are records of useful past interactions, decisions, or outcomes.",
              aiUseCase: "Store prior troubleshooting steps, user preferences, or resolved support context.",
              plainExample: "Remember that the user already tried restarting the service."
            },
            {
              title: "Memory tagging",
              explanation: "An LLM or rules can decide whether a new interaction is worth saving.",
              aiUseCase: "Tag stable preferences or important outcomes, not every message.",
              plainExample: "Save 'prefers concise answers', but not 'said hello'."
            },
            {
              title: "Memory as context",
              explanation: "Episodic hits should enrich context; they should not skip tools or fresh checks when current data matters.",
              aiUseCase: "Use past facts as hints, then verify with current systems if needed.",
              plainExample: "Past order status may be outdated, so query the order tool again."
            },
            {
              title: "Memory store choices",
              explanation: "In-memory stores are useful for demos. Production memory usually needs persistence, permissions, deletion, and auditability.",
              aiUseCase: "Start simple, then move to durable stores when memory must survive sessions.",
              plainExample: "A demo can use memory in RAM; a real app needs a database."
            }
          ],
          commonMistakes: [
            { mistake: "Remembering everything", better: "Store only useful, stable, appropriate memories" },
            { mistake: "Treating old memory as truth", better: "Verify current facts with tools" },
            { mistake: "No delete path", better: "Support memory review and removal" }
          ],
          checklist: ["Explain episodic memory", "Tag useful events", "Use memory as optional context", "Plan persistence and deletion"]
        }
      },
      {
        n: "6.6",
        title: "Context compression",
        items: ["Trigger threshold (>3000 tokens)", "Keep last 10 messages verbatim", "LLM summarises the rest into a single compressed entry", "When compression destroys information"],
        detail: {
          duration: "45–60 min",
          level: "Intermediate",
          status: "Required",
          showCodeLabel: "Show compression policy",
          hideCodeLabel: "Hide compression policy",
          codeLabel: "Compression policy",
          goal: "Compress older context while preserving facts, decisions, open tasks, and source references.",
          whyIntro: "Compression keeps long sessions usable, but it can destroy details. You will use it when you are:",
          conceptsTitle: "Context Compression",
          whyItMatters: ["Handling long conversations", "Reducing token usage", "Keeping recent turns intact", "Preserving decisions"],
          concepts: [
            {
              title: "Compression triggers",
              explanation: "Compress when history crosses a token threshold or when the next request needs room for context and output.",
              aiUseCase: "Prevent old history from crowding out retrieved evidence.",
              plainExample: "Summarize older turns when the chat exceeds 3,000 tokens.",
              code: `if history_tokens > 3000:\n    summary = summarize_old_history(history[:-10])\n    history = [summary] + history[-10:]`
            },
            {
              title: "Keep recent turns verbatim",
              explanation: "Recent messages often carry active intent, so keep them exactly when possible.",
              aiUseCase: "Preserve the current task while compressing older context.",
              plainExample: "Keep the last 10 messages unchanged and summarize the older part."
            },
            {
              title: "What to preserve",
              explanation: "A good summary preserves user goals, decisions, constraints, tool results, unresolved tasks, and source references.",
              aiUseCase: "Use structured summaries instead of vague paragraphs.",
              plainExample: "Keep 'selected model: X' and 'must deploy to AWS', not just 'discussed deployment'."
            },
            {
              title: "Compression failure",
              explanation: "Compression can omit edge cases, exact wording, IDs, or evidence needed later.",
              aiUseCase: "Do not compress legal text, code diffs, IDs, or source passages that require exactness.",
              plainExample: "A summarized contract clause may be unsafe for legal answers."
            }
          ],
          commonMistakes: [
            { mistake: "Summaries too vague", better: "Use structured summaries with decisions and open tasks" },
            { mistake: "Compressing exact evidence", better: "Keep IDs, source passages, and code verbatim when needed" },
            { mistake: "Dropping recent turns", better: "Keep recent active context unchanged" }
          ],
          checklist: ["Set compression triggers", "Keep recent turns verbatim", "Preserve decisions and sources", "Know when not to compress"]
        }
      },
      {
        n: "6.7",
        title: "Long-term memory",
        items: ["User profiles, preferences, facts to persist", "Vector stores vs structured stores", "Managed memory layers — mem0 (open-source) and Zep (managed) — when to skip building this yourself", "When memory becomes a privacy problem (GDPR, right-to-be-forgotten flows)"],
        detail: {
          duration: "60–75 min",
          level: "Intermediate",
          status: "Required",
          goal: "Design durable memory that is useful, permissioned, reviewable, and deletable.",
          whyIntro: "Long-term memory changes user trust and privacy obligations. You will use it when you are:",
          conceptsTitle: "Long-Term Memory",
          whyItMatters: ["Persisting preferences", "Personalizing agents", "Managing privacy", "Choosing memory storage"],
          concepts: [
            {
              title: "What to persist",
              explanation: "Persist stable facts, preferences, and user-approved context that will help future interactions.",
              aiUseCase: "Remember preferred language, project constraints, recurring tools, or workflow preferences.",
              plainExample: "Remember 'prefers Python examples' only if it is useful and appropriate."
            },
            {
              title: "Vector vs structured stores",
              explanation: "Vector stores help retrieve fuzzy memories. Structured stores are better for exact profiles, settings, permissions, and timestamps.",
              aiUseCase: "Use both when agents need semantic recall and reliable profile fields.",
              plainExample: "A preference flag belongs in a table; a past troubleshooting note may belong in vector memory."
            },
            {
              title: "Managed memory layers",
              explanation: "Tools like mem0 and Zep can handle memory extraction, storage, retrieval, and lifecycle patterns.",
              aiUseCase: "Use managed memory when building your own memory layer is not the core product.",
              plainExample: "Do not rebuild deletion, search, and summaries if a memory layer covers your needs."
            },
            {
              title: "Privacy and deletion",
              explanation: "Long-term memory must support user consent, review, correction, deletion, retention limits, and tenant isolation.",
              aiUseCase: "Build right-to-be-forgotten flows before memory becomes a liability.",
              plainExample: "A user should be able to delete a stored preference or sensitive fact."
            }
          ],
          commonMistakes: [
            { mistake: "Saving memories without consent", better: "Use clear policy, consent, and review paths" },
            { mistake: "Using vectors for exact permissions", better: "Use structured stores for exact facts and access control" },
            { mistake: "No deletion workflow", better: "Build memory deletion and audit from the start" }
          ],
          checklist: ["Choose what to persist", "Compare vector and structured memory", "Evaluate managed memory layers", "Plan privacy and deletion"]
        }
      }
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
