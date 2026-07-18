# Lighthouse causal analysis

The Lighthouse workflow is designed as a diagnostic system rather than a score-only check.

## Analysis model

Each workflow run produces three connected dimensions:

1. **Cause** — the technical source of a problem, such as render-blocking resources, unused JavaScript, image delivery, main-thread work, DOM complexity, or layout instability.
2. **Space** — the affected route and device profile. The current matrix covers the landing page and founding café proposal on mobile and desktop.
3. **Time** — the change versus the latest saved `main` baseline.

The report follows this chain:

> Root cause → technical mechanism → observed metric → user and business effect

## Evidence produced

Every run creates:

- raw mobile Lighthouse reports;
- raw desktop Lighthouse reports;
- `analysis.json` with normalized metrics and ranked causes;
- `summary.md` for the GitHub Actions job summary;
- `causal-graph.mmd` with a Mermaid cause graph;
- `history.jsonl` with the measured `main` snapshots used for time comparisons.

The evidence is stored as a private GitHub Actions artifact for 30 days. Lighthouse reports are not uploaded to temporary public storage.

## Priority model

A cause receives higher priority when it:

- has measurable potential savings in milliseconds;
- has measurable potential savings in transferred bytes;
- fails or nearly fails a Lighthouse audit;
- has a high observed browser cost;
- affects more than one route or device profile.

This makes repeated causes rank above isolated cosmetic findings.

## Quality gates

Both mobile and desktop checks enforce:

- Accessibility ≥ 90;
- Best Practices ≥ 90;
- SEO ≥ 90;
- CLS ≤ 0.1.

Performance, LCP, and TBT currently produce warnings rather than blocking failures. This preserves visibility while the project establishes a stable baseline.

## Interpretation rules

1. Fix causes affecting multiple surfaces before one-off optimizations.
2. Prefer causes supported by measured time or byte savings.
3. Treat mobile regressions as higher risk because slower CPUs and networks amplify them.
4. Use the time comparison to separate persistent limitations from new regressions.
5. Re-run after every fix. A cause is resolved only when both the metric and the underlying audit improve.

## Current measured surfaces

| Route | Mobile | Desktop |
|---|---:|---:|
| Landing page | Yes | Yes |
| Founding café proposal | Yes | Yes |

The model can later be extended with additional routes, authenticated flows, real-user monitoring, or conversion metrics.
