---
name: geotab-weekly-review
description: >-
  Produce a manager-ready weekly fleet review from a Geotab MCP connection —
  a one-line headline, one whole-fleet ranking chart, and at most three
  bullets. Encodes Geotab data quirks and a strict no-PII default so the
  answer is correct and repeatable for anyone on the team.
---

# Geotab Weekly Fleet Review

A reusable skill for any MCP client connected to the Geotab MCP connector. It
turns "run my weekly review" into the *same* correct brief every time — and,
crucially, it **grounds the language between Geotab and what the assistant would
otherwise assume**, so it doesn't fall into the common traps below.

## When to use

When the user asks for a weekly/periodic fleet review, a "Monday morning"
summary, or "how did the fleet do this week." Default window: **last 7 days**.

## What to check

Six areas, every week:

1. **Fleet size** — how many devices are reporting.
2. **Faults / maintenance** — active faults in the window.
3. **Driving exceptions** — speeding (posted-speed and over-speed), harsh
   braking/acceleration/cornering.
4. **HOS** — hours-of-service violations (see per-driver note).
5. **DVIR** — inspection logs / defects in the window.
6. **Trip activity** — qualitative (see trip-count note).

## Output format

This shape was **settled in conversation with the fleet manager** — reshape it
for yours; that back-and-forth is the whole point of writing a skill:

- **Headline first** — one line with the week's verdict.
- **One chart** — top vehicles from a whole-window aggregate, never from a
  capped raw list (see the grounding rules). Managers skim on Monday; the
  chart carries the argument the paragraphs were making.
- **Three bullets max**, then stop. The brief gets forwarded, so it must read
  as-is: plain language, no jargon, no raw JSON.
- **Chart only what has signal.** A clean section is a sentence ("zero active
  faults — clean maintenance week"), not a chart of zeros.

## Grounding rules (avoid these traps)

These are real Geotab behaviours that an assistant gets wrong without context:

- **Never report a raw Trip count.** `GetCountOf` on `Trip` ignores the date
  window and returns the all-time total (millions, even for a small fleet).
  Summarize trip activity qualitatively, or pull a bounded set of trip records.
- **HOS is per-driver.** `DutyStatusViolation` requires a `userSearch`; you can't
  pull it fleet-wide in one call. Treat HOS as a **spot-check**, and say so —
  don't imply a fleet-wide sweep you didn't run.
- **Don't infer outliers from a capped list.** `Get` on `ExceptionEvent` returns
  the newest rows up to `resultsLimit` (often 200). The first page can make one
  vehicle look like a lone offender when the issue is fleet-wide. To rank
  vehicles — and to chart them — **aggregate the whole window** (e.g. via
  Geotab Ace), never the first page.
- **A clean section is a finding, not a gap.** Zero active faults or zero DVIRs in
  the window is normal for many fleets — report "clean week," never invent data.
- **Summarize repeating demo data.** Demo databases repeat events on a fixed
  cadence; report counts, don't dump raw rows.

## No-PII default (important)

Work at the **vehicle/asset level**, not the person level:

- Use **device names** (e.g. "Demo - 06"), never driver names.
- **Watch the name field itself.** In some fleets the device *name* encodes a
  person (a driver's name, a personal route). When that's a risk, refer to a
  vehicle by **make/model + a non-identifying id** instead of its name (decode the
  VIN if make/model isn't on hand). Caveat: make/model only disambiguates when the
  vehicles actually differ — a fleet of identical vans needs the id too.
- **Never** return email addresses, phone numbers, employee numbers, or precise
  per-person location histories.
- If the user explicitly needs person-level detail, surface this rule first and
  ask them to confirm they've reviewed their PII/DPA obligations.

The connector inherits the user's MyGeotab permissions and *can* surface personal
data; this skill deliberately stays asset-level so a routine review never does.

## Suggested tool flow

1. `GetCountOf` `Device` → fleet size.
2. `GetCountOf` / `Get` `FaultData` (with `fromDate`/`toDate`) → faults.
3. `Get` `ExceptionEvent` for the window; for the ranking chart, use
   `GetAceResults` ("top N vehicles by speeding events, last 7 days") — the
   capped raw list can't be charted honestly.
4. HOS: spot-check `DutyStatusViolation` with a `userSearch` for a few drivers.
5. `Get` `DVIRLog` for the window.
6. Trips: bounded `Get` on `Trip`, or describe activity qualitatively.

## Output style

Plain language, short sentences, manager-ready and forwardable. No jargon, no
raw JSON, no PII. Lead with the single most important thing the manager should
do this week.
