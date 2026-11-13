# Roadmap

Where the Global Horizon Standard is heading, release by release. Task-level detail and proposed
solutions are in [TODO.md](TODO.md); shipped changes are in [CHANGELOG.md](CHANGELOG.md).

Last updated 2026-11-13 (12026.09.12). This is a proposal — reorder freely.

## Now

| Package | Version | State |
|---|---|---|
| `ghs-time` (core) | 3.0.0 | Anchored at `12000.01.01 = Unix day 11,036` (`ε = 286`), closed-form, bijective. Not yet on npm. |
| `ghs-cli` | 1.0.0 | Not yet on npm. |
| `ghs-api`, `ghs-web`, `ghs-extension` | 1.0.0 | Private workspaces consuming `ghs-time` `^3.0.0`. |
| `ghs_mobile` (Flutter) | 0.1.0 | Self-contained Dart port of core, verified against `test/fixtures/vectors.json`. |

## Done in `ghs-time` 3.0.0

- D1 — coupled the origin to the March equinox of 2000, defined as an integer day on the Unix time
  base (`12000.01.01 = Unix day 11036`, `ε = 286`); GHS weekdays coincide 1:1 with the existing
  seven-day week
- C2 — validated eras (`MIN_ERA…MAX_ERA`); closed-form $O(1)$ year arithmetic
- C3 — clamped beats in `parseGHSDate` so values near `1000` never roll into the next day
- C4 — corrected the Easter rule in `HOLIDAYS`
- C5 — aligned `parseGHSString` with `spec/timestamp-format.md` (`GHS ` prefix, optional space)
- P1 & P2 — updated specs, docs, `README.md`, `ghs_mobile`, and generated `spec/vectors.json`

## Next — First npm release

- First npm release of `ghs-time` and `ghs-cli`: release workflow, git tags, provenance; replace the
  `"ghs-time": "*"` ranges in `ghs-cli`/`ghs-ui`/`ghs-web` with real version ranges
- Declare the calendar constants (epoch, ε) frozen as "GHS 1.0"

## Later

- Dynamic holidays computed in core: Easter via computus first, lunar calendars as opt-in modules
- `Temporal` interop (`toGHS(Temporal.Instant)`) once it is baseline in Node and browsers
- Millibeat precision in parser and formatter, if the spec keeps the unit
- Further ports (Python, Rust), driven entirely by the conformance vectors
- Store releases: browser extension, mobile app
- Localized month and weekday names (the spec currently mandates English)

## Repository structure

Decision 2026-11-13: **stay a monorepo.**

- Core changes are cross-cutting. D1 touches core, the Dart port, the spec, the docs and the API
  tests — one atomic commit here, five coordinated releases across split repos.
- The consumers are not independent: `ghs-ui` is consumed from source without a build, and
  `ghs-time` is not on npm, so split repos would have nothing to depend on.
- One maintainer, one CI pipeline, one Dependabot config.

A GitHub organization is independent of that question: the single repo can be transferred to an
org for the name and for future collaborators at any time (GitHub redirects the old URL).

Revisit when one of these happens:

1. `ghs_mobile` gets its own release pipeline or maintainers — it is already outside the npm
   workspace graph and is the natural first split.
2. Third parties implement the spec — then `spec/` plus the conformance vectors become their own
   repo and every implementation, including this one, consumes them.
3. A package needs a release cadence or access rules that conflict with the rest.

Prerequisites for any split: `ghs-time` published with semver ranges, and the conformance vectors
in place.
