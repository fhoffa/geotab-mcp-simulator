# Flood demo — Geotab MCP + CARTO MCP

A live-demo runbook: one assistant with **Geotab** (`demo_fh_vegas8`) and **CARTO**
(`carto_dw`) connected, telling a story a fleet manager actually lives through.
It covers what happened in this year's floods, who was on the road, which stops are
exposed, and how to be ready for the next storm.

> Status (11 Nov 2026): the **Geotab** numbers below are REAL, pulled live from
> `demo_fh_vegas8` today. The **CARTO** steps are written but **not yet run**: the
> CARTO MCP wasn't connected in the prep session. Run them once before going on stage
> and paste the real results into the "Captured" lines.

## The real events (2026)

| Date (local) | Area | What happened |
|---|---|---|
| 13 Aug | Southern Las Vegas valley | NWS flood advisory upgraded to a **flash flood warning** |
| 11–12 Oct | Las Vegas | Remnants of **Rachel**: 1.08 in. at the airport (record for 11 Oct, ties the wettest October day since 1947). Washes overflowed, roads near the Strip and the LINQ garage flooded, 10+ water rescues |
| 17–19 Oct | Valencia / Alicante (Spain) | **DANA "Adam"**: AEMET forecast 200–300 mm in 12 h on the south Valencia coast; restrictions in 145 municipalities |
| 30 Oct | Las Vegas | **Flash flood warnings, 12:55–4:00 pm PDT** (19:55–23:00 UTC), naming the Strip and Fremont Street; up to 1.75 in. had already fallen by 1:58 pm |

Before you quote them on stage, check the times against the NWS Las Vegas archive.
The 30 Oct times come from a site that reposts NWS alerts.

## The story in five prompts

### 1 · "Who was on the road during the 30 Oct flash flood warning?"

Geotab calls (real):
```
Get typeName=Trip search={"fromDate":"2026-10-30T19:55:00Z","toDate":"2026-10-30T23:00:00Z"}
    propertySelector={"fields":["device","stop","distance","stopPoint","maximumSpeed"]} resultsLimit=1500
Get typeName=ExceptionEvent search={same window} propertySelector={"fields":["rule","device","activeFrom"]}
```
**Captured (real):** **275 trips** ended inside the warning window, and **all 50 vehicles**
drove. Every trip ended at one of **6 recurring stops**. **785 exceptions** fired in the
same 3 hours: 597 *GPS speeding window*, 138 *Posted speeding*, and 50 *Max Speed* (custom
rule, one per vehicle).

| Stop (lon, lat) | Area | Trips in window | Trip km | Max speed | km to the LINQ / to Fremont St |
|---|---|---|---|---|---|
| −115.1840, 36.0922 | just west of the Strip | 46 | 8.0 | 79 km/h | **3.1** / 9.5 |
| −115.1584, 36.1659 | downtown | 46 | 14.5 | 88 km/h | 5.5 / **1.5** |
| −115.1456, 36.0597 | south of the airport | 46 | 16.9 | 122 km/h | 6.8 / 12.3 |
| −115.3125, 36.1452 | Summerlin (west) | 46 | 27.8 | 123 km/h | 13.1 / 15.5 |
| −115.2091, 36.2726 | north valley | 46 | 9.4 | 112 km/h | 17.6 / 12.8 |
| −115.2867, 36.2912 | north-west | 45 | 23.2 | 127 km/h | 21.9 / 18.6 |

Talking point: *"Nothing in the telematics knew it was raining. The fleet kept its normal
pace, highway speeds included, straight through a warning that named two places it was
stopping near. Geotab tells you where the fleet was. The flood is a different dataset, and
that's where CARTO comes in."*

Be honest about this: the demo database replays the same six loops all day (same distance
per loop, vehicles staggered about 4 minutes apart). On 11 Oct, the Rachel morning, it looks
exactly the same. Present that as the point ("the fleet didn't react") and don't claim
drivers made choices.

### 2 · "Which of those stops were inside the warned area?"

CARTO: a point-in-polygon test of the six stops against the warning polygon.
- Get the polygon for the 30 Oct warnings (NWS storm-based warnings, VTEC office LAS) from
  the Iowa Environmental Mesonet warning archive, and load it as a table on `carto_dw`.
  Alternatively, paste the GeoJSON into the query.
- Query (adjust the table name and SQL dialect to your warehouse):
```sql
WITH stops AS (
  SELECT * FROM UNNEST([
    STRUCT('west of Strip' AS stop, ST_GEOGPOINT(-115.1840, 36.0922) AS geom, 46 AS trips),
    ('downtown',        ST_GEOGPOINT(-115.1584, 36.1659), 46),
    ('south of airport',ST_GEOGPOINT(-115.1456, 36.0597), 46),
    ('Summerlin',       ST_GEOGPOINT(-115.3125, 36.1452), 46),
    ('north valley',    ST_GEOGPOINT(-115.2091, 36.2726), 46),
    ('north-west',      ST_GEOGPOINT(-115.2867, 36.2912), 45)])
)
SELECT s.stop, s.trips, ST_CONTAINS(w.geom, s.geom) AS inside_warning
FROM stops s CROSS JOIN `<your_table>.nws_ffw_2026_10_30` w;
```
**Captured:** _(run before the demo)_. Then render a map: the warning polygon plus the six
stops sized by trips (`validate_map` → `create_map`, as in the existing CARTO path).

### 3 · "Which of my stops and hubs sit in flood-prone ground, not just in this storm?"

CARTO: join the stops and the five hubs in `SAMPLE_DATA.carto.hubs` against a flood-hazard
layer. In order of preference:
1. **FEMA National Flood Hazard Layer** (zones A/AE = 1% annual chance) for Clark County.
   This is the standard answer.
2. **Clark County Regional Flood Control District** channels and detention basins: buffer the
   channels by 250 m and count the stops inside the buffer.
3. A proxy you already have, if 1 and 2 aren't loaded: *low-lying cells*. Use H3 res 8
   elevation relative to the neighbouring rings, if your Spatial Features subscription has
   an elevation variable.

Check which of these actually exist on `carto_dw` first (the CARTO discovery tools /
Data Observatory search) and say on stage which one you used.
**Captured:** _(run before the demo)_.

### 4 · "Set it up so I hear about it next time"

Geotab writes (the simulator's zone/rule lifecycle episode already shows the pattern):
- `Add typeName=Zone`: one zone per flood-prone stop or hub from step 3 (polygon points
  from the CARTO result), with a name like `Flood risk · downtown`.
- `Add typeName=Rule`: an *entering zone* rule on those zones, with a notification.
- Clean up after the demo with `Remove` (today `demo_fh_vegas8` has **0 zones**, so you'll
  start from a clean slate).

Before running a write on stage, confirm that the demo account allows writes.

### 5 · "When the next warning drops, who do I call?"

The playbook, as one prompt: *"There's a flash flood warning, here's the polygon. Which
vehicles are inside it or heading in, and which customers will we miss?"*
- Geotab `Get typeName=DeviceStatusInfo` gives every vehicle's live position, speed and
  `isDriving`.
- CARTO: point-in-polygon against the active warning (api.weather.gov `/alerts/active?area=NV`
  returns GeoJSON polygons), then `calculate_isolines` (15 min) from each hub, with the
  warned area subtracted, to show which customers in `SAMPLE_DATA.carto.customers` can
  still be reached.
- Close by turning it into a skill *for your own fleet* (per AGENTS.md: a worked example,
  not something to install).

## The Spain angle (DANA "Adam", 17–19 Oct)

The Spain demo fleet (Galicia + Valencia coaches and trucks) would be the stronger flood
story. However, `demo_fh4` returned **"Database not found on my.geotab.com"** on 11 Nov.
Get the current database name or server before using it. Once it's found, rerun step 1
for 17–19 Oct around Valencia. The 2024 DANA flood mapping from the University of Valencia
and Spain's official flood-zone maps (SNCZI) are the hazard layers for step 3.

## Sources

- KTNV, *Southern Nevada under flash flood warning* (13 Aug): https://www.ktnv.com/news/southern-nevada-under-flash-flood-warning-on-thursday-nws-shares
- FOX5, *Tropical moisture from Rachel brings wettest day in a year*: https://www.fox5vegas.com/2026/10/11/first-alert-tropical-moisture-rachel-brings-wettest-day-year-las-vegas/
- FOX5, *Post-tropical cyclone Rachel floods roads near the Strip*: https://www.fox5vegas.com/2026/10/12/post-tropical-cyclone-rachel-floods-roads-near-strip/
- News3LV, *Flash flooding sends water rushing through streets near Las Vegas strip*: https://news3lv.com/news/local/flash-flooding-sends-water-rushing-through-streets-near-las-vegas-strip-rain-storms-hurricane-tropical-storm-rachel-linq-promenade
- ITV, *More storms forecast in Southwest after record rain in Las Vegas*: https://www.itv.com/news/2026-10-12/more-storms-forecast-in-southwest-after-record-rain-in-las-vegas
- NWS warning repost, 30 Oct 12:55 pm: https://www.defconlevel.com/alert/2026-10-30-nws-noaa-weather-flash-flood-warning-issued-october-30-at-12-55pm-pdt-until-october-30-at-4-00pm-pdt-by-nws-las-vegas-nv
- NWS warning repost, 30 Oct 1:58 pm: https://www.defconlevel.com/alert/2026-10-30-nws-noaa-weather-flash-flood-warning-issued-october-30-at-1-58pm-pdt-until-october-30-at-3-45pm-pdt-by-nws-las-vegas-nv
- Watchers, *DANA Adam flooding, eastern Spain* (20 Oct): https://watchers.news/2026/10/20/four-deaths-reported-as-dana-adam-flooding-prompts-more-than-1-000-rescues-in-eastern-spain/
- iAgua, *Primera cartografía precisa de las inundaciones de la DANA*: https://www.iagua.es/noticias/universidad-valencia/creada-primera-cartografia-precisa-inundaciones-provocadas-dana
