# SIH26108 — Consolidated Design Document

**Explainable Hybrid BIS Standards Recommendation Engine**
An AI-assisted procurement intelligence tool for the Ministry of Consumer Affairs, Food & Public Distribution.

- **Date:** 2026-09-27
- **Status:** Draft for review — consolidates three completed rounds of design feedback into one implementation-ready spec.
- **Scope decision:** Hybrid retrieval (BM25 + pgvector) + query decomposition + confidence/evidence layer + primary/allied relationship classification — all of which are written into the source spec already — plus three headline additions ranked in the last feedback round (Requirement Coverage Matrix, Specification Risk Detector, Standards Knowledge Graph). **Those three are not yet in the source spec's own text** — only their ranking was discussed in chat — so this file gets ahead of that; fold them into the living doc too once you're happy with them here.
- **LLM:** Claude API, routed by stage — Haiku for high-volume structured work, Sonnet for judgment calls and demo-facing narrative (see §11).
- **Timeline:** open. Whether this submission shares AdiSetu's Sept 30 national-round deadline or runs on its own track is an unresolved question left as a live comment in the source spec — resolve it before the build-order phases in §13 get pinned to actual dates.
- **Budget:** $0/month (Neon + Render + Vercel + UptimeRobot free tiers).
- **Source spec:** [SIH26108 Technical Spec — Standards Recommendation Engine](https://claude.ai/artifact/9QtcsnvHAmv3KbxiS7YC1K) — the living document of record for comments and evaluator-facing narrative. This file pins its schemas, API contracts, and build order for implementation; keep the two in sync as the design evolves.

This document does not replace the source spec — it operationalizes it. Where the spec describes a capability in prose, this file gives it a table, a function signature, or a line in the build order. Where the two disagree, the source spec wins on positioning and this file wins on implementation detail.

---

## 1. Core philosophy

The system's own pitch, carried through every layer below: **it doesn't ask an LLM to guess the applicable standard.** It extracts procurement requirements, retrieves candidates from a curated BIS knowledge base, validates evidence, classifies relationships, and produces an auditable explanation. Concretely, that means three things hold everywhere in the design:

- **Retrieval finds candidates.** Hybrid search (keyword + semantic) is what surfaces a standard as relevant — never a bare LLM claim.
- **Structured data establishes facts.** The curated catalog (number, title, technical committee, scope) is the source of truth. Anything not in that catalog cannot be asserted as fact.
- **The LLM interprets and explains, never decides applicability.** Every recommendation ends with an explicit `official_applicability = REQUIRES_OFFICER_VERIFICATION` line. The model is not the authority; a human procurement officer is.

**Hard rule enforced in every prompt template:** the model may not assert that a relationship between a product and a standard is official unless it is backed by a retrieval hit plus a passed evidence check. An inferred relationship (allied standard, knowledge-graph edge) must carry `is_inferred = true` and a stated rationale — never presented as a documented citation.

This is also why the three headline features earn their place: each one is a new question the system can answer (what's *not* covered, what's wrong with the tender itself, what else to check), not another way of finding the same standard faster.

---

## 2. Repository layout

Single git repo, monorepo with two apps — deliberately close to the AdiSetu stack per the tech-stack reference in the source spec.

```
sih26108/
├── docs/
│   └── design/
│       └── sih26108-design.md          # this file
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI app, CORS, lifespan, /health
│   │   ├── config.py                   # pydantic-settings: DATABASE_URL, ANTHROPIC_API_KEY, ALLOWED_ORIGINS
│   │   ├── db.py                       # SQLAlchemy engine + session
│   │   ├── models/
│   │   │   ├── base.py                 # DeclarativeBase, shared mixins
│   │   │   ├── catalog.py              # sectors, standards, allied_relationships
│   │   │   └── query.py                # queries, product_profiles, requirements, candidates,
│   │   │                                #   evidence, recommendations, why_not, specification_risks,
│   │   │                                #   audit_log, feedback
│   │   ├── pipeline/
│   │   │   ├── extraction.py           # extract_product_profile (document + text paths)
│   │   │   ├── decomposition.py        # decompose_requirements
│   │   │   ├── retrieval.py            # keyword_search (tsvector), similarity_search (pgvector), merge_and_score
│   │   │   ├── reranking.py            # rerank, validate_evidence
│   │   │   ├── classification.py       # classify_relationships (reads allied_relationships, already populated at curation time)
│   │   │   ├── explain.py              # explain_rejections (why-not), write_justification
│   │   │   ├── risk_detector.py        # detect_specification_risks
│   │   │   └── prompts/                # one template file per Claude call, versioned
│   │   ├── services/
│   │   │   ├── recommend_service.py    # the top-level recommend(query_id) orchestrator (§5)
│   │   │   ├── coverage_service.py     # build_coverage_matrix — derived, no new table (§6.1)
│   │   │   ├── graph_service.py        # build_standards_graph — derived from allied_relationships (§6.3)
│   │   │   └── audit_service.py        # log_stage(), get_audit_trail()
│   │   └── routers/
│   │       ├── queries.py              # POST /queries, GET /queries/{id}, .../requirements, .../recommendations
│   │       ├── analysis.py             # GET .../coverage-matrix, .../risks, .../why-not, .../comparison, .../audit
│   │       ├── standards.py            # GET /standards, GET /standards/{id}/graph
│   │       └── feedback.py             # POST /recommendations/{id}/feedback
│   ├── curation/
│   │   ├── seed_catalog.py             # loads curated_standards/*.csv into `standards`, embeds, indexes
│   │   ├── infer_allied_edges.py       # one-time offline pass: Claude Haiku over scope-text pairs → allied_relationships
│   │   └── curated_standards/
│   │       ├── electrical_safety.csv
│   │       ├── packaging_materials.csv
│   │       └── construction_materials.csv
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx                     # query entry (text / upload toggle), catalog browse link
│   │   ├── api.ts
│   │   ├── components/
│   │   │   ├── ResultsView.tsx         # ranked recommendations, grouped by relationship type
│   │   │   ├── EvidencePanel.tsx       # confidence + evidence-checklist lines per recommendation
│   │   │   ├── CoverageMatrix.tsx      # requirement × standard grid, gaps highlighted
│   │   │   ├── RiskPanel.tsx           # specification risk list
│   │   │   ├── WhyNotPanel.tsx         # rejected near-miss candidates
│   │   │   ├── ComparisonTable.tsx     # side-by-side candidate table
│   │   │   ├── KnowledgeGraphView.tsx  # react-force-graph-2d over /standards/{id}/graph
│   │   │   ├── CatalogBrowser.tsx      # browse the indexed catalog + coverage-indicator banner
│   │   │   ├── AuditPanel.tsx          # "view analysis" drill-down
│   │   │   └── FeedbackControls.tsx    # relevant / not-relevant + reason
│   │   └── types.ts
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── .env.example                    # VITE_API_BASE
├── .gitignore
└── README.md
```

---

## 3. Data model

PostgreSQL 16 on Neon, with `pgvector` for embeddings and `pg_trgm` for fuzzy standard-number lookup. Native `tsvector` full-text search stands in for BM25 — merged with vector search before re-ranking, never used alone.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### 3.1 Curated catalog (the source of truth)

```sql
CREATE TABLE sectors (
    sector_id   SERIAL PRIMARY KEY,
    name        VARCHAR(64) NOT NULL UNIQUE       -- 'Electrical Safety' | 'Packaging Materials' | 'Construction & Building Materials'
);

CREATE TABLE standards (                            -- the curated BIS catalog — number, title, TC, scope only (full text is paywalled)
    standard_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number              VARCHAR(32) NOT NULL UNIQUE,     -- e.g. 'IS 302-1:2008'
    title               VARCHAR(256) NOT NULL,
    technical_committee VARCHAR(16),                     -- e.g. 'ETD 32'
    sector_id           INT NOT NULL REFERENCES sectors(sector_id),
    scope_text          TEXT NOT NULL,                   -- the public scope statement — this + title is all that's embedded
    status              VARCHAR(16) NOT NULL DEFAULT 'UNKNOWN',  -- CURRENT | UNKNOWN — never SUPERSEDED/WITHDRAWN without an authoritative feed (§14)
    embedding           VECTOR(384),                      -- sentence-transformers/all-MiniLM-L6-v2 over title + scope_text
    search_tsv          TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', number || ' ' || title || ' ' || scope_text)) STORED,
    source_url          VARCHAR(256),                     -- link into the public BIS catalog page, kept for the audit trail
    curated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_standards_embedding    ON standards USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_standards_tsv          ON standards USING gin (search_tsv);
CREATE INDEX idx_standards_number_trgm  ON standards USING gin (number gin_trgm_ops);

CREATE TABLE allied_relationships (                 -- typed edges; also the Knowledge Graph's only storage (§6.3)
    relationship_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_id       UUID NOT NULL REFERENCES standards(standard_id),
    related_id        UUID NOT NULL REFERENCES standards(standard_id),
    relationship_type VARCHAR(16) NOT NULL,          -- PRIMARY | SUPPORTING | TERMINOLOGY | SAFETY | INFERRED
    is_inferred       BOOLEAN NOT NULL DEFAULT TRUE, -- false only if sourced from a real BIS citation — the current data strategy has none
    rationale         TEXT NOT NULL,                 -- Claude's stated basis: shared vocabulary, shared TC, co-occurring test method, etc.
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (standard_id <> related_id)
);
CREATE INDEX idx_allied_standard ON allied_relationships (standard_id);
CREATE INDEX idx_allied_related  ON allied_relationships (related_id);
```

### 3.2 Query lifecycle

```sql
CREATE TABLE queries (
    query_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    input_type      VARCHAR(16) NOT NULL,      -- TEXT | DOCUMENT
    raw_text        TEXT,                      -- typed description, or the OCR/extracted document text
    source_filename VARCHAR(256),              -- NULL for TEXT
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    status          VARCHAR(16) NOT NULL DEFAULT 'PROCESSING'   -- PROCESSING | DONE | FAILED
);

CREATE TABLE product_profiles (                 -- structured extraction output (§5.1)
    profile_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id               UUID NOT NULL REFERENCES queries(query_id),
    product                VARCHAR(128) NOT NULL,
    category               VARCHAR(64) NOT NULL,
    material               VARCHAR(64),
    intended_use           VARCHAR(128),
    technical_requirements JSONB NOT NULL DEFAULT '[]',
    safety_requirements    JSONB NOT NULL DEFAULT '[]',
    quantity               VARCHAR(32)          -- kept as free text: tenders phrase this inconsistently
);

CREATE TABLE requirements (                     -- query decomposition output (§5.2)
    requirement_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id         UUID NOT NULL REFERENCES queries(query_id),
    requirement_type VARCHAR(16) NOT NULL,      -- PRODUCT | MATERIAL | SAFETY | TESTING | PERFORMANCE | TERMINOLOGY
    requirement_text VARCHAR(512) NOT NULL,
    source_span      VARCHAR(512)               -- the tender text this was extracted from — the traceability anchor
);
```

### 3.3 Retrieval, evidence, and recommendations

```sql
CREATE TABLE candidates (                       -- hybrid retrieval output, one row per requirement × standard
    candidate_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES requirements(requirement_id),
    standard_id    UUID NOT NULL REFERENCES standards(standard_id),
    bm25_score     NUMERIC(6,4),
    vector_score   NUMERIC(6,4),
    merged_score   NUMERIC(6,4) NOT NULL,
    rerank_score   NUMERIC(6,4),                 -- NULL until the re-ranker has run
    UNIQUE (requirement_id, standard_id)
);
CREATE INDEX idx_candidates_requirement ON candidates (requirement_id, merged_score DESC);

CREATE TABLE evidence (
    evidence_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id  UUID NOT NULL REFERENCES candidates(candidate_id),
    criterion     VARCHAR(24) NOT NULL,          -- PRODUCT_CATEGORY | MATERIAL | INTENDED_USE | SCOPE | TEST_REQUIREMENT
    matched       BOOLEAN NOT NULL,
    rationale     TEXT NOT NULL
);

CREATE TABLE recommendations (                   -- one row per standard surfaced to the user for a query
    recommendation_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id                 UUID NOT NULL REFERENCES queries(query_id),
    standard_id               UUID NOT NULL REFERENCES standards(standard_id),
    relationship_type        VARCHAR(16) NOT NULL,   -- PRIMARY | SUPPORTING | TERMINOLOGY | SAFETY | INFERRED
    semantic_relevance       NUMERIC(5,2) NOT NULL,  -- 0-100, kept separate from official_applicability (§7)
    evidence_match_count     INT NOT NULL,
    evidence_match_total     INT NOT NULL,
    official_applicability   VARCHAR(48) NOT NULL DEFAULT 'REQUIRES_OFFICER_VERIFICATION',
    justification            TEXT NOT NULL,          -- plain-language "why this applies"
    rank                     INT NOT NULL,
    UNIQUE (query_id, standard_id)
);

CREATE TABLE why_not (                           -- rejected near-miss candidates (§8)
    why_not_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id         UUID NOT NULL REFERENCES queries(query_id),
    standard_id      UUID NOT NULL REFERENCES standards(standard_id),
    shared_traits    JSONB NOT NULL DEFAULT '[]',   -- e.g. ["same product category"]
    differing_traits JSONB NOT NULL DEFAULT '[]',   -- e.g. ["different intended application"]
    rejection_text   TEXT NOT NULL
);

CREATE TABLE specification_risks (               -- Specification Risk Detector output (§6.2)
    risk_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id        UUID NOT NULL REFERENCES queries(query_id),
    requirement_id  UUID REFERENCES requirements(requirement_id),  -- NULL if the gap is tender-wide, not one requirement
    risk_type       VARCHAR(32) NOT NULL,   -- MISSING_MATERIAL_SPEC | MISSING_TEST_METHOD | AMBIGUOUS_SAFETY_REQUIREMENT | UNMEASURABLE_PERFORMANCE_REQUIREMENT | OTHER
    description     TEXT NOT NULL
);
```

### 3.4 Audit and feedback

```sql
CREATE TABLE audit_log (                         -- every pipeline stage, for the "view analysis" panel (§9)
    log_id      BIGSERIAL PRIMARY KEY,
    query_id    UUID NOT NULL REFERENCES queries(query_id),
    stage       VARCHAR(24) NOT NULL,   -- EXTRACTION | DECOMPOSITION | RETRIEVAL | RERANKING | EVIDENCE_VALIDATION
                                        --   | CLASSIFICATION | RECOMMENDATION | WHY_NOT | RISK_DETECTION
    payload     JSONB NOT NULL,
    model       VARCHAR(32),            -- 'claude-haiku-4.5' | 'claude-sonnet-4.5' | NULL for non-LLM stages
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_query_stage ON audit_log (query_id, created_at);

CREATE TABLE feedback (                          -- UI + storage only per the source spec; no learning loop in scope
    feedback_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(recommendation_id),
    relevant          BOOLEAN NOT NULL,
    reason            VARCHAR(24),      -- WRONG_PRODUCT | WRONG_MATERIAL | WRONG_APPLICATION | OUTDATED | OTHER; NULL when relevant=true
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Note on `coverage_matrix` and the knowledge graph:** neither gets its own table. Both are read-time renderings of tables that already exist (§6.1, §6.3) — this is the same design instinct as the rest of the schema: retrieval and evidence data is written once, and every explainability feature is a view over it, not a parallel pipeline.

---

## 4. Catalog curation

The data strategy the source spec settles on: BIS doesn't release full standard text for free and doesn't publish a queryable revision or supersession history, but its public catalog does give every standard's number, title, technical committee, and usually a one-line-to-paragraph scope statement — which is exactly what a recommendation engine needs to index, even without the paywalled normative text behind it.

**Target catalog:** ~450 standards across the three sectors the team can speak to with confidence — roughly 150 per sector.

| Sector | Target count | Example scope |
|---|---|---|
| Electrical Safety | ~150 | switchgear, wiring accessories, appliance safety, cable insulation |
| Packaging Materials | ~150 | corrugated fibreboard, food-contact plastics, labelling, container specifications |
| Construction & Building Materials | ~150 | cement grades, structural steel, bricks and blocks, waterproofing |

**Curation pipeline (`curation/seed_catalog.py`, run once, no LLM tokens for the load itself):**

1. Pull number, title, technical committee, and scope text for each standard from the public BIS catalog pages into `curated_standards/<sector>.csv`.
2. Load each row into `standards`, assigning `sector_id` and defaulting `status = 'UNKNOWN'` (§14 — status is never set to `SUPERSEDED`/`WITHDRAWN` without an authoritative feed, which doesn't exist yet).
3. Embed `title + ' ' + scope_text` with `sentence-transformers/all-MiniLM-L6-v2` (384-dim, runs comfortably on the RTX 4050's 6GB VRAM or even CPU-only) and store the vector.
4. `search_tsv` is a generated column — no separate step needed.

**Allied-edge inference (`curation/infer_allied_edges.py`, one offline Claude Haiku pass over standard pairs within a sector, run once after curation, re-run only when the catalog changes):** for each standard, find the top-K nearest neighbours by embedding similarity, ask Claude to classify the relationship (`SUPPORTING` / `TERMINOLOGY` / `SAFETY` / no relationship) from the two scope texts, and write accepted pairs into `allied_relationships` with `is_inferred = true` and the model's stated rationale. This is the one step in the whole pipeline that runs at curation time rather than query time, which keeps per-query latency and API cost down.

Being upfront in the submission that the engine indexes catalog metadata today, not licensed full text or an authoritative revision feed, is the honest framing the source spec settles on — and it's also what powers the coverage indicator (§8).

---

## 5. Core recommendation pipeline

```python
def recommend(query_id: str) -> RecommendationResult:
    profile      = extract_product_profile(query_id)            # §5.1 — Claude Haiku, structured JSON out
    requirements = decompose_requirements(profile, query_id)     # §5.2 — Claude Haiku

    for r in requirements:
        bm25_hits   = keyword_search(r.requirement_text)                    # Postgres ts_rank on search_tsv
        vector_hits = similarity_search(embed(r.requirement_text))          # pgvector cosine on embedding
        candidates  = merge_and_score(bm25_hits, vector_hits)               # -> `candidates` rows, §5.3
        reranked    = rerank(r, candidates)                                 # Claude Sonnet, one call per requirement
        validate_evidence(r, reranked)                                      # Claude Haiku -> `evidence` rows, §5.4

    recommendations = consolidate(requirements)          # merge per-requirement candidates into one ranked set per standard
    classify_relationships(recommendations)              # §5.5 — PRIMARY/SUPPORTING/TERMINOLOGY/SAFETY/INFERRED
    why_not = explain_rejections(near_miss_candidates(requirements))   # §7 — Claude Sonnet
    risks   = detect_specification_risks(profile, requirements)        # §6.2 — Claude Sonnet

    audit_service.log_every_stage(query_id)
    return RecommendationResult(recommendations, why_not, risks)
```

### 5.1 Product profile extraction

A query arrives one of two ways: a short typed description, or an uploaded tender document. Document uploads go through text extraction (PDF/DOCX parsing, OCR fallback for scanned pages) before this step; a typed description skips straight to it. Either way, a Claude Haiku call converts the input into the structured profile stored in `product_profiles` — product, category, material, intended use, technical requirements, safety requirements, quantity — rather than leaving it as a paragraph the rest of the pipeline would have to re-parse.

### 5.2 Query decomposition

Rather than treating a tender as one query, the structured profile is broken into the distinct procurement-relevant requirements it actually contains — product, material, safety, testing, and performance are retrieved against the catalog separately, each producing its own `requirements` row with a `source_span` pointing back at the originating tender text. This is the traceability anchor: every downstream recommendation can point back to the specific line of the tender that produced it.

### 5.3 Hybrid retrieval

Per requirement, two searches run in parallel and merge into one candidate pool before re-ranking:

- **Keyword (`search_tsv` + `ts_rank`)** — catches exact standard numbers and technical terms an embedding can miss.
- **Semantic (`pgvector` cosine similarity)** — catches standards that are relevant by meaning but worded differently.

`merged_score` is a weighted combination (tunable; start at 0.5/0.5) of the two normalized scores, and both raw scores are kept in `candidates` so re-ranking and the eventual demo narrative can point at *which* search found a given standard — a keyword hit and a semantic hit tell a different story to a domain-literate evaluator.

### 5.4 Confidence & evidence layer

Every recommendation surfaces three separate lines rather than one blended score, because collapsing them risks implying the system certifies official applicability rather than surfacing a well-evidenced candidate:

```
IS 1234 — semantic relevance: 94%
Evidence match: 5/5 (product category ✓, material ✓, intended use ✓, scope ✓, test requirement ✓)
Official applicability: Requires procurement officer verification
```

`evidence_match_count` / `evidence_match_total` come straight from the `evidence` rows a Claude Haiku validation call writes per candidate, checking each of the five criteria independently. `official_applicability` is a constant, never model-generated — it is the UI's explicit statement of the design principle in §1.

### 5.5 Relationship classification

Each surfaced standard is tagged by relationship type rather than shown as uniformly "applicable":

| Type | Meaning |
|---|---|
| `PRIMARY` | The standard that directly applies to the product |
| `SUPPORTING` | A test or inspection standard used to verify compliance |
| `TERMINOLOGY` | Defines technical terms used in the primary standard |
| `SAFETY` | A related safety requirement |
| `INFERRED` | Surfaced from shared vocabulary rather than a documented citation |

Only `PRIMARY` comes directly off the per-requirement retrieval; the rest are read off `allied_relationships` (§3.1, §4) for the primary standard(s) in the result set.

---

## 6. The three headline features

Ranked in the last feedback round, in build order: cheapest and highest-impact first.

### 6.1 Requirement Coverage Matrix — build first

The single best addition across all three feedback rounds, and nearly free: query decomposition (§5.2) already breaks a tender into requirements, and hybrid retrieval (§5.3) already finds candidates per requirement. The matrix is a different rendering of data the pipeline already computed — no new table, no new pipeline stage.

```python
def build_coverage_matrix(query_id: str) -> CoverageMatrix:
    requirements = get_requirements(query_id)
    cells = {
        r.requirement_id: {
            c.standard_id: evidence_passes(c)          # True/False per requirement × standard
            for c in get_candidates(r.requirement_id)
        }
        for r in requirements
    }
    gaps = [r for r in requirements if not any(cells[r.requirement_id].values())]
    return CoverageMatrix(requirements=requirements, cells=cells, gap_count=len(gaps), gaps=gaps)
```

Output shape, rendered as a grid in `CoverageMatrix.tsx`:

| Tender Requirement | IS 1234 | IS 5678 | IS 9012 |
|---|---|---|---|
| Material specification | ✓ | ✗ | ✓ |
| Safety requirement | ✓ | ✓ | ✗ |
| Testing requirement | ✓ | ✓ | ✓ |
| Performance requirement | ✓ | ✗ | ✗ |

...with a headline number under it: *"3 tender requirements have insufficient standard coverage."* This is the reframe that matters: the system stops being a tool that finds standards and becomes one that identifies coverage gaps in the procurement specification — a question a keyword search, or even a plain RAG system, cannot answer at all.

### 6.2 Specification Risk Detector — build second

Pairs with the coverage matrix rather than competing with it: one flags what's wrong with the tender's *standards coverage*, this one flags what's wrong with the tender's *own specifications*, before any standard is even recommended. It reuses the same structured profile and requirement set the retrieval pipeline already extracted, so it's an added reasoning pass, not new infrastructure — one Claude Sonnet call per query, not per requirement.

```python
def detect_specification_risks(profile: ProductProfile, requirements: list[Requirement]) -> list[SpecificationRisk]:
    """Checks the tender's own specifications for gaps a procurement officer should close
    before the tender goes out — independent of which standards match. One call per query."""
    ...
```

Example output:

```
⚠ Missing material specification
⚠ Testing method not specified
⚠ Ambiguous safety requirement
⚠ Performance requirement lacks a measurable value

Potential specification gaps detected: 4
```

This is the change the source spec names explicitly: it moves the product from a *Standard Search Engine* to an *AI Procurement Specification Assistant*.

### 6.3 Standards Knowledge Graph — build third

A natural extension of the allied-standards feature (§5.5, §3.1) already in the spec: instead of a flat per-query list of related standards, it's the same `allied_relationships` table read as a graph, so a procurement officer can ask "if this standard applies, what else should I check?" independent of any specific query.

```python
def build_standards_graph(standard_id: str, depth: int = 1) -> Graph:
    """Nodes/edges straight off `standards` + `allied_relationships` — the same table the
    allied-standards feature already writes to at curation time. A query, not a pipeline stage."""
    edges = get_allied_relationships(standard_id, depth)
    nodes = {n.standard_id: n for n in collect_nodes(edges)}
    return Graph(nodes=nodes, edges=edges)
```

Rendered in `KnowledgeGraphView.tsx` with `react-force-graph-2d`: `PRIMARY` edges solid, `SUPPORTING`/`TERMINOLOGY`/`SAFETY` distinguished by colour, `INFERRED` edges dashed. Ranked third of the three because it's a structural upgrade to something already planned rather than a new capability — real value, but the coverage matrix and risk detector each open a question the system couldn't answer before, and this one makes an existing answer better organized.

---

## 7. Why Not This Standard & Comparison View

For a query with several plausible candidates, the system shows not just why the top matches were chosen but why close alternatives were rejected — reusing the same evidence-validation step (§5.4) against near-miss candidates, so it costs extra Claude calls but no new architecture:

```
Why IS 1234?          Why not IS 5678?             Why not IS 9012?
✓ Correct category    ✓ Similar product            ✓ Same material
✓ Correct material     ✗ Different application       ✗ Different product
✓ Intended use matches
```

The **Standards Comparison View** is a frontend-only addition on top of the same data: a table of standard number, relevance tier, and per-criterion match (product / material / intended use), plus current status where known — no new backend logic, since it's a different rendering of what the confidence-and-evidence layer already computed.

---

## 8. Audit trail & coverage indicator

**Audit trail.** Every recommendation logs its full trail to `audit_log`: the original query, the extracted and decomposed product profile, the retrieved candidate set, the ranking factors, the evidence checklist, the final recommendation, the model and prompt version used, and a timestamp. An evaluator opens a "view analysis" panel on any result and sees exactly how it was produced — mostly logging what the pipeline is already computing at each stage, not new work.

**Coverage indicator.** Since the catalog is a deliberately curated subset, the UI says so on every page, not just when asked:

```
Indexed catalog: 450 standards across 3 sectors
⚠ Coverage limitation: recommendations are limited to the indexed BIS catalog.
```

This turns the data-completeness risk (§14) the team already knows about into something the system discloses on its own.

---

## 9. Feedback mechanism

Each recommendation carries a relevant / not-relevant control; a not-relevant response prompts a reason (`WRONG_PRODUCT` / `WRONG_MATERIAL` / `WRONG_APPLICATION` / `OUTDATED` / `OTHER`), written to `feedback`. In scope for this build: the UI and the storage. Out of scope: retraining or adjusting the re-ranker from live feedback — that's ongoing infrastructure work, not a hackathon-timeline feature.

---

## 10. API surface

| Method & path | Purpose | Body / params | Response |
|---|---|---|---|
| `GET /health` | UptimeRobot keep-alive | — | `{"status":"ok"}` |
| `POST /queries` | submit a query | `{input_type:"text", text}` or multipart file upload | `{query_id, status}` |
| `GET /queries/{id}` | status + product profile | — | `queries` row + `product_profiles` row |
| `GET /queries/{id}/requirements` | decomposed requirements | — | `requirements[]` |
| `GET /queries/{id}/recommendations` | ranked recommendations | — | `recommendations[]` with evidence + relationship type |
| `GET /queries/{id}/coverage-matrix` | §6.1 | — | `{requirements, cells, gap_count, gaps}` |
| `GET /queries/{id}/risks` | §6.2 | — | `specification_risks[]` |
| `GET /queries/{id}/why-not` | §7 | — | `why_not[]` |
| `GET /queries/{id}/comparison` | §7 | — | candidate comparison table rows |
| `GET /queries/{id}/audit` | §8 | — | ordered `audit_log` rows |
| `GET /standards` | browse the curated catalog | `?sector=` | `standards[]` + total indexed count |
| `GET /standards/{id}/graph` | §6.3 | `?depth=1` | `{nodes, edges}` |
| `POST /recommendations/{id}/feedback` | §9 | `{relevant, reason?}` | `{feedback_id}` |

CORS via `CORSMiddleware`, origins from `ALLOWED_ORIGINS` (the Vercel domain + `http://localhost:5173`).

---

## 11. Tech stack & model routing

| Layer | Choice | Why |
|---|---|---|
| Backend | FastAPI | API gateway across document- and query-processing paths |
| Database | PostgreSQL (Neon) + pgvector + native full-text search | one store for catalog, retrieval, and audit data — no separate vector DB |
| Document processing | PDF/DOCX text extraction + OCR fallback | tender uploads are the second entry point |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2`, local | fits comfortably in 6GB VRAM, no per-query API cost |
| Reasoning | Claude API | extraction, decomposition, re-ranking, evidence validation, explanation, risk detection |
| Frontend | React + Tailwind | results, matrix, graph, comparison, audit views |
| Packaging | Docker | consistent demo environment |

**Model routing** — the one deliberate cost/quality split, since this pipeline makes several Claude calls per query:

| Stage | Model | Why |
|---|---|---|
| Product profile extraction (§5.1) | Haiku | high volume, structured JSON, low reasoning need |
| Query decomposition (§5.2) | Haiku | same |
| Evidence validation (§5.4) | Haiku | runs once per candidate — the highest call volume in the pipeline |
| Allied-edge inference (§4) | Haiku | mechanical, runs offline at curation time, not per query |
| Re-ranking (§5.3) | Sonnet | a judgment call across a small, already-filtered pool |
| Justification / why-not text (§7) | Sonnet | has to read well in front of judges |
| Specification risk narrative (§6.2) | Sonnet | same |

---

## 12. Deployment

| Piece | Host | Config |
|---|---|---|
| DB | **Neon** | PG16; `vector` + `pg_trgm` extensions; pooled `DATABASE_URL` |
| Backend | **Render** Web Service | root `backend/`; build `pip install -r requirements.txt`; start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`; env `DATABASE_URL`, `ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS` |
| Curation | one-off | `python -m curation.seed_catalog` then `python -m curation.infer_allied_edges`, run locally against Neon |
| Frontend | **Vercel** | root `frontend/`; build `npm run build`; output `dist`; env `VITE_API_BASE` |
| Keep-alive | **UptimeRobot** | HTTP monitor on `…onrender.com/health`, 5-min interval |

`.env.example` committed for both apps; real `.env` git-ignored.

---

## 13. Build order & roadmap

Phases, not fixed days — the open question about whether this submission shares AdiSetu's Sept 30 deadline or runs on the national round's own timeline is still unresolved (it sits as a live comment in the source spec). Resolve that first and this table becomes a day-by-day schedule the way a fixed-deadline sprint plan would.

| Phase | Deliverable | Definition of done |
|---|---|---|
| **0 — Foundation** | Schema (§3) live on Neon; ~450 standards curated and embedded (§4); allied edges inferred | `seed_catalog.py` + `infer_allied_edges.py` run clean; catalog browsable via `GET /standards` |
| **1 — Core loop** | Hybrid retrieval (§5.3), confidence & evidence layer (§5.4), primary/allied classification (§5.5), coverage indicator (§8) | A single product description returns ranked, evidenced recommendations end to end |
| **2 — Explainability tier** | Query decomposition & traceability (§5.2), document upload + extraction (§5.1), audit trail (§8), why-not (§7), comparison view (§7) | A full tender upload produces decomposed requirements, each traceable to a recommendation, with a viewable audit trail |
| **3 — Headline features** | Requirement Coverage Matrix (§6.1) → Specification Risk Detector (§6.2) → Standards Knowledge Graph (§6.3), in that order | Each ships independently; the matrix alone is the minimum bar if time runs short |
| **4 — Stretch** | Feedback UI (§9); duplicate/superseded detection **only if** a real BIS revision-status source is found (§14) | Feedback buttons store responses; superseded-standard flag never ships without an authoritative source |

If only one thing from Phase 3 ships, it's the coverage matrix — no contest, per the ranking already agreed.

---

## 14. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Standards-data gap — BIS doesn't release full text or a revision feed for free | Curate catalog metadata honestly; disclose it in the coverage indicator (§8) rather than overclaiming |
| Inferred allied-standards graph could be mistaken for verified citations | Every inferred edge carries `is_inferred = true` and a stated rationale; UI always shows the relationship-type label (§5.5) |
| Duplicate/superseded standard detection has no authoritative data source | Left out of the core build (§13 Phase 4); if attempted at all, shipped visibly marked unverified, never alongside confidence-scored recommendations |
| A domain-literate evaluator (standards-aware ministry) probes an edge case live | Deliberately include at least one tricky product description in the curated dataset and test why-not reasoning (§7) against it before the demo |
| LLM overreach — model asserts applicability rather than surfacing evidence | `official_applicability = REQUIRES_OFFICER_VERIFICATION` is a constant, never model-generated (§5.4); system prompt hard rule (§1) |
| Per-query Claude API cost, given several calls per pipeline run | Model routing (§11) keeps high-volume stages on Haiku; allied-edge inference runs once offline, not per query |

---

## 15. Out of scope (deferred, with reasons)

- **Reverse search** (standard → tenders/products) — needs historical tender data the team doesn't have.
- **Contradiction detection** (e.g. "Aluminium" vs "Stainless Steel" in the same tender) — a real NLP problem with real false-positive risk on a live demo document.
- **"What changed" comparison / counterfactual search** — good ideas, but they compete for time against the three headline features without adding a comparably new capability.
- **Multi-agent architecture as a pitched feature** — CrewAI or an equivalent is a fine way to implement the pipeline stages internally, but "we used five agents" is not the differentiator; the differentiator is the coverage matrix, the risk detector, and the honest evidence layer.
- **Duplicate/superseded standard detection as an authoritative feature** — see §14; only ships, if at all, visibly marked unverified.

---

## 16. Team & workstreams

Five workstreams that run mostly in parallel once the schema (§3) and API contracts (§10) are agreed on:

1. **Data curation & embeddings** — catalog sourcing, `seed_catalog.py`, allied-edge inference.
2. **Hybrid retrieval & re-ranking** — §5.3, §5.4, the pipeline's core scoring logic.
3. **Confidence/evidence & headline features** — §5.4, §5.5, §6 (coverage matrix, risk detector, knowledge graph).
4. **Frontend** — results view, coverage matrix, graph view, comparison view, feedback controls.
5. **Document processing** — PDF/DOCX/OCR extraction into the structured product profile (§5.1).

---

## 17. Prerequisites before coding

1. **Resolve the timeline question** (§13) — confirm on the portal whether SIH26108 shares AdiSetu's Sept 30 deadline or runs separately, since that decides how compressed Phases 0–4 need to be.
2. **Anthropic API key** for the Claude calls throughout the pipeline.
3. **Neon** `DATABASE_URL` (pooled), with `vector` and `pg_trgm` available.
4. Curated source lists for the three sectors' public BIS catalog entries, ready to convert into `curated_standards/*.csv`.
5. Local: Python 3.11, Node 24 — already the team's standard toolchain.
