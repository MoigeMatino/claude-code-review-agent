# Claude Code Review Agent

A reusable, tool-enabled **agentic code review system** built on top of the
`@anthropic-ai/claude-agent-sdk`.

This project explores how large language models can autonomously inspect a codebase,
reason across files, and produce **structured, high-signal code reviews** — the same
way a senior engineer would approach a pull request.

*This repository is intentionally designed as a learning-forward, extensible agent project and serves as a foundation for PR-level automation.*

---

## ✨ Key Features

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

---

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

## 🗺️ Roadmap

Planned enhancements:

- GitHub PR integration via GitHub Actions
- Diff-aware reviews (only changed files)
- Inline PR comments
- Patch suggestions using `Diff` / `Write` tools
- Configurable review severity thresholds
- JSON schema validation + repair passes

---

## 🎯 Why This Project Exists

This repository is both:

- A **learning exercise in agentic system design**
- A **foundation for real-world developer tooling**

It intentionally focuses on:

- Architecture clarity
- Safety-first design
- Reusability over quick demos

---

## 📜 License

MIT License. See `LICENSE` for details.
