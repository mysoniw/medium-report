---
title: "CCA: Master the Developer Productivity Scenario for the Claude Certified Architect Exam"
subtitle: "From CLAUDE.md hierarchies to MCP scoping to the anti-patterns that trip up most candidates"
author: Rick Hightower
date: 2026-04-02
source: https://medium.com/@richardhightower/cca-master-the-developer-productivity-scenario-for-the-claude-certified-architect-exam-from-e402d9bb277d
series: "CCA Scenario Deep Dive Series (7/8)"
---

# CCA: Master the Developer Productivity Scenario for the Claude Certified Architect Exam

*From CLAUDE.md hierarchies to MCP scoping to the anti-patterns that trip up most candidates*

---

## Why the Developer Productivity Scenario Is Sneaky

The **Developer Productivity scenario** is sneaky. It looks like it belongs to Domain 2 (Claude Code Configuration, 20%), but this scenario sprawls across all five competency domains. A single question may require knowledge from two or three domains to arrive at the correct answer.

| Domain | Weight | Connection to Developer Productivity |
|--------|--------|--------------------------------------|
| **Domain 1**: Agentic Architecture | 27% | Multi-agent workflows, custom skills |
| **Domain 2**: Claude Code Workflows | 20% | CLAUDE.md hierarchy, hook configuration |
| **Domain 3**: Prompt Engineering | 20% | Structured outputs, **Description-Discernment loop** |
| **Domain 4**: Tool Design & MCP | 18% | MCP server scoping, tool descriptions |
| **Domain 5**: Context Management | 15% | Context loss prevention, long session management |

The exam asks what appears to be a simple question — "Where should this configuration go?" — but deriving the correct answer requires cross-domain knowledge by design.

---

## The CLAUDE.md Four-Level Hierarchy

Here is the fact that trips up most candidates: most study materials only cover the **project** and **user** levels, but the official documentation defines **four levels**.

```
                    ┌─────────────────────┐
                    │  1. Managed / Org   │  ← Highest authority
                    │    (IT-deployed)    │     Cannot be overridden
                    ├─────────────────────┤
                    │    2. Project       │  ← Team-shared
                    │  (version-controlled)│    Via code review
                    ├─────────────────────┤
                    │     3. User         │  ← Personal
                    │  (all projects)     │    Individual preference
                    ├─────────────────────┤
                    │     4. Local        │  ← Personal + project-specific
                    │   (.gitignore'd)    │    Not version-controlled
                    └─────────────────────┘
```

| Level | Location | Version-Controlled | Scope | Controlled By |
|-------|----------|--------------------|-------|---------------|
| **1. Managed/Org** (highest authority) | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux: `/etc/claude-code/CLAUDE.md` | No (IT-deployed) | Entire organization | IT / DevOps |
| **2. Project** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Yes | Entire team | Team (via code review) |
| **3. User** | `~/.claude/CLAUDE.md` | No | Individual, all projects | Individual |
| **4. Local** | `CLAUDE.local.md` (.gitignore) | No | Individual, this project only | Individual |

**Resolution order**: Managed/Org -> Project -> User -> Local. Higher levels **cannot be overridden** by lower levels.

Think of the hierarchy like a **resolution chain** — just as DNS resolves domains by walking up a chain of nameservers, CLAUDE.md settings resolve by walking down from managed/org to local, with higher levels taking precedence.

> **CCA Exam Tip**: Know all four levels cold. The exam will present scenarios where the correct answer depends on recognizing whether a requirement belongs at the managed/org, project, user, or local level.

### Monorepo Support

Place a project-level CLAUDE.md at the repository root, then add component-specific CLAUDE.md files in subdirectories. Claude automatically loads the subdirectory CLAUDE.md when it reads files in that subdirectory.

---

## MCP Configuration Scoping

**MCP server configuration** follows the same layered principle as CLAUDE.md:

| File | Location | Purpose | Version-Controlled |
|------|----------|---------|-------------------|
| `.mcp.json` | Project root | Team-shared MCP server definitions | Yes |
| `~/.claude.json` | Home directory | Personal MCP servers + **credentials** | No |

### Scoping Decision Tree

1. Does the **entire team** need this? -> No -> `~/.claude.json`
2. Does it require **personal credentials**? -> No -> Everything in `.mcp.json`
3. **Both** Yes? -> Server definitions (without secrets) in `.mcp.json`, credentials in `~/.claude.json` or environment variables

> **CCA Exam Tip**: The exam tests this split pattern directly. Putting credentials in `.mcp.json` = credentials in version control (security violation). Putting everything in `~/.claude.json` = team members cannot access shared tools.

---

## Tool Count and Tool Descriptions

### The 4-5 Tool Principle

The architectural best practice is **4-5 tools per agent**. When an agent with 18 tools keeps selecting the wrong tool, the solution is not "write a better prompt" — it is to **split into specialized sub-agents**.

This is a **coordinator-subagent** pattern: the coordinator distributes tasks and specialized sub-agents execute with their focused toolsets.

### Tool Descriptions as the Routing Mechanism

Claude selects tools based on their **descriptions**, not their names. The description is the routing table.

**Bad description** (causes mis-routing):
```
"Analyzes stuff"
```

**Good description** (enables accurate selection):
```
"Performs static analysis on Python source files, identifying type errors,
unused imports, and style violations. Returns results with line numbers
and severity ratings."
```

> **CCA Exam Tip**: When the exam presents a tool-selection problem, look for the answer that improves the **tool description** specificity or reduces the tool count per agent. These are almost always correct.

---

## The Description-Discernment Loop

From the **AI Fluency Framework**'s four principles (Delegation, Description, Discernment, Diligence), two directly drive developer productivity:

```
Description (CLAUDE.md, skills, tool descriptions)
     │
     ▼
Claude generates output
     │
     ▼
Discernment (code review, tests, architecture review)
     │
     ▼
Update Description based on Discernment findings
     │
     ▼
(Repeat)
```

When the exam presents a scenario where "team members get inconsistent outputs from Claude," the correct answer includes **both**:
- **Immediate fix**: Improve the Description (update CLAUDE.md, refine tool descriptions)
- **Systematic fix**: Establish a review process that continuously updates Descriptions

**The loop answer is almost always more correct than the one-shot answer.**

> **CCA Exam Tip**: If one answer choice mentions only fixing the prompt and another mentions a feedback loop that improves descriptions over time, the loop answer is correct.

---

## Team Knowledge Sharing: Skills vs Rules

| Type | Path | Loading | Use Case |
|------|------|---------|----------|
| **Rules** | `.claude/rules/*.md` | Every session (automatic) | Instructions that must always be in context |
| **Skills** | `.claude/skills/SKILL.md` | On invocation or when relevant | Complex multi-step procedures (on-demand loading) |

Rules add per-session overhead, so long multi-step procedures should be encoded as **skills**, not rules. Each developer writing their own prompts instead of sharing team skills is an **anti-pattern**.

---

## Hooks: Programmatic Enforcement That Actually Works

Writing "always run the linter before committing" in CLAUDE.md works **most of the time**, but under **context pressure** — when the context window fills up — steps can be skipped. **Prompts execute probabilistically.**

**Hooks execute deterministically:**

- **PostToolUse**: Runs after a tool is used (e.g., auto-lint after file write)
- **PreToolUse**: Runs before a tool is used (e.g., check against approved command list)
- Other hooks: `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "write_file",
        "command": "eslint --fix ${file_path}"
      }
    ]
  }
}
```

> **CCA Exam Tip**: When the exam offers "add instruction to system prompt" vs "configure a programmatic hook," **the hook is almost always the correct answer**. Programmatic enforcement beats prompt-based guidance every time for rules that must be followed without exception.

---

## Anti-Pattern Gallery

| # | Anti-Pattern | Why It Fails | Correct Approach |
|---|-------------|-------------|-----------------|
| 1 | Controlling tool order with few-shot examples | Tool selection is description-based, not example-order-based | Programmatic preconditions or wrap into a single tool |
| 2 | Enforcing business rules via prompts | Steps can be skipped under **context pressure** | PostToolUse / PreToolUse hooks |
| 3A | Putting all MCP config in project (including secrets) | Credentials exposed in version control | Server definitions in `.mcp.json`, credentials in `~/.claude.json` |
| 3B | Putting all MCP config at user level | Team members cannot access shared tools | Shared servers defined in `.mcp.json` |
| 4 | Giving an agent 15+ tools | Overlapping descriptions cause mis-routing | 4-5 tools + specialized sub-agents |
| 5 | Only knowing 2 CLAUDE.md levels | Wrong answers on managed/org and local questions | Know all four levels cold |

---

## Exam Strategy: Decision Framework

When you encounter a Developer Productivity question, apply this framework:

1. **"Where does X go?"** -> Apply the four-level hierarchy. Org-wide non-overridable = managed/org, team standard = project, personal preference = user, personal + project-specific = local
2. **"How do we enforce X?"** -> Programmatic > prompt. Always.
3. **"How many tools?"** -> 4-5 per agent. Mis-routing problem = split into sub-agents
4. **"Who sees this config?"** -> `.mcp.json` / `.claude/CLAUDE.md` = team, `~/.claude.json` / `~/.claude/CLAUDE.md` = individual
5. **"How does the team improve over time?"** -> Description-Discernment loop

---

## Practice Question Walkthrough

**Question**: Your team's import sorting rules are intermittently ignored by Claude Code. Some developers have added instructions to their personal `~/.claude/CLAUDE.md`, but inconsistencies continue. What is the most effective solution?

- **A)** Add more detailed examples to each developer's personal CLAUDE.md
  -> **Wrong** — team standard in personal files; no enforcement
- **B)** Create a shared skill containing import sorting instructions
  -> **Wrong** — no programmatic enforcement
- **C)** Add instructions to the project-level `.claude/CLAUDE.md` and configure a PostToolUse hook for automatic sorting
  -> **Correct** — tests two principles simultaneously: (1) team standards belong at the project level, (2) mechanical rules require programmatic enforcement
- **D)** Add few-shot examples to the system prompt
  -> **Wrong** — few-shot examples do not reliably control tool behavior/output

> The correct answer C tests two principles simultaneously: team standards go at the **project level**, and mechanical rules require **programmatic enforcement**.

---

## Discussion Questions

1. **Your organization requires all Claude Code sessions to follow specific security guidelines that individual developers cannot override. Which CLAUDE.md level should you use, and why?**
   - Answer: Managed/Org level — it is the highest authority and cannot be overridden by lower levels.

2. **A team's MCP server requires both shared configuration and individual API keys. How should this be structured?**
   - Answer: Server definitions (without secrets) in `.mcp.json` (version-controlled), API keys in `~/.claude.json` or environment variables (not version-controlled).

3. **An agent with 12 tools frequently selects the wrong tool despite detailed prompts. What architectural change should you recommend?**
   - Answer: Split into a coordinator agent with specialized sub-agents, each having 4-5 focused tools with specific descriptions.

---

*This is Part 7 of the CCA Scenario Deep Dive Series by Rick Hightower.*
