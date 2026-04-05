---
title: "Claude Certified Architect Practice Exam: 60 Questions with Detailed Explanations"
author: Rick Hightower
date: 2026-04-03
source: https://medium.com/@richardhightower/claude-certified-architect-practice-exam-60-questions-with-detailed-explanations-3a4d2267603d
series: "CCA Scenario Deep Dive Series (Part 8 of 8)"
---

# Claude Certified Architect Practice Exam: 60 Questions with Detailed Explanations

This is the final installment of the CCA Exam Prep series (Part 8 of 8). This practice exam mirrors the actual Claude Certified Architect Foundations exam — 60 multiple-choice questions distributed across all five competency domains at their official weights. Each question includes a detailed explanation that teaches you **why every wrong answer is wrong**, not just why the right answer is right.

**Exam Parameters:**
- **Questions:** 60
- **Time:** 120 minutes
- **Passing score:** 720/1000 (~43/60 correct, 72%)
- **Recommended target:** 50+/60 (83%+)
- **Difficulty distribution:** Easy 18 / Medium 27 / Hard 15

---

## Domain 1: Agentic Architecture & Orchestration (Questions 1–16)

### Question 1 (Easy)
A company needs to build a research system where a central agent assigns tasks to specialized agents (web search, document analysis, fact-checking), then combines their results into a unified report. Which multi-agent pattern best fits this requirement?

A) Peer-to-peer mesh where all agents communicate directly with each other
B) **Coordinator-subagent pattern** with hub-and-spoke topology
C) Sequential pipeline where each agent passes output to the next
D) Shared-memory architecture where all agents read/write to a common context store

**Correct Answer: B**

**Explanation:** The **coordinator-subagent pattern** (hub-and-spoke) is the foundational multi-agent architecture tested on the CCA exam. A central coordinator delegates tasks to specialized subagents, collects their results, and synthesizes the final output. Option A (peer-to-peer mesh) creates unmanageable complexity — agents don't coordinate directly with each other; all coordination flows through the coordinator. Option C (sequential pipeline) is wrong because the tasks described are **independent and parallel**, not sequential. Option D (shared-memory) violates the principle of **context isolation** — subagents should not share a common state store.

> **Exam Trap:** The peer-to-peer mesh sounds sophisticated but violates the hub-and-spoke principle. On the CCA, the coordinator is always the single point of orchestration.

---

### Question 2 (Medium)
What is the correct sequence of steps in the **agentic loop** when Claude uses a tool during a conversation?

A) generate → end_turn → tool_use → execute → result
B) tool_use → generate → execute → result → end_turn
C) **generate → tool_use → execute → result → generate → end_turn**
D) execute → tool_use → generate → result → end_turn

**Correct Answer: C**

**Explanation:** The **agentic loop** follows a precise sequence: the model **generates** a response, which includes a **tool_use** request (indicated by `stop_reason: "tool_use"`), the tool is **executed** externally, the **result** is returned to the model, the model **generates** again incorporating the result, and finally signals **end_turn** when complete. Option A incorrectly places end_turn before tool execution. Option B starts with tool_use before any generation. Option D starts with execute, which cannot happen before the model requests a tool call.

> **CCA Exam Tip:** The `stop_reason: "tool_use"` means the model is **requesting** tool execution, not that execution is complete. You must return the tool result to continue the loop.

---

### Question 3 (Hard)
A coordinator agent delegates a complex research task to a subagent. The subagent needs access to the customer's previous conversation history to provide context-aware results. How should this be implemented?

A) The subagent automatically inherits the coordinator's full conversation history
B) Use `shared_context=True` parameter when creating the subagent
C) **Explicitly include relevant context in the subagent's prompt string**
D) Store conversation history in a shared database that both agents access

**Correct Answer: C**

**Explanation:** **Subagents do not inherit the coordinator's context.** This is the most frequently tested concept on the CCA exam. When a subagent is created via the Agent tool, it receives only its **prompt string** and its own **system prompt** — nothing else. The coordinator must **explicitly include** any relevant information in the prompt it sends to the subagent. Option A is the most common misconception — many candidates assume context inheritance happens automatically. Option B references a non-existent parameter. Option D violates context isolation principles by introducing shared state.

> **Exam Trap:** "Many assume subagents inherit context. They do not." This single sentence captures the most important architectural concept on the CCA exam.

---

### Question 4 (Medium)
A development team needs to process three independent code review tasks and one sequential documentation task that depends on all three reviews being complete. Which architecture is optimal?

A) A single agent handles all four tasks sequentially
B) Four separate agents, one per task, running in parallel
C) **Three parallel subagents for independent reviews + coordinator synthesizes for the documentation task**
D) A pipeline architecture where each review passes to the next

**Correct Answer: C**

**Explanation:** The correct decomposition strategy is: **independent tasks → parallel subagents; dependent tasks → coordinator synthesis**. The three code reviews are independent and can run in parallel via subagents. The documentation task requires all three results and should be handled by the coordinator after collecting subagent outputs. Option A wastes time by serializing independent tasks. Option B creates four parallel agents but the documentation task depends on the reviews — it cannot run in parallel with them. Option D forces sequential execution of independent tasks.

> **CCA Exam Tip:** The decomposition decision tree: Sequential + shared context → single agent. Independent + parallel → subagents. Dependent on prior results → coordinator synthesis.

---

### Question 5 (Medium)
A subagent in a multi-agent research system encounters a network error while fetching a web page. Which error handling approach is correct?

A) Return an empty result so the coordinator can continue with other subagents
B) Silently retry indefinitely until the request succeeds
C) Throw an unhandled exception to terminate the entire system
D) **Return a structured status object with `{"status": "failure", "error": "network_timeout", "details": "..."}`**

**Correct Answer: D**

**Explanation:** **Silent failure** is a critical anti-pattern in multi-agent systems. The correct approach is to return a **structured status object** that clearly indicates success, failure, or partial completion with error details. Option A is the silent failure anti-pattern — returning `{"status": "success", "data": null}` causes the coordinator to misinterpret the result as "no data found" rather than "data retrieval failed." Option B (infinite retry) can cause the entire system to hang. Option C (unhandled exception) is overly destructive — one subagent failure shouldn't terminate the system.

> **Exam Trap:** The difference between "no data found" and "failed to retrieve data" is architecturally critical. Structured error reporting enables the coordinator to make informed decisions about retry, fallback, or escalation.

---

### Question 6 (Medium)
In the Claude API, which `tool_choice` setting **guarantees** that Claude will call a specific named tool?

A) `tool_choice: "auto"` — Claude will choose the most appropriate tool
B) `tool_choice: "any"` — Claude must use at least one tool
C) **`tool_choice: {"type": "tool", "name": "extract_data"}` — forces the specific named tool**
D) `tool_choice: "none"` — disables all tools and forces text output

**Correct Answer: C**

**Explanation:** Only the **named-tool** format (`{"type": "tool", "name": "X"}`) **guarantees** that Claude will call a specific tool. `auto` (Option A) lets the model decide — it may or may not use tools. `any` (Option B) forces tool use but doesn't specify which tool. `none` (Option D) disables tools entirely. The named-tool format is essential for **deterministic enforcement** in scenarios like structured data extraction where you need guaranteed schema compliance.

> **CCA Exam Tip:** Know all four `tool_choice` values cold: `auto` (model decides), `any` (must use a tool), `none` (no tools), `{"type": "tool", "name": "X"}` (forced specific tool).

---

### Question 7 (Hard)
A customer support system needs to create a specialized branch of the conversation to explore a complex issue while preserving the ability to return to the main conversation flow. Which feature enables this?

A) Create a new conversation with a summary of the previous context
B) Use a subagent with the full conversation history pasted into its prompt
C) **Use `fork_session=True` to create a session branch with the full conversation history**
D) Save the conversation state to a database and restore it later

**Correct Answer: C**

**Explanation:** **Context forking** via `fork_session=True` creates a complete copy of the current session's conversation history as an independent branch. This allows exploration of a complex path without contaminating the main conversation flow. Option A loses the full conversation nuance in summarization. Option B technically works but is inefficient and doesn't preserve the session state properly. Option D is overly complex for what the SDK provides natively.

---

### Question 8 (Easy)
What is the primary purpose of the **system prompt** in a Claude API call?

A) To provide user-specific preferences for each request
B) **To establish persistent behavioral instructions, role definitions, and constraints that apply across the entire conversation**
C) To override the model's default safety guidelines
D) To store conversation history between sessions

**Correct Answer: B**

**Explanation:** The **system prompt** defines the agent's persistent context — its role, behavioral rules, output format requirements, and domain constraints. It is loaded at the start of every conversation and shapes all subsequent responses. Option A describes user-level configuration, not system prompt purpose. Option C is incorrect — system prompts cannot override safety guidelines. Option D confuses system prompts with conversation persistence mechanisms.

---

### Question 9 (Hard)
A customer support agent has attempted to resolve a complex billing dispute but cannot find a satisfactory solution after checking all available tools. What is the correct escalation pattern?

A) Have the agent report a confidence score and escalate if below the threshold
B) Retry with increasingly detailed prompts until the agent resolves the issue
C) **Bounded retry (2–3 attempts with specific error feedback) → escalate to human with full conversation history**
D) Escalate immediately without any retry attempts to minimize customer wait time

**Correct Answer: C**

**Explanation:** The correct escalation pattern involves **bounded retry** (2–3 attempts maximum) where each retry includes **specific error feedback** from the previous attempt, followed by **human escalation with full conversation history** if resolution fails. Option A uses self-reported confidence, which is **not calibrated** — LLMs exhibit overconfidence and the scores are not derived from probability distributions. Option B has no upper bound on retries, creating potential infinite loops. Option D wastes resources by escalating before attempting resolution.

> **Exam Trap:** Self-reported confidence scores (85%, 92%, etc.) are the most common wrong answer in escalation questions. The model's stated certainty does not reliably correlate with actual accuracy. Always choose deterministic rules.

---

### Question 10 (Easy)
A single Claude agent has been assigned 18 different tools for a research task. Tool selection accuracy has degraded significantly. What is the recommended solution?

A) Improve the system prompt to provide clearer guidance on tool selection
B) Add few-shot examples showing the correct tool for each scenario
C) **Distribute tools across specialized subagents, with 4–5 tools each**
D) Increase the context window to give the model more space for tool reasoning

**Correct Answer: C**

**Explanation:** The **4–5 tool rule** is a key CCA principle. Tool selection accuracy degrades measurably as the number of available tools increases. The correct pattern is to create **specialized subagents**, each with a focused set of 4–5 tools. A coordinator delegates to the appropriate subagent based on the task type. Option A may help marginally but doesn't address the fundamental issue. Option B is ineffective because few-shot examples don't reliably control tool selection. Option D is irrelevant — tool selection degradation is an attention distribution problem, not a capacity problem.

> **CCA Exam Tip:** Whenever a question describes an agent with more than 4–5 tools experiencing problems, the answer involves splitting into specialized subagents.

---

### Question 11 (Easy)
In a coordinator-subagent architecture, how do subagents communicate with each other?

A) Subagents share a message bus for direct inter-agent communication
B) Subagents use a shared memory store to pass data
C) **Subagents do not communicate directly — all coordination flows through the coordinator**
D) Subagents use peer-to-peer protocols to exchange intermediate results

**Correct Answer: C**

**Explanation:** In the hub-and-spoke model, **all communication flows through the coordinator**. Subagents never communicate directly. Think of the **newsroom mental model**: reporters (subagents) submit articles to the editor (coordinator), who combines them. If the politics reporter has context that helps the finance reporter, it must go through the editor first. Options A, B, and D all describe direct inter-agent communication, which violates hub-and-spoke topology.

---

### Question 12 (Medium)
A multi-agent system needs to perform three research tasks. Task B depends on Task A's results, but Task C is completely independent. What is the optimal execution strategy?

A) Run all three tasks sequentially: A → B → C
B) Run all three tasks in parallel with result synchronization
C) **Run Task A first, then run Task B and Task C in parallel**
D) Run Task C first since it's independent, then A → B sequentially

**Correct Answer: C**

**Explanation:** The optimal strategy respects both dependencies and parallelism. Task A must complete first because Task B depends on it. Once A completes, Task B (which needs A's results) and Task C (which is independent) can run in **parallel**. Option A unnecessarily serializes the independent Task C. Option B is impossible because B depends on A. Option D's ordering of C first is suboptimal — starting A immediately is better since B depends on it.

---

### Question 13 (Medium)
When designing an escalation system, which criteria should trigger automatic escalation to a human agent? (Select the best answer)

A) When the model's self-reported confidence drops below 80%
B) **When deterministic business rules are met: transaction amount > $500, account closure requests, regulatory inquiries**
C) When the customer expresses frustration in their messages
D) When the agent has been unable to resolve the issue after 10 retry attempts

**Correct Answer: B**

**Explanation:** Escalation must be based on **deterministic business rules** evaluated programmatically, not on probabilistic model assessments. Specific dollar thresholds, account action types (closure, cancellation), customer tiers (VIP), and issue categories (legal, regulatory) are coded into the system. Option A relies on self-reported confidence, which is not calibrated. Option C uses sentiment analysis which is probabilistic. Option D allows too many retries — the bounded retry pattern recommends 2–3 attempts maximum.

---

### Question 14 (Hard)
A subagent returns `{"status": "success", "data": null}` after attempting to fetch customer records. What is the architectural problem with this response format?

A) The status field should use numeric codes instead of strings
B) Null data is a valid response indicating no matching records were found
C) **The response conflates "no data found" with "data retrieval failed," creating a silent failure**
D) The response should include a timestamp for audit logging

**Correct Answer: C**

**Explanation:** This is the **silent failure anti-pattern**. When `data` is null, the coordinator cannot distinguish between "no matching records exist" (a valid result) and "the database query failed" (an error requiring retry or escalation). The correct response format should use structured status reporting: `{"status": "failure", "error_type": "database_connection_timeout", "details": "..."}` for failures, and `{"status": "success", "data": [], "count": 0}` for genuinely empty results.

---

### Question 15 (Easy)
Which `tool_choice` setting should be used when you want Claude to generate a text-only response without calling any tools?

A) `tool_choice: "auto"`
B) `tool_choice: "any"`
C) `tool_choice: {"type": "tool", "name": "respond_text"}`
D) **`tool_choice: "none"`**

**Correct Answer: D**

**Explanation:** `tool_choice: "none"` explicitly disables all tool use and forces Claude to generate a text-only response. `auto` (Option A) allows but doesn't prevent tool use. `any` (Option B) forces tool use. Named-tool (Option C) forces a specific tool. When you need to guarantee no tools are called, `none` is the only correct option.

---

### Question 16 (Medium)
The AI Fluency Framework identifies four dimensions needed for effective AI collaboration. What are they?

A) Design, Development, Deployment, Debugging
B) **Delegation, Description, Discernment, Diligence**
C) Direction, Documentation, Determination, Delivery
D) Discovery, Definition, Decomposition, Demonstration

**Correct Answer: B**

**Explanation:** The **4D AI Fluency Framework** consists of: **Delegation** (knowing when to delegate to AI vs. handle manually), **Description** (ability to clearly describe tasks and requirements), **Discernment** (ability to evaluate AI outputs for correctness), and **Diligence** (consistent application of best practices). These four dimensions define what it means to be "AI fluent" in production environments.

---

## Domain 2: Context Engineering (Questions 17–28)

### Question 17 (Easy)
Where should the project-level `CLAUDE.md` file be placed so it is shared with the entire team via version control?

A) In the user's home directory (`~/.claude/CLAUDE.md`)
B) **In the project root (`./CLAUDE.md` or `./.claude/CLAUDE.md`)**
C) In the user's local configuration (`CLAUDE.local.md`)
D) In the system-wide configuration directory (`/etc/claude-code/CLAUDE.md`)

**Correct Answer: B**

**Explanation:** The **project-level** CLAUDE.md belongs at the project root (or `.claude/` subdirectory) and is version-controlled via git. This ensures the entire team shares the same project standards through code review. Option A is the **user-level** location (personal, not version-controlled). Option C is the **local-level** override (gitignored). Option D is the **managed/organization-level** location (IT-deployed, highest authority).

> **Exam Trap:** Putting personal preferences in the project CLAUDE.md forces your settings on the entire team — a common anti-pattern.

---

### Question 18 (Hard)
What are the four levels of the CLAUDE.md hierarchy, from highest authority to lowest?

A) System → Global → Project → Local
B) Organization → Team → User → Session
C) **Managed/Org → Project → User → Local**
D) Admin → Project → Developer → Personal

**Correct Answer: C**

**Explanation:** The four-level CLAUDE.md hierarchy is: **Managed/Org** (IT-deployed, cannot be overridden, highest authority) → **Project** (version-controlled, team-shared) → **User** (`~/.claude/CLAUDE.md`, personal across all projects) → **Local** (`CLAUDE.local.md`, gitignored, personal + project-specific). All four levels are **loaded and combined**, with higher levels taking precedence. Most study materials only cover Project and User levels — knowing all four is critical.

> **CCA Exam Tip:** The managed/org level **cannot be overridden** by any lower level. This is the key differentiator from the other levels.

---

### Question 19 (Medium)
A developer wants to add personal code style preferences that apply only to a specific project without affecting the team's shared configuration. Which file should they use?

A) `./CLAUDE.md` — the project-level configuration
B) `~/.claude/CLAUDE.md` — the user-level configuration
C) **`CLAUDE.local.md` — the local-level, gitignored configuration**
D) `.mcp.json` — the MCP configuration file

**Correct Answer: C**

**Explanation:** `CLAUDE.local.md` is the **local-level** configuration file that is **gitignored** — personal preferences specific to one project that are not shared with the team. Option A would modify the team's shared configuration. Option B applies personal preferences across **all** projects, not just one. Option D is for MCP server configuration, not code style preferences.

> **Exam Trap:** CLAUDE.local.md is the most frequently overlooked level in the hierarchy. It exists specifically for personal per-project overrides that shouldn't be committed.

---

### Question 20 (Medium)
What is the key difference between **Skills** and **CLAUDE.md** instructions?

A) Skills are more powerful than CLAUDE.md instructions
B) Skills are version-controlled while CLAUDE.md is not
C) **Skills are loaded on-demand for specific tasks; CLAUDE.md instructions are always loaded and broadly applied**
D) Skills and CLAUDE.md are functionally identical

**Correct Answer: C**

**Explanation:** The critical distinction is **loading behavior**. **CLAUDE.md** files are **always loaded** at the start of every conversation and apply broadly to all tasks. **Skills** are **on-demand** — loaded only when a specific task or slash command triggers them, providing task-specific expertise without always consuming context. Option A is misleading — they serve different purposes, not different power levels. Option B reverses the truth — project CLAUDE.md is version-controlled.

---

### Question 21 (Easy)
Where should team-shared MCP server definitions be configured?

A) `~/.claude.json` in the user's home directory
B) **`.mcp.json` in the project root**
C) `CLAUDE.md` in the project root
D) Environment variables in the CI/CD pipeline

**Correct Answer: B**

**Explanation:** `.mcp.json` at the project root is the **project-level** MCP configuration file. It is **version-controlled** and shared with the team via code review. `~/.claude.json` (Option A) is for **personal** MCP servers and credentials — not version-controlled. CLAUDE.md (Option C) is for behavioral instructions, not MCP server definitions. Environment variables (Option D) may hold credentials but not server definitions.

---

### Question 22 (Medium)
A large codebase has 47 service files totaling 380K tokens. A developer loads all files into a single session and asks Claude to refactor the authentication middleware. What will most likely happen?

A) Claude will successfully refactor all 47 files with consistent quality
B) Claude will refuse the task because the context window is exceeded
C) **Early files will be well-refactored, middle files will show quality degradation, and late files may conflict with early ones**
D) Claude will process only the first 10 files and ignore the rest

**Correct Answer: C**

**Explanation:** This demonstrates the **"Lost in the Middle" effect** and **context degradation**. Transformer models pay more attention to the **beginning and end** of the context window and less to the **middle**. The result is: Files 1–5 get thorough refactoring, Files 15–30 show naming inconsistencies and missed edge cases, Files 40–47 may show quality recovery due to recency attention but with **import pattern conflicts** against early files. Context degradation is an **attention** problem, not a **capacity** problem.

> **Exam Trap:** "Increase the context window size" is always wrong. A larger window distributes attention more thinly. 200K tokens of focused context outperforms 1M tokens of dumped context.

---

### Question 23 (Easy)
What is the correct approach for large codebase refactoring tasks?

A) Load the entire source directory into a single session
B) Use a larger context window model
C) **Decompose into focused per-file passes: decompose → execute → compose → review**
D) Add detailed instructions to the system prompt about prioritizing middle-file attention

**Correct Answer: C**

**Explanation:** The correct pattern is **focused per-file passes**: (1) **Decompose** the large task into file/module units, (2) **Execute** each unit in a focused session with only relevant context, (3) **Compose** the results, (4) **Review** for cross-file consistency (naming conventions, import paths, interface contracts). This is described as the "surgery" approach — a surgeon doesn't operate on all organs simultaneously.

---

### Question 24 (Hard)
In a monorepo with multiple components, how should CLAUDE.md files be organized?

A) A single CLAUDE.md at the repository root covers all components
B) Each component gets its own CLAUDE.md with no root-level file
C) **A project-level CLAUDE.md at the repository root + component-specific CLAUDE.md files in subdirectories**
D) Use separate repositories instead of component-level CLAUDE.md files

**Correct Answer: C**

**Explanation:** The correct monorepo strategy is **layered CLAUDE.md files**: a root-level file with shared project standards, plus subdirectory files with component-specific instructions. Claude **automatically loads** the subdirectory CLAUDE.md when reading files in that subdirectory, combining it with the root-level file. Option A misses component-specific guidance. Option B misses shared standards. Option D avoids the problem entirely.

---

### Question 25 (Medium)
Where should personal MCP server credentials be stored?

A) In `.mcp.json` at the project root
B) **In `~/.claude.json` in the home directory (not version-controlled)**
C) In `CLAUDE.md` at the project root
D) In environment variables committed to the repository

**Correct Answer: B**

**Explanation:** Personal credentials belong in `~/.claude.json`, which is a **personal, non-version-controlled** file. `.mcp.json` (Option A) is version-controlled and shared with the team — credentials should never be committed. CLAUDE.md (Option C) is for behavioral instructions. Environment variables in the repo (Option D) would expose credentials in version control.

---

### Question 26 (Medium)
Which information placement strategy optimizes Claude's attention in a long context window?

A) Place the most important information in the middle for balanced attention
B) Distribute critical information evenly throughout the context
C) **Place critical information at the start or end of the context (avoid the middle)**
D) Context placement doesn't matter with modern large context windows

**Correct Answer: C**

**Explanation:** Due to the **"Lost in the Middle" effect**, transformer models exhibit a U-shaped attention distribution — **high attention at the beginning and end**, **low attention in the middle**. Critical information (system prompt, key instructions, important constraints) should be placed at the **start or end** of the context window. This phenomenon is independent of context window size — it occurs in both small and large windows.

---

### Question 27 (Easy)
A developer needs to configure a personal preference that applies across ALL their projects. Where should this be configured?

A) In each project's `CLAUDE.md` file
B) **In `~/.claude/CLAUDE.md` (user-level configuration)**
C) In `CLAUDE.local.md` in each project
D) In the managed/org CLAUDE.md

**Correct Answer: B**

**Explanation:** `~/.claude/CLAUDE.md` is the **user-level** configuration — personal preferences that apply across all projects for that user. It is not version-controlled. Option A would require duplicating the preference in every project and affecting team members. Option C is per-project, not cross-project. Option D is organization-level, controlled by IT/DevOps.

---

### Question 28 (Hard)
An IT team needs to enforce organization-wide security policies that no individual developer or project can override. Which CLAUDE.md level should they use?

A) Project-level CLAUDE.md with strict code review requirements
B) User-level CLAUDE.md deployed to all developer machines
C) **Managed/Org level CLAUDE.md (highest authority, cannot be overridden)**
D) Local-level CLAUDE.md with enforcement scripts

**Correct Answer: C**

**Explanation:** The **Managed/Org level** is the highest authority in the CLAUDE.md hierarchy and **cannot be overridden** by any lower level. It is deployed by IT to system-wide locations (`/Library/Application Support/ClaudeCode/CLAUDE.md` on macOS, `/etc/claude-code/CLAUDE.md` on Linux). Option A can be modified by developers with commit access. Option B can be changed by individual developers. Option D is gitignored and individually controlled.

---

## Domain 3: Tool Design & Integration (Questions 29–40)

### Question 29 (Easy)
In a CI/CD pipeline, which flag combination is essential for running Claude Code non-interactively with reproducible behavior?

A) `--interactive --verbose`
B) `--batch --quiet`
C) **`-p --bare`**
D) `--headless --no-prompt`

**Correct Answer: C**

**Explanation:** **`-p`** (short for `--print`) enables **non-interactive mode** — essential because without it, Claude Code enters interactive mode and **waits for input that never arrives**, causing the pipeline to hang. **`--bare`** skips hooks, LSP, plugins, skill scanning, automatic memory, and OAuth for **reproducible behavior** across environments. Option A uses non-existent flags. Option B uses incorrect flag names. Option D also uses non-existent flags.

> **Exam Trap:** "Increase the pipeline timeout to 120 minutes" is a symptom treatment, not a root cause fix. The hang is caused by the missing `-p` flag.

---

### Question 30 (Medium)
What is the purpose of the `--output-format json` flag in CI/CD pipelines?

A) It forces Claude to generate only JSON content in its responses
B) It enables verbose logging in JSON format
C) **It provides machine-parseable structured output for programmatic pipeline consumption**
D) It converts Claude's internal reasoning to JSON for debugging

**Correct Answer: C**

**Explanation:** `--output-format json` ensures that Claude Code's output is in a **machine-parseable** format suitable for programmatic consumption by downstream pipeline steps. Two anti-patterns exist: (1) parsing natural language output with regex (fails intermittently because format varies between runs), (2) using prompt instructions like "always respond in JSON" (probabilistic, not guaranteed — Claude may wrap in markdown or add explanatory text). The flag is the **guarantee**, the prompt is the **suggestion**.

---

### Question 31 (Medium)
A PreToolUse hook checks whether a developer has run linting before allowing code commits. Why is this approach preferred over prompt-based instructions?

A) Hooks are faster to execute than prompt-based checks
B) Hooks provide better error messages
C) **Hooks enforce rules programmatically (deterministically), while prompt-based instructions are probabilistic**
D) Hooks are easier to configure

**Correct Answer: C**

**Explanation:** **Programmatic enforcement > prompt-based guidance** is a foundational CCA principle. A **PreToolUse hook** is a deterministic gate — it either allows or blocks the tool execution based on coded conditions. Prompt-based instructions ("always run linting before committing") are **probabilistic nudges** — the model may skip them under context pressure or complex reasoning paths. For **security rules, compliance requirements, and workflow gates**, programmatic enforcement is always the correct answer.

---

### Question 32 (Easy)
What is the primary mechanism by which Claude decides which tool to call?

A) The tool's name
B) The agent's system prompt
C) **The tool's description**
D) The order in which tools are defined

**Correct Answer: C**

**Explanation:** The **tool description** is the primary mechanism for tool selection. Claude reads the description to determine which tool matches the current task. Not the tool name, not the agent name, not the definition order. A vague description like "handles customer requests" leads to incorrect tool selection. Write descriptions as if documenting for a developer who has never seen your codebase — clear, specific, and unambiguous.

---

### Question 33 (Hard)
What are the three MCP (Model Context Protocol) primitives, and when should each be used?

A) Client, Server, Endpoint
B) Request, Response, Stream
C) **Tool (execute actions), Resource (read-only data), Prompt (reusable templates)**
D) Input, Process, Output

**Correct Answer: C**

**Explanation:** The three **MCP primitives** are: **Tool** — executable functions that make something happen (DB queries, API calls, file writes); **Resource** — read-only data for context (documents, schemas, knowledge bases); **Prompt** — reusable instruction templates/workflows. The key decision: "Does Claude need to **execute** something?" → Tool. "Does Claude need to **read** something for context?" → Resource. Getting the **Tool vs Resource boundary** correct is the core skill of the Tool Design domain.

> **CCA Exam Tip:** The Tool vs Resource boundary causes the **highest unexpected point loss** according to early test-takers.

---

### Question 34 (Medium)
In a CI/CD pipeline, which flag restricts which tools Claude Code can use to prevent unintended actions?

A) `--allowedTools` — limits available tools to the specified list
B) `--disabledTools` — blocks specific tools from being used
C) **`--tools` — restricts available tools to only the specified set**
D) `--sandbox` — enables tool sandboxing mode

**Correct Answer: C**

**Explanation:** `--tools` **restricts** the available tools to only those specified. For example, `--tools Read,Bash` means Claude can only use Read and Bash — nothing else. `--allowedTools` (Option A) is different: it **pre-approves** specified tools to run without permission prompts, but does NOT restrict which tools are available. This is a common confusion point. For preventing unintended actions in CI/CD, `--tools` is the correct answer.

> **Exam Trap:** `--tools` = restriction (sandbox). `--allowedTools` = pre-approval (convenience). They are NOT the same concept. When the question mentions "preventing unintended actions," the answer is `--tools`.

---

### Question 35 (Medium)
When combining `--output-format json` with `--json-schema`, where does the structured output appear in the response?

A) In the `result` field
B) In the `content` field
C) **In the `structured_output` field**
D) In the `data` field

**Correct Answer: C**

**Explanation:** When using JSON schema-constrained output, the structured result appears in the **`structured_output`** field, not the `result` field. This is a specific implementation detail that the exam tests. The field name must be known exactly for parsing pipeline output correctly.

---

### Question 36 (Easy)
What does the `--bare` flag skip when running Claude Code?

A) Only hooks and plugins
B) Only MCP server connections
C) **Hooks, LSP, plugin synchronization, skill directory scanning, automatic memory, and OAuth/keychain authentication**
D) Only the CLAUDE.md auto-discovery

**Correct Answer: C**

**Explanation:** `--bare` is Claude Code's headless mode that skips: **hooks**, **LSP** (Language Server Protocol), **plugin synchronization**, **skill directory scanning**, **automatic memory**, and **OAuth/keychain authentication**. Because it skips OAuth, you must explicitly set the `ANTHROPIC_API_KEY` environment variable. Anthropic recommends `--bare` as the standard CI/CD mode and plans to make it the default for `-p` in a future release.

---

### Question 37 (Hard)
A tool description reads: "Handles customer requests." Why is this problematic?

A) It is too short for the API requirements
B) It uses passive voice instead of active voice
C) **It is vague and will lead to incorrect tool selection — Claude cannot determine when to use this tool vs. alternatives**
D) It should include example inputs and outputs

**Correct Answer: C**

**Explanation:** Vague tool descriptions are a primary cause of incorrect tool selection. "Handles customer requests" could match almost any customer-related task, leading to **tool confusion** when multiple tools are available. A proper description should be specific: "Processes customer refund requests by validating the refund amount against the customer's purchase history and authorization limits, then submitting the refund to the financial system." Clear purpose, minimal overlap with other tools.

---

### Question 38 (Medium)
What is the correct pattern for ensuring Claude's API output conforms to a specific JSON structure?

A) Add "always respond in valid JSON" to the system prompt
B) Provide few-shot examples of the expected JSON format
C) **Use `tool_choice` with a tool whose `input_schema` matches the desired structure (tool-forcing)**
D) Post-process Claude's text output with a JSON parser

**Correct Answer: C**

**Explanation:** **Tool-forcing** (defining a tool with the desired `input_schema` and using `tool_choice` to force its invocation) guarantees **structural conformance** at the API level. The system prompt approach (Option A) is probabilistic — Claude may add markdown fencing or explanatory text. Few-shot examples (Option B) demonstrate format but don't enforce it. Post-processing (Option D) fails when the output isn't valid JSON at all. Tool-forcing is **Level 2** of the three-level reliability model.

---

### Question 39 (Medium)
Which stop reason indicates that Claude is requesting a tool execution?

A) `end_turn`
B) `max_tokens`
C) **`tool_use`**
D) `stop_sequence`

**Correct Answer: C**

**Explanation:** `stop_reason: "tool_use"` indicates that Claude is **requesting** tool execution. The client must execute the tool and return the result to continue the conversation loop. `end_turn` means the response is complete. `max_tokens` means the token limit was reached (response may be truncated). Not checking the `tool_use` stop reason means you miss tool call requests entirely — breaking the agentic loop.

---

### Question 40 (Hard)
In a structured data extraction pipeline, what are the three levels of reliability, in order from least to most reliable?

A) Schema validation → prompt guidance → programmatic testing
B) Manual review → automated testing → production monitoring
C) **Prompt guidance → schema enforcement (tool-forcing) → programmatic semantic validation**
D) Type checking → integration testing → end-to-end testing

**Correct Answer: C**

**Explanation:** The **three-level reliability model** for data extraction is: **Level 1: Prompt guidance** ("always return valid JSON" — probabilistic nudge, lowest reliability); **Level 2: Schema enforcement** (tool-forcing with `tool_choice` + `input_schema` — guarantees structural conformance); **Level 3: Programmatic semantic validation** (business rule code that verifies the actual accuracy of extracted values — highest reliability). Each level only makes sense if the previous level succeeds. Running semantic validation on structurally invalid data wastes compute.

> **CCA Exam Tip:** When the exam presents prompt-enhancement answers ("add more detailed formatting instructions"), eliminate them immediately. The exam consistently rewards programmatic enforcement.

---

## Domain 4: Security & Compliance (Questions 41–48)

### Question 41 (Easy)
A system processes customer data that includes personally identifiable information (PII). What must be done before sending this data to Claude?

A) Include a disclaimer in the system prompt about data handling
B) Use a smaller model to reduce data exposure
C) **Anonymize PII before sending it to the model, enforced via hooks**
D) Request the customer's consent in real-time before each API call

**Correct Answer: C**

**Explanation:** **PII anonymization** must be performed **before** data reaches the model, and this must be enforced **programmatically** via hooks (PreToolUse or similar). A prompt disclaimer (Option A) is not enforcement — it's guidance that can be ignored. Using a smaller model (Option B) doesn't address data exposure. Real-time consent (Option D) is operationally impractical. The principle: security rules must be **deterministic**, not probabilistic.

---

### Question 42 (Medium)
An organization wants to ensure that a read-only analytics agent cannot accidentally write to production databases. Which security principle applies?

A) Defense in depth — multiple layers of security checks
B) Role-based access control — assign roles to agents
C) **Principle of least privilege — grant only the minimum permissions required for the task**
D) Zero trust — verify every request regardless of source

**Correct Answer: C**

**Explanation:** The **principle of least privilege** dictates that each agent should have only the permissions it needs to perform its specific task. A read-only analytics agent should have read access only — no write, delete, or modify permissions. This is enforced at the tool level (only provide read tools) and at the infrastructure level (database role with SELECT-only permissions). While defense in depth (Option A) is a valid concept, least privilege is the specific principle being applied here.

---

### Question 43 (Hard)
A compliance team wants to ensure that no Claude agent in the organization can process financial transactions above $10,000 without human approval. How should this be enforced?

A) Add a clear instruction to every agent's system prompt stating the $10,000 limit
B) Train all developers to implement the limit in their application code
C) **Implement a PreToolUse hook that programmatically blocks financial tool calls above $10,000 without human approval**
D) Configure a monitoring system that alerts when limits are exceeded

**Correct Answer: C**

**Explanation:** Financial compliance rules must be enforced **programmatically** with deterministic controls. A **PreToolUse hook** acts as a programmatic gate that intercepts tool calls before execution and validates them against business rules. Option A (prompt instruction) is probabilistic — the model might ignore it under complex reasoning. Option B relies on developer discipline, which is not enforceable. Option D (monitoring) detects violations after they occur rather than preventing them.

> **Exam Trap:** Prompt-based rules are NEVER the correct answer for security and compliance on the CCA exam. Always choose programmatic enforcement.

---

### Question 44 (Medium)
Which approach correctly enforces output format compliance in a regulated industry?

A) System prompt instructions: "You must always respond in the approved format"
B) Few-shot examples demonstrating the correct output format
C) **Programmatic validation with schema enforcement + business rule verification**
D) Manual review of every output before delivery

**Correct Answer: C**

**Explanation:** In regulated industries, output format compliance requires **programmatic enforcement** — schema enforcement (tool-forcing or `--json-schema`) combined with business rule verification code. System prompt instructions (Option A) and few-shot examples (Option B) are both probabilistic. Manual review (Option D) doesn't scale and introduces human error. The three-level reliability model applies: prompt (lowest) → schema enforcement (structural) → programmatic validation (semantic, highest).

---

### Question 45 (Easy)
An agent-based system must maintain a complete record of all actions taken for regulatory audit purposes. Where should this be implemented?

A) In the agent's system prompt with instructions to log all actions
B) In a post-conversation summary generated by the agent
C) **In programmatic callbacks (PostToolUse hooks) that automatically log every tool execution**
D) In periodic batch exports of conversation history

**Correct Answer: C**

**Explanation:** Audit logging must be **automatic and comprehensive**, implemented via **programmatic callbacks** (PostToolUse hooks) that capture every tool execution regardless of what the agent decides to report. System prompt instructions (Option A) are probabilistic — the agent might forget to log. Post-conversation summaries (Option B) may miss actions or misrepresent them. Batch exports (Option D) introduce gaps and don't capture real-time action detail.

---

### Question 46 (Hard)
A customer support agent has access to a refund processing tool. The business rule states that refunds above $500 require human approval. A customer requests a $600 refund and the agent reports 92% confidence in processing it. What should happen?

A) Process the refund since the agent's confidence exceeds the 80% threshold
B) Process the refund but flag it for post-transaction review
C) Ask the customer to confirm the refund amount before processing
D) **Escalate to a human agent because $600 exceeds the $500 threshold, regardless of the agent's confidence score**

**Correct Answer: D**

**Explanation:** This is the quintessential CCA exam question. The deterministic business rule ($600 > $500 limit) **overrides** any confidence score. Self-reported confidence (92%) is irrelevant because: (1) LLM confidence scores are **not calibrated** — stated certainty doesn't correlate with actual accuracy, (2) it's **circular reasoning** to ask a system that can be wrong to assess its own accuracy, (3) financial consequences of incorrect routing include unauthorized refunds and compliance violations.

> **Exam Trap:** Any answer that references "confidence score," "self-reported confidence," or "model certainty" as the basis for financial decisions is wrong on the CCA exam.

---

### Question 47 (Medium)
What is the difference between programmatic and prompt-based enforcement of security rules?

A) Prompt-based rules are stronger because they are always in the model's context
B) Programmatic rules are faster to implement but less reliable
C) **Programmatic rules are deterministic (guaranteed enforcement); prompt-based rules are probabilistic (can be ignored under certain conditions)**
D) There is no meaningful difference — both approaches are equally effective

**Correct Answer: C**

**Explanation:** This distinction is **the most important principle across all CCA domains**. **Programmatic enforcement** (hooks, callbacks, schema validation, tool restrictions) is **deterministic** — it either allows or blocks an action with 100% reliability. **Prompt-based enforcement** ("never process refunds above $500") is **probabilistic** — the model usually follows it, but may not under context pressure, complex reasoning, or adversarial input. For security, compliance, and financial rules, only deterministic enforcement is acceptable.

---

### Question 48 (Medium)
In a regulated industry using the Claude API, which API mode ensures zero data retention for compliance?

A) Batch API with data deletion requests
B) Prompt Caching with short TTL settings
C) **Real-Time API with Zero Data Retention (ZDR) policy**
D) Any API mode with a data processing agreement

**Correct Answer: C**

**Explanation:** Only the **Real-Time API** supports **Zero Data Retention (ZDR)** for regulated industries. The **Batch API is NOT a ZDR-eligible endpoint** — data may be retained during the processing window (up to 24 hours). For industries with strict data retention requirements (healthcare, finance, legal), only the Real-Time API with ZDR policy is compliant.

> **CCA Exam Tip:** Batch API ≠ ZDR. This is a critical distinction for regulated industry scenarios.

---

## Domain 5: Performance & Cost Optimization (Questions 49–60)

### Question 49 (Easy)
A user-facing customer support chatbot needs cost optimization. The system prompt and policy documents are identical across all conversations. Which API feature provides the greatest cost savings?

A) Batch API for processing multiple conversations simultaneously
B) Using a smaller, cheaper model
C) **Prompt Caching for the repeated system prompt and policy documents**
D) Reducing the conversation history length

**Correct Answer: C**

**Explanation:** **Prompt Caching** provides up to **90% cost savings** on cached token reads. When the system prompt and policy documents are identical across conversations, they are perfect caching candidates. Batch API (Option A) has up to 24-hour latency — **unusable for user-facing applications**. A smaller model (Option B) may degrade quality. Reducing conversation history (Option D) loses context.

> **CCA Exam Tip:** When the scenario describes a user waiting for a response + cost optimization, the answer is NEVER Batch API. It is Prompt Caching.

---

### Question 50 (Medium)
What are the cost implications of Prompt Caching?

A) All tokens are cached at 90% savings with no additional cost
B) **Cache reads save 90% (0.1x base cost); cache writes cost 25% more (1.25x base cost) for 5-minute TTL**
C) Prompt Caching is free for all API users
D) Cache reads and writes both cost 50% less than standard pricing

**Correct Answer: B**

**Explanation:** Prompt Caching has an asymmetric cost structure: **cache reads** are 0.1x base cost (**90% savings**), but **cache writes** are 1.25x base cost (**25% additional**) for 5-minute TTL. For 1-hour TTL, writes are 2x base cost (100% additional). The savings come from subsequent reads, not from the initial write. Option A overstates savings by ignoring write costs. The exam tests whether candidates understand both sides of the equation.

---

### Question 51 (Medium)
An organization needs to process 10,000 document summaries overnight with no real-time latency requirements. Which API approach offers the best cost optimization?

A) Real-Time API with Prompt Caching
B) Real-Time API with parallel requests
C) **Batch API with up to 24-hour processing window for 50% cost savings**
D) Multiple smaller model instances running in parallel

**Correct Answer: C**

**Explanation:** The **Batch API** provides **50% cost savings** compared to the Real-Time API and supports processing windows of up to 24 hours. For **non-real-time, bulk processing** tasks like overnight document summaries, Batch API is the optimal choice. Prompt Caching (Option A) saves up to 90% on repeated prompts but doesn't match Batch API's 50% blanket discount for bulk operations. Parallel real-time requests (Option B) offer no cost discount.

---

### Question 52 (Easy)
Without the `-p` flag, what happens when Claude Code runs in a CI/CD pipeline?

A) Claude Code outputs an error message and exits
B) Claude Code runs in a reduced functionality mode
C) **Claude Code enters interactive mode and the pipeline hangs indefinitely waiting for input**
D) Claude Code processes the request but with degraded performance

**Correct Answer: C**

**Explanation:** Without `-p`, Claude Code enters **interactive mode** and waits for user input from a terminal. In a CI/CD pipeline, there is no terminal and no user — so the pipeline **hangs indefinitely**. Not slowly, not with an error. It just sits there, waiting for input that will never arrive. This is the most common CI/CD integration mistake.

---

### Question 53 (Hard)
A CI/CD pipeline runs Claude Code with `-p` but without `--bare`. The pipeline works on the developer's machine but produces different results on the CI runner. Why?

A) The CI runner has a different version of Claude Code installed
B) Network latency differences between environments
C) **On the developer's machine, personal CLAUDE.md, hooks, MCP servers, and skills all load; on the CI runner, none of these exist — producing different behavior**
D) The CI runner has stricter security policies that modify Claude's output

**Correct Answer: C**

**Explanation:** Without `--bare`, Claude Code auto-discovers and loads **hooks, LSP, plugins, skills, CLAUDE.md, MCP servers**, and other local configurations. On a developer's machine, these all exist and influence behavior. On a CI runner, none of these are present. **Same command, different behavior** — the opposite of reproducibility. `--bare` ensures consistent behavior by skipping all auto-discovery.

---

### Question 54 (Medium)
For a CI/CD code review pipeline, what is the recommended complete flag combination?

A) `-p --output-format text`
B) `--bare --verbose --debug`
C) **`-p --bare --output-format json --tools Read,Bash`**
D) `-p --bare --allow-all-tools`

**Correct Answer: C**

**Explanation:** The recommended CI/CD combination is: **`-p`** (non-interactive), **`--bare`** (reproducible behavior), **`--output-format json`** (machine-parseable output), and **`--tools Read,Bash`** (sandboxed tool set). This provides headless execution, consistent behavior, structured output, and security sandboxing. Option A lacks `--bare` and uses text output. Option B lacks `-p`. Option D lacks output format and uses unrestricted tools.

---

### Question 55 (Medium)
A fix pipeline retries failed tests by having Claude attempt automatic fixes. After 5 failed attempts, the pipeline continues retrying. What is the architectural problem?

A) The pipeline should use a different model for each retry
B) The pipeline should increase the context window between retries
C) **The retry count exceeds the bounded retry maximum of 2–3 attempts — it should escalate or fail gracefully after 2–3 retries**
D) The pipeline should add more tools to help Claude fix the issues

**Correct Answer: C**

**Explanation:** **Bounded retry (2–3 maximum)** is a universal CCA principle. After 2–3 attempts with **specific error feedback**, the system should escalate to human intervention or fail gracefully. Unbounded retry is an anti-pattern that wastes compute, may indicate a fundamental issue the model cannot solve, and creates potential infinite loops. Each retry must include concrete error feedback — **blind retry** (repeating the same request without new information) is also an anti-pattern.

---

### Question 56 (Easy)
Which cost optimization technique reduces API costs by up to 90%?

A) Batch API
B) Model downgrading
C) **Prompt Caching (cache reads)**
D) Response length limiting

**Correct Answer: C**

**Explanation:** **Prompt Caching cache reads** provide up to **90% cost savings** (0.1x base cost). Batch API (Option A) provides 50% savings. Model downgrading (Option B) varies by model pricing. Response length limiting (Option D) reduces output token costs but doesn't approach 90% savings. The 90% figure applies only to cache reads, not cache writes.

---

### Question 57 (Hard)
A system uses Batch API to process customer support tickets. During a high-volume period, customer complaints about delayed responses increase. What is the root cause?

A) The Batch API is experiencing rate limiting during high volume
B) The system needs more concurrent batch processing workers
C) **Batch API has up to 24-hour latency and should not be used for customer-facing workflows — switch to Real-Time API with Prompt Caching**
D) The batch queue needs priority scheduling for urgent tickets

**Correct Answer: C**

**Explanation:** **Batch API** is designed for non-real-time bulk processing with latency **up to 24 hours**. It should **never** be used for customer-facing workflows where users expect timely responses. The correct approach is **Real-Time API with Prompt Caching** — real-time latency with up to 90% cost savings on cached content. This is one of the most common architectural mistakes: choosing Batch API for its 50% cost savings while ignoring its latency impact.

---

### Question 58 (Medium)
What are the three output format modes available for `--output-format` in Claude Code?

A) json, xml, csv
B) plain, formatted, structured
C) **text, json, stream-json**
D) raw, parsed, binary

**Correct Answer: C**

**Explanation:** Claude Code supports three output format modes: **text** (human-readable default), **json** (structured machine-parseable output), and **stream-json** (streaming JSON for real-time processing). The `json` mode is essential for CI/CD pipelines where output must be parsed programmatically by downstream tools.

---

### Question 59 (Medium)
What role do few-shot examples play in Claude's tool usage?

A) Few-shot examples control the order in which Claude calls tools
B) **Few-shot examples demonstrate desired output format and quality, but do not enforce tool execution order**
C) Few-shot examples are required for Claude to use tools correctly
D) Few-shot examples replace the need for tool descriptions

**Correct Answer: B**

**Explanation:** Few-shot examples serve as **demonstrations of desired output format and quality**. They show Claude what good output looks like. However, they do **not** reliably control tool execution order — that requires `tool_choice` or hooks for deterministic enforcement. Option A is the common misconception. Option C is false — Claude can use tools without examples. Option D is wrong — tool descriptions are the primary selection mechanism.

---

### Question 60 (Hard)
An architect is designing a production system that must: (1) process customer requests in real-time, (2) enforce compliance rules for financial transactions, (3) optimize for cost, and (4) maintain audit logs. Which combination of approaches is correct?

A) Batch API + prompt-based compliance + conversation history logs
B) Real-Time API + system prompt rules + manual audit reviews
C) **Real-Time API with Prompt Caching + PreToolUse hooks for compliance + PostToolUse callbacks for audit logging**
D) Batch API with Prompt Caching + schema-based compliance + automated log exports

**Correct Answer: C**

**Explanation:** This question integrates multiple CCA concepts: (1) **Real-Time API** for user-facing real-time processing (Batch API is never correct for real-time). (2) **Prompt Caching** for cost optimization on repeated system prompts (up to 90% savings). (3) **PreToolUse hooks** for deterministic compliance enforcement (programmatic, not prompt-based). (4) **PostToolUse callbacks** for automatic, comprehensive audit logging. Option A uses Batch API (wrong for real-time) and prompt-based compliance (wrong for enforcement). Option B uses prompt rules instead of programmatic hooks. Option D uses Batch API.

> **CCA Exam Tip:** This is the pattern for the "integration" question that appears at the end of the exam. It tests whether you can combine all five domains into a single coherent architecture.

---

## Scoring Guide

| Domain | Questions | Weight |
|--------|-----------|--------|
| 1. Agentic Architecture & Orchestration | Q1–Q16 | 27% |
| 2. Context Engineering | Q17–Q28 | 20% |
| 3. Tool Design & Integration | Q29–Q40 | 20% |
| 4. Security & Compliance | Q41–Q48 | 18% |
| 5. Performance & Cost Optimization | Q49–Q60 | 15% |

**Passing threshold:** 43/60 (72%)
**Recommended target:** 50+/60 (83%+)

### Recommended Study Strategy

1. **Timer set — 120 minutes.** Complete all 60 questions without looking at explanations.
2. **Score yourself.** Review ALL explanations — even for questions you answered correctly. Understand **why every wrong answer is wrong**.
3. **Identify weak domains.** Go back to the corresponding scenario deep-dive article.
4. **Do not take the real exam until you consistently score 50+/60 (83%+).**
5. **Do not trust answer distribution patterns.** Even if B appears frequently, every answer must be derived through reasoning.
