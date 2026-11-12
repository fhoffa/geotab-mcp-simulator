# Flood readiness plan — Vegas demo fleet (Geotab MCP + CARTO MCP)

This builds on [FLOOD-DEMO.md](FLOOD-DEMO.md). That runbook asks "what happened this
year". This one asks **"where has flooding hit our routes for a decade, and what do we
change?"** Every number here comes from a real call made on 11–12 Nov 2026. The only
exception is the customer list in step 5 of the runbook, which is fictional.

**Saved CARTO map:** *Vegas fleet flood risk 2016–2026* (Builder id
`3cca1203-6133-436e-b36c-10286e1e5db7`). It shows the fleet routes, the scored risk cells
(red = high, orange = medium) and every NWS flood report in the valley.

## The data, and where each piece came from

| Layer | Source (call) | Size |
|---|---|---|
| Fleet routes | Geotab `Get LogRecord` (Demo - 02, 30 Oct, 19:40–22:55 UTC): one GPS loop through all six stops | 598 points → 6 legs, 99.6 km, written to `shared.geotab_vegas8_routes` |
| Fleet volume | Geotab `Get Trip` over 24 h (10–11 Nov) | 2,139 trips, 35,619 km/day, about 89 trips every hour around the clock; each leg runs ~357 times a day |
| Warnings | CARTO `import_data`: Iowa Environmental Mesonet storm-based warnings, NWS Las Vegas (`VEF`), 2016–2026 | 3,207 polygons, 1,354 of them flash flood warnings, in `shared.nws_vef_warnings_2016_2026` |
| Ground truth | CARTO `import_data`: NWS Local Storm Reports, `VEF`, 2016–2026 | 4,838 reports; **133 flood reports in the Las Vegas valley** (119 flash flood + 14 flood), in `shared.nws_vef_storm_reports_2016_2026` |
| Terrain | CARTO Spatial Features (public) `elevation`, H3 res 8 | each route cell compared with its ~2.5 km neighbourhood |
| Place names | CARTO `geocode` reverse (TomTom) | 6 lookups |

## Finding 1 — Your routes flood in a predictable window

Of the 1,354 flash flood warnings in 10 years, **35 crossed a fleet route**, on 25
different days.

- **Season:** 28 of the 35 (80%) were in **July–September**: July 12, August 6,
  September 10. Outside that: October 3, April 2, June 2.
- **Time of day:** 23 of the 35 (66%) started **between noon and 6 pm local time**, and 28
  (80%) between noon and 9 pm. Only 4 started between midnight and noon.
- **Fleet overlap:** the fleet runs evenly 24/7, so **534 trips a day (25%) run inside the
  noon–6 pm window**.

| Leg | km | Flash flood warnings on it, 2016–2026 | Hours warned | Avg share of the leg covered |
|---|---|---|---|---|
| west of Strip → Summerlin | 27.8 | **26** | 25.8 | 61% |
| Summerlin → north-west | 23.2 | **24** | 27.0 | 59% |
| downtown → south of airport | 16.9 | 23 | 21.9 | 68% |
| south of airport → west of Strip | 8.0 | 22 | 21.5 | 74% |
| north valley → downtown | 14.3 | 18 | 18.9 | 70% |
| north-west → north valley | 9.5 | 15 | 15.9 | 84% |

## Finding 2 — Six flood points sit on the routes

Each of the routes' 105 H3 cells (≈0.7 km² each) is scored on three things:
- how many flash flood warnings covered it in 10 years;
- how many NWS flood reports fell within 750 m;
- how far it sits below its surrounding cells (low ground is where water collects).

Score = warnings ÷ 35 × 40 + min(reports, 3) × 15 + 1.5 × metres below the neighbourhood.
The weights are a judgment call. Say so on stage, and show that the ranking holds up
because the top points stand out on several of the three signals, not just one.
**7 cells score high (≥ 40) and 22 score medium (25–40).**

| # | Risk point (reverse-geocoded) | Leg | Why it scores |
|---|---|---|---|
| 1 | CC-215 Beltway at **Lone Mountain** (36.228, −115.322) | Summerlin → north-west | 14 warnings; **25 m below** its surroundings (a wash crossing). Three neighbouring cells score 43–54 |
| 2 | Beltway, **west Summerlin** (89135, 36.140, −115.341) | west of Strip → Summerlin | 14 warnings; **24 m below** its surroundings |
| 3 | **I-15 at Sahara / Highland Dr** (Meadows Village, 36.138, −115.173) | downtown → south of airport | 15 warnings; **2 flood reports**, including swift-water rescues at **Sahara & Rancho, 11 Oct 2026, 6:14 and 6:35 am** |
| 4 | **Arroyo Crossing Pkwy / south Beltway** (89113, 36.063, −115.256) | west of Strip → Summerlin | 16 warnings (the most on the network); 2 flood reports |
| 5 | **Downtown, MLK Blvd / Charleston** (36.162, −115.162) | north valley → downtown | 15 warnings; flood report **28 Jul 2022: "underpass near Commerce and Charleston flooded with vehicles stuck"**. This is also the fleet's lowest stop (623 m) |
| 6 | **W Tropicana Ave at I-15** (36.098, −115.180) | west of Strip → Summerlin | 16 warnings; **30 Jun 2016: one person swept away and killed in Tropicana Wash**, 80 m from the route |

Also near the routes: a **swift-water rescue at N Decatur Blvd & W Washburn Rd, 11 Oct 2026,
6:14 am**, 217 m from north valley → downtown, and 1 ft of water over the road west of
downtown on 9 Apr 2016.

Caveat: NWS report locations are often rounded to about 1 km, so "80 m from the route"
means the report is in the immediate area, not at a surveyed point.

## Finding 3 — High ground and low ground

From Spatial Features elevation (see the runbook, step 3): Summerlin (874 m) and the
north-west stop (780 m) are high ground. Downtown (623 m) and south of the airport (648 m)
are the two lowest stops, and the flood reports cluster around them. Water in this valley
runs from the west and north-west toward downtown and the Strip.

## The plan

**1. Monsoon operating window (July–September, noon–6 pm)**
- Move as much of the downtown ↔ south-of-airport and west-of-Strip ↔ Summerlin work as you
  can to before noon. Those legs hold 4 of the 6 risk points.
- Of the 534 trips a day in the window, those two legs account for about 178 (≈89 each).
  That's the volume to reschedule.

**2. Geofence the six risk points in Geotab (Geotab MCP `Add` writes)**
- Six `Zone`s named `Flood risk · <place>`, each drawn from its risk cell's hexagon
  boundary (`H3_BOUNDARY` on `shared.geotab_vegas8_route_flood_risk`).
- An *entering zone* `Rule` with a notification to dispatch. During monsoon afternoons,
  every entry gets flagged.
- `demo_fh_vegas8` has 0 zones today. Clean up with `Remove` after the demo.

**3. Warning trigger (the runbook's step 5, automated)**
- Every 5 minutes from July through September, import active NWS alerts for Nevada
  (`api.weather.gov/alerts/active?area=NV`). When a flash flood warning intersects
  `shared.geotab_vegas8_routes`:
  - Message every vehicle inside the polygon or within 1 km (from `DeviceStatusInfo`).
  - Send vehicles that are already out to **high ground**: hold at the Summerlin or
    north-west stop, never downtown or south of the airport.
  - Pause dispatch on any leg whose risk point is inside the polygon.
  - Tell affected customers (CARTO point-in-polygon on the customer table).
- The 11 Oct rehearsal shows what's at stake: **146 trips** ended inside warning #53 in 99
  minutes.

**4. Driver briefing (one page, before July)**
- The six points with photos, "turn around, don't drown" at washes and underpasses, and the
  Tropicana Wash and Commerce & Charleston history.

**5. Review after each storm (Geotab + CARTO, about 10 minutes)**
- Rerun runbook steps 1–2 for the day: trips inside the warning, exceptions, and whether
  anyone entered a flood zone. Add any new NWS flood reports to the score.

**6. Upgrade path**
- Fathom pluvial risk (premium) replaces the elevation proxy.
- Weather Source hourly history (premium) gives actual rainfall per trip.
- FEMA flood zones and Clark County flood-channel layers, imported for free, sharpen the six
  points into exact crossings.

## How to run the demo (about 8 minutes)

1. *"Where does my fleet actually drive?"* Geotab GPS traces appear as the route lines on
   the map.
2. *"Has it flooded there before?"* 10 years of NWS warnings plus 133 flood reports. Show
   the Tropicana Wash and Commerce & Charleston remarks.
3. *"When?"* July–September, noon–6 pm, and 534 of our trips a day fall in that window.
4. *"Where exactly?"* The six risk points, high ground versus low ground.
5. *"Make me a plan."* The plan above, then offer to create the six Geotab zones and the
   rule live.

## Reproduce

The three CARTO tables are created by the calls in this session. The SQL for the leg
statistics, the seasonality breakdown and the cell scoring is in
[`flood-plan.sql`](flood-plan.sql).
