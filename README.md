# BIS Standards Intelligence Engine (SIH26108)

An explainable, evidence-first recommendation engine that reads a procurement specification or tender and recommends the Indian Standards that apply, with the evidence behind each match. Built for the Smart India Hackathon 2026 by **Team Phantom Code** (SR University, Warangal).

- **Problem statement:** SIH26108, *AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications*
- **Organization:** Ministry of Consumer Affairs, Food & Public Distribution (Department of Consumer Affairs)
- **Theme / category:** Smart Automation / Software

## Idea in short

The system does not ask an LLM to guess the applicable standard. Retrieval finds candidates (keyword search plus semantic search over a curated BIS catalogue), the catalogue is the source of truth, and the LLM only interprets and explains. Every recommendation carries the line `official_applicability = REQUIRES_OFFICER_VERIFICATION`: the procurement officer decides.

What it adds beyond a plain search:

- Requirement decomposition, with each requirement pinned to its source clause in the tender
- A 5-point evidence check per match (product category, material, intended use, scope, test requirement)
- Requirement Coverage Matrix: which tender requirements no standard covers
- Specification Risk Detector: missing test methods, vague limits, unmeasurable requirements
- Standards Knowledge Graph and typed allied standards (primary, supporting, safety, terminology, inferred)
- "Why not" explanations for near-miss standards, and an audit trail of every stage

The full design (data model, pipeline, API surface, model routing, build order) is in [`sih26108-design.md`](sih26108-design.md).

## What is in this repo

| Path | What it is |
|---|---|
| `frontend/` | The officer workspace prototype: React 19, TypeScript, Vite, Tailwind CSS v4 |
| `sih26108-design.md` | Consolidated design document |

**Status:** the frontend is a working prototype that runs entirely on seeded sample data (three sample tenders). The backend (FastAPI, PostgreSQL with pgvector, Claude API) is specified in the design document and is not part of this repository yet.

## Run the prototype

Requires Node 22 or newer.

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173. The flow is About page, Login, then the workspace (tender overview, recommendations, requirements, coverage matrix, specification review, why-not, knowledge graph, catalogue, audit trail, history).

```bash
npm run build   # type-check and production build
npm run lint
```
