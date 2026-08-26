# CLAUDE.md — pack-hydrogen-theme-blueprint

## This is a PUBLIC repo

This repository is public on GitHub. Anything committed here — code, comments, commit messages, PR titles and descriptions, review comments, docs, issue references — is world-readable and permanent.

Treat every artifact you produce in this repo as if it will be indexed by search engines and read by clients, competitors, and prospects.

## Never include in this repo

- **Client / customer / merchant names, brand names, domains, URLs, handles, storefront references** — not in code, not in comments, not in commit messages, not in PR bodies, not in docs
- **Pack account tiers, deal sizes, ARR, MRR, contract terms, or any internal business context**
- **Names of internal-only Pack repos, tools, agents, or infrastructure paths** (e.g., `pack-support-agents/`, internal Slack channels, Linear/Asana identifiers)
- **Log excerpts, screenshots, or configuration** that could contain customer-identifying data
- **Content sourced from a Pack Slack channel, Linear issue, Asana task, or any internal doc**

## Instead

When a fix originates from a specific storefront's failure, describe the **failure mode** in generic terms. Cite the storefront and the internal context in the **Linear issue** that tracks the PR — never in the PR itself, and never in the commit history.

Example:
- ❌ "Seen on brandname.com — Google was showing 'Application Error'"
- ✅ "Observed in production when a crawler indexed a transient render failure"

## If you already leaked

- If the branch is fresh and no one has interacted with it: `git commit --amend`, `git push --force-with-lease`, and edit the PR body via `gh pr edit`
- If the commit has been pulled or reviewed: escalate to the human owner before rewriting history
- Do not leave it in place hoping no one notices

## When in doubt

Don't include it. Ask.
