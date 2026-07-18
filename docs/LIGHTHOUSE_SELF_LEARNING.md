# Self-learning Lighthouse CI

The Lighthouse workflow keeps an auditable statistical model of accepted `main` runs. It learns the normal range for every measured route, device profile, and quality measure, then evaluates pull requests against that memory.

## Learning boundary

Only a successful `push` to `main` updates `.lighthouse-history/model.json`.

Pull-request runs:

- restore the latest accepted model;
- evaluate the proposed change;
- generate a decision and preview;
- never write their measurements into the persistent model.

This prevents experiments, regressions, and noisy PR runs from redefining normal.

## Stable surface identity

Lighthouse starts a local server on an ephemeral port. Full localhost URLs therefore cannot be used as persistent learning keys.

Before learning, the workflow normalizes every result to a stable identity:

```text
device profile × route
```

The original URL is retained as `sourceUrl` in the evidence, while the statistical model uses the stable route identity. This allows samples from separate workflow runs to accumulate correctly.

## What the model remembers

For each `route × profile × measure` surface it stores up to 20 accepted values for:

- Performance;
- Accessibility;
- Best Practices;
- SEO;
- LCP;
- CLS;
- TBT;
- FCP;
- Speed Index.

It also remembers cause history:

- number of appearances;
- persistence across accepted runs;
- consecutive appearances;
- observed resolutions;
- recurrences after resolution;
- average priority and potential savings.

## Robust learning

The expected value is the rolling median. Noise is estimated with median absolute deviation (MAD), not a simple average and standard deviation.

This makes the model resistant to a single slow runner or unusual browser measurement.

The adaptive boundary is based on:

```text
expected ± max(2.5 × robust noise, absolute tolerance)
```

For higher-is-better scores the boundary is a minimum. For lower-is-better timings and layout shift it is a maximum.

## Confidence stages

| Accepted samples | Mode | Behaviour |
|---:|---|---|
| 0–4 | warming-up | report only; fixed hard gates still apply |
| 5–9 | active | adaptive regression gates may block a PR |
| 10+ | mature | full learned envelope and drift monitoring |

Confidence is calculated separately for each surface and measure.

## Safety invariant

Learned gates may tighten expectations, but they can never weaken the fixed floors and ceilings.

Examples:

- learned Accessibility cannot fall below 90;
- learned mobile LCP cannot become more permissive than 4000 ms;
- learned CLS cannot become more permissive than 0.1.

The system therefore cannot learn to accept long-term degradation.

## Drift and recurrence

A regression can happen gradually without one run crossing a boundary. The model calculates the recent per-run slope and raises a drift watch when the trend moves consistently in the wrong direction.

Root causes also gain memory. A cause that persists across many accepted runs or returns after being resolved receives higher diagnostic attention.

## Outputs

Every workflow run creates:

- `learning-summary.md` — human-readable decision;
- `learning-decision.json` — machine-readable gates and statuses;
- `learning-model-preview.json` — the model after the current run, without persisting it on PRs;
- `.lighthouse-history/model.json` — accepted persistent model on `main` only;
- the existing causal, spatial, temporal, raw HTML, and JSON evidence.

## Failure policy

A pull request fails when:

1. a fixed hard threshold is crossed; or
2. at least five accepted samples exist and a learned noise-aware boundary is crossed.

A drift watch is reported but does not block by itself. This gives the team time to address slow deterioration before it becomes a regression.

## Trust model

This is deterministic online statistical learning, not an opaque external AI service. Every sample, formula, boundary, decision, and cause transition remains inspectable in repository artifacts.
