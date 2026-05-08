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
          checklist: ["Create a simple class", "Explain __init__", "Use a dataclass for structured data", "Recognize Pydantic-style schemas"]
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
            }
          ],
          commonMistakes: [
            { mistake: "Using lists for everything", better: "Use dicts for lookup, sets for uniqueness, queues for ordered work" },
            { mistake: "Mutating shared data accidentally", better: "Copy data when passing it between steps if needed" },
            { mistake: "Choosing clever structures too early", better: "Start simple and change when the data access pattern is clear" }
          ],
          checklist: ["Pick list vs dict vs set", "Use Counter for counts", "Use defaultdict for grouping", "Understand deque basics"]
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
              title: "Context managers",
              explanation: "with opens a resource and closes it safely when the block finishes.",
              aiUseCase: "Read prompt templates, JSON config, or small eval files safely.",
              plainExample: "Open a file, read it, and let Python close it even if something goes wrong.",
              code: `with open("prompt.txt", "r") as file:
    prompt_template = file.read()`
            },
            {
              title: "JSON and CSV files",
              explanation: "JSON is common for structured app data. CSV is common for simple tabular datasets.",
              aiUseCase: "Store eval cases, tool outputs, or prompt test results.",
              plainExample: "A golden dataset can be a small JSON file with question, expected answer, and expected source.",
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
          checklist: ["Use try/except safely", "Read files with with", "Load JSON data", "Handle a failed file without crashing"]
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
              title: "Retries and rate limits",
              explanation: "External APIs fail. Retry only safe failures, wait between attempts, and respect rate limits.",
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
          checklist: ["Make GET and POST calls", "Send headers", "Read status codes", "Handle rate limits"]
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
          conceptsTitle: "Database Concepts",
          whyItMatters: ["Store users and chats", "Save agent state", "Query business data", "Track eval runs", "Support production APIs"],
          concepts: [
            {
              title: "Raw SQL connections",
              explanation: "Raw SQL gives direct control over exactly what query runs.",
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
            }
          ],
          commonMistakes: [
            { mistake: "Opening a new connection per request", better: "Use pooling through your database library" },
            { mistake: "Building SQL with string formatting", better: "Use parameters to avoid injection" },
            { mistake: "Using ORM for complex queries blindly", better: "Use raw SQL when it is clearer or faster" }
          ],
          checklist: ["Run a parameterized query", "Explain ORM basics", "Know why pooling matters", "Avoid SQL injection"]
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
            }
          ],
          commonMistakes: [
            { mistake: "Accepting unvalidated dicts", better: "Use request models" },
            { mistake: "Putting all logic in the route", better: "Call helper functions or services" },
            { mistake: "Ignoring API docs", better: "Use /docs to test endpoints quickly" }
          ],
          checklist: ["Create a route", "Use a request model", "Return JSON", "Run with uvicorn"]
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
          conceptsTitle: "Async Concepts",
          whyItMatters: ["Call multiple LLMs", "Run retrieval in parallel", "Avoid blocking APIs", "Handle timeouts", "Log in the background"],
          concepts: [
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
              explanation: "Timeouts stop slow calls from hanging forever. Background tasks let non-critical work happen later.",
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
          checklist: ["Explain async/await", "Use gather", "Add a timeout", "Know when not to use async"]
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
          conceptsTitle: "Git Workflow Concepts",
          whyItMatters: ["Every job expects it", "Review AI app changes", "Track experiments", "Collaborate on PRs", "Maintain portfolio repos"],
          concepts: [
            {
              title: "Branch, commit, and push",
              explanation: "A branch isolates work, a commit saves a snapshot, and push uploads it to GitHub.",
              aiUseCase: "Work on a new RAG feature without breaking main.",
              plainExample: "Make a branch for eval changes, commit them, then push for review.",
              code: `git checkout -b add-rag-evals
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
          checklist: ["Create a branch", "Make a commit", "Open a pull request", "Write a useful README"]
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
              title: "Environment variables",
              explanation: "Environment variables store settings outside code, such as API keys and model names.",
              aiUseCase: "Configure model providers without committing secrets.",
              plainExample: "Your app reads OPENAI_API_KEY from the environment instead of from source code.",
              code: `export MODEL_NAME="gpt-4.1-mini"
echo $MODEL_NAME`
            },
            {
              title: "Logs, processes, and ports",
              explanation: "Shell commands help you see what is running and why something failed.",
              aiUseCase: "Check API errors, see whether a server is running, or find a busy port.",
              plainExample: "If localhost is not loading, check whether the server process is actually running.",
              code: `tail -f app.log
ps aux | grep uvicorn
lsof -i :8000`
            }
          ],
          commonMistakes: [
            { mistake: "Pasting commands without reading them", better: "Understand what each command changes" },
            { mistake: "Committing .env files", better: "Commit .env.example, not secrets" },
            { mistake: "Ignoring logs", better: "Read the error before changing code" }
          ],
          checklist: ["Navigate files", "Use env vars", "Read logs", "Find running processes"]
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
            }
          ],
          commonMistakes: [
            { mistake: "Only testing happy paths", better: "Test empty input, bad input, and failures" },
            { mistake: "Calling real LLMs in unit tests", better: "Mock model calls for fast, stable tests" },
            { mistake: "Testing too much at once", better: "Start with small helper-function tests" }
          ],
          checklist: ["Write a unit test", "Test a FastAPI route", "Mock an external call", "Add one regression test"]
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
