# Claude Code Review Agent

A reusable, tool-enabled **agentic code review system** built on top of the
`@anthropic-ai/claude-agent-sdk`.

This project explores how large language models can autonomously inspect a codebase,
reason across files, and produce **structured, high-signal code reviews** the same
way a senior engineer would approach a pull request. It is an exploration of how **LLMs can be integrated as real engineering systems**, with constraints, trade-offs, safety boundaries, and clear ownership.

*This repository is intentionally designed as a learning-forward, extensible agent project and serves as a foundation for PR-level automation.*

---
## 🧩 The Problem This Project Solves
Code review is a high-leverage activity — and also one of the most overloaded.

In real teams:

- Reviews are rushed under delivery pressure
- Feedback quality varies wildly by reviewer
- Critical issues (correctness, security, reliability) are often missed
- Existing AI tools produce verbose, low-signal feedback or are unsafe to run in CI

At the same time, **most LLM “projects” fail to address real constraints**:
- They scan entire repos unnecessarily
- They lack consistent review standards
- They don’t integrate cleanly into developer workflows
- They ignore failure modes

**This project exists to explore a better design.**
---
## 🎯 What This Project Demonstrates

This repository is intentionally designed to answer:
> *"How can an AI-powered code review system be designed to fit real developer workflows, production constraints, and long-term maintainability?"*

It demonstrates:

### 1. Strong Problem Framing
- Clear scope: *code review*, not generic “AI analysis”
- Defined success criteria: **high-signal, actionable feedback**
- Explicit non-goals: no magic, no unrestricted execution, no demo-only shortcuts

### 2. Engineering Judgment Through Trade-offs
This project makes trade-offs explicit instead of hiding them:

#### Agent-style review instead of one big prompt

*   **Why we chose this:**  
    It allows the agent to inspect only relevant files and reason across the codebase the way a human reviewer would.
    
*   **What it costs us:**  
    Slower execution, more complexity, and higher token usage.
    
*   **Why it’s worth it:**  
    This approach scales better to real repositories and produces more accurate reviews.
    

* * *

#### Limited tool access instead of full system access

*   **Why we chose this:**  
    The agent can only read files (`Glob`, `Read`), which makes it safe to run locally or in CI.
    
*   **What it costs us:**  
    The agent can’t run tests, execute code, or auto-fix issues.
    
*   **Why it’s worth it:**  
    Safety and predictability matter more than raw power in production environments.
    

* * *

#### Structured JSON output instead of conversational text

*   **Why we chose this:**  
    Structured output can be validated, versioned, and consumed by CI pipelines or GitHub Actions.
    
*   **What it costs us:**  
    More engineering work (validation, error handling) and occasional parsing failures.
    
*   **Why it’s worth it:**  
    This makes the system automatable and reliable, not just informative.
    

* * *

#### Stub-first development instead of immediate full implementation

*   **Why we chose this:**  
    Locking down interfaces early prevents rewrites and clarifies responsibilities.
    
*   **What it costs us:**  
    Slower visible progress and fewer “wow” demos early on.
    
*   **Why it’s worth it:**  
    This mirrors how production systems are built and maintained over time.
    

* * *

#### CLI-first design instead of a UI or notebook

*   **Why we chose this:**  
    The CLI matches how tools are actually used in CI and developer workflows.
    
*   **What it costs us:**  
    Less visual appeal and a steeper learning curve for non-engineers.
    
*   **Why it’s worth it:**  
    It integrates cleanly into real pipelines and scales to team usage.

### 3. Designed for Real Workflows
The system is built to plug into:

- Local developer workflows (CLI)
- CI pipelines
- GitHub Pull Requests

Notebooks and chat UIs are intentionally avoided.

### 4. Incremental, Professional Build Strategy
The project evolves in phases:

- Interfaces before internals
- Output contracts before agent logic
- Safety before power
- Reliability before cleverness
---
## 🧠 Conceptual Model

The agent behaves like a senior engineer performing a review:

1. **Intent**
   - Review code with judgment, not verbosity

2. **Autonomy**
   - Decide *what* to inspect and *why*
   - Avoid unnecessary context

3. **Constraints**
   - Explicit tool permissions
   - No shell access
   - No write access by default

4. **Structured Judgment**
   - Categorized findings
   - Severity-aware feedback
   - Actionable recommendations

---

<!--## ✨ Key Features

- **Agentic architecture**
  - Claude autonomously explores the repository using sandboxed tools
  - Multi-turn reasoning over large codebases

- **Reusable `CodeReviewAgent`**
  - Clean class abstraction with typed inputs and outputs
  - Decoupled from CLI, CI, or GitHub workflows

- **Structured review rubric**
  - Consistent, senior-level feedback
  - Strict JSON output for machine consumption

- **Tool-sandboxed execution**
  - Filesystem access limited to `Glob` and `Read`
  - Safe by default, extensible later

- **CLI-ready**
  - Run reviews locally against any repository
  - GitHub-ready architecture

--->

## 📁 Project Structure

```plaintext

claude-code-review-agent/
├── src/
│   ├── agent/
│   │   ├── CodeReviewAgent.ts      # Core reusable agent
│   │   └── types.ts                # Review input/output types
│   ├── prompts/
│   │   └── rubric.ts               # Review rubric + output contract
│   └── workflows/
│       └── localReview.ts          # (future) orchestration helpers
│
├── scripts/
│   └── review.ts                   # CLI entrypoint
│
├── .github/
│   └── workflows/                  # GitHub Actions (future)
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE

````

---

## 🚀 Quick Start

### 1) Install dependencies

```bash
npm install
````

### 2) Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```bash
ANTHROPIC_API_KEY=your_key_here
CLAUDE_MODEL=opus
```

---

### 3) Run a local code review

From the repository root:

```bash
npm run dev
```

The agent will:

1. Explore the repository using allowed tools
2. Reason over relevant files
3. Output a structured JSON review to stdout

---

## 🧠 How the Agent Works

At a high level:

1. **Prompt + Rubric**

   - The agent is given a strict review rubric
   - Output format is enforced as JSON

2. **Autonomous Exploration**

   - Claude decides which files to inspect
   - Filesystem access is sandboxed

3. **Multi-Turn Reasoning**

   - The agent iteratively gathers context
   - No single-shot completion assumptions

4. **Structured Output**

   - Findings are categorized, prioritized, and actionable
   - Designed for both humans and automation pipelines

---

## 📊 Review Output Schema

Each run produces output matching this structure:

```ts
{
  summary: string;
  findings: {
    severity: "blocker" | "high" | "medium" | "low" | "nit";
    category:
      | "correctness"
      | "security"
      | "performance"
      | "maintainability"
      | "architecture"
      | "testing"
      | "style";
    title: string;
    evidence?: string;
    recommendation: string;
  }[];
}
```

This makes the agent suitable for:

- PR comments
- CI gating
- Review dashboards
- Follow-up automation

---

## 🔒 Safety & Guardrails

- No write access by default
- No shell execution
- Tool access is explicitly whitelisted
- Designed to fail gracefully if output parsing fails

---

<!--## 🗺️ Roadmap

Planned enhancements:

- GitHub PR integration via GitHub Actions
- Diff-aware reviews (only changed files)
- Inline PR comments
- Patch suggestions using `Diff` / `Write` tools
- Configurable review severity thresholds
- JSON schema validation + repair passes

--->
## 🗺️ Execution Plan

### Phase 0 — Repository Foundation ✅

*   TypeScript build pipeline
    
*   CLI wiring
    
*   Linting & formatting
    
*   Output contracts defined
    

### Phase 1 — MVP Code Review Agent 🚧

*   Stubbed agent returning structured output
    
*   CLI command: `review`
    

### Phase 2 — Rubric System (Next)

*   Typed, versioned review rubrics
    
*   JSON validation + repair passes
    
*   Reliability hardening for CI
    

### Phase 3 — GitHub PR Workflow

*   Diff-aware reviews
    
*   GitHub Actions integration
    
*   PR summary + inline comments
    

### Phase 4 — Advanced Enhancements

*   Chunking & map-reduce for large repos
    
*   Caching repeated reviews
    
*   Patch suggestion mode (`Diff` / `Write` tools)
    

* * *

## 🎯 Why This Project Exists

This repository is intentionally built to signal:

*   Systems thinking
    
*   Constraint-aware AI design
    
*   Incremental delivery
    
*   Engineering judgment over novelty
    

It prioritizes **shipping-grade design** over demos.

