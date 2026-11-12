# Flood demo — Geotab MCP + CARTO MCP

A live-demo runbook: one assistant with **Geotab** (`demo_fh_vegas8`) and **CARTO**
(`carto_dw`) connected, telling a story a fleet manager actually lives through.
It covers what happened in this year's floods, who was on the road, which stops are
exposed, and how to be ready for the next storm.

> Status (11 Nov 2026): every number below is REAL. The Geotab numbers were pulled live
> from `demo_fh_vegas8`. The CARTO numbers come from live queries on `carto_dw`, including
> the NWS warning polygons imported for steps 2 and 5. Saved CARTO map: *Vegas fleet vs
> 2026 flash flood warnings* (Builder id `c3a5c57d-7ce8-4824-a491-8a3a509e7462`, private
> to the org).

> Next level: the 10-year analysis and readiness plan are in [FLOOD-PLAN.md](FLOOD-PLAN.md).

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

The warning polygons are imported into `carto_dw` (real, 11 Nov 2026). CARTO `import_data`
fetched the Iowa Environmental Mesonet storm-based warning archive for NWS Las Vegas
(office `VEF`, 1 Aug – 1 Nov 2026) server-side:
```
import_data submit {connection:"carto_dw",
  url:"https://mesonet.agron.iastate.edu/api/1/vtec/sbw_interval.geojson?begints=2026-08-01T00:00Z&endts=2026-11-01T00:00Z&wfo=VEF",
  destination:"carto-dw-ac-yh2g23ii.shared.nws_vef_warnings_2026_aug_oct"}
```
That gave 199 polygons: 48 flash flood warnings (`FF.W`), 81 flood advisories, 3 flood
warnings and 67 severe thunderstorm warnings. The VEF office covers southern Nevada plus
parts of Arizona, Utah and California, so most of the polygons are nowhere near the fleet.
The archive keeps each warning's **issued** polygon (`status = NEW`). `utc_polygon_end` is
when that polygon was replaced or ended, and later updates aren't included.

Point-in-polygon of the six stops against every `FF.W` this season:
```sql
WITH stops AS (SELECT * FROM UNNEST([
  STRUCT('west of Strip' AS stop, ST_GEOGPOINT(-115.1840, 36.0922) AS g),
  ('downtown', ST_GEOGPOINT(-115.1584, 36.1659)), ('south of airport', ST_GEOGPOINT(-115.1456, 36.0597)),
  ('Summerlin', ST_GEOGPOINT(-115.3125, 36.1452)), ('north valley', ST_GEOGPOINT(-115.2091, 36.2726)),
  ('north-west', ST_GEOGPOINT(-115.2867, 36.2912))]))
SELECT w.eventid, w.utc_polygon_begin, w.utc_polygon_end, ARRAY_AGG(s.stop) AS stops_inside
FROM `carto-dw-ac-yh2g23ii.shared.nws_vef_warnings_2026_aug_oct` w
JOIN stops s ON ST_CONTAINS(w.geom, s.g)
WHERE w.phenomena = 'FF' AND w.significance = 'W'
GROUP BY 1, 2, 3 ORDER BY 2
```
**Captured (real):** only two of the 48 warnings ever covered a fleet stop.

| Warning | Polygon active (PT) | Area | Stops inside | Trips that ended inside it (Geotab) |
|---|---|---|---|---|
| **FFW #53**, 11 Oct (Rachel) | 5:33–7:12 am | 1,379 km² | **all six** | **146**: downtown 24, south of airport 24, west of Strip 25, north valley 24, north-west 25, Summerlin 24 |
| **FFW #62**, 30 Oct | 12:55–2:13 pm (warning expired 3:38 pm) | 297 km² | **downtown** only (west of Strip was 0.7 km outside) | **19**, each by a different vehicle (Demo - 09 … Demo - 27) |

The other two 30 Oct warnings missed the fleet. #61 (12:43–1:58 pm) came within 11.8 km of
the south-of-airport stop, and #63 (2:53–4:06 pm) was more than 90 km away.

Talking point: *"Of 48 flash flood warnings this season, two touched our stops. One covered
the whole valley during Rachel's morning, and we ended 146 trips inside it. The other was a
297 km² box over downtown, and 19 different vans pulled in there while it was active. That's
the list I'd want on my desk the next morning."*

This also corrects step 1. The 12:55–4:00 pm window there was the combined span of all the
warnings that day. The polygon that actually touched the fleet was #62, from 12:55 to 2:13 pm.

**Map:** the saved CARTO Builder map *Vegas fleet vs 2026 flash flood warnings* shows
warnings #53, #61 and #62 (red) and the six stops (blue, with elevation and the trip counts
above in the popup data). To open it, use the Builder URL template from `get_workspace_info`
with the id in the status note. In Builder, toggle the warnings by day to tell the
two-storm story.

### 3 · "Which of my stops and hubs sit in flood-prone ground, not just in this storm?"

CARTO: join the stops and the five hubs in `SAMPLE_DATA.carto.hubs` against a terrain or
flood-hazard layer. See "CARTO datasets that help" below for what this account can use.

**Captured (real, 11 Nov 2026):** CARTO Spatial Features (public, H3 res 8). The stop's
cell elevation, the lowest and highest cell within 3 rings (~2.5 km), and the WorldClim
average rainfall for Oct:

| Stop | Elevation | Low–high within ~2.5 km | Avg Oct rain |
|---|---|---|---|
| downtown | **623 m** | 595–657 m | 6 mm |
| south of airport | 648 m | 613–687 m | 6 mm |
| west of Strip | 668 m | 630–704 m | 6 mm |
| north valley | 697 m | 663–713 m | 6 mm |
| north-west | 780 m | 723–863 m | 6 mm |
| Summerlin | **874 m** | 804–928 m | 7 mm |

Talking point: *"Our stops drop 250 m from Summerlin to downtown, and water runs the same
way. The two lowest stops are downtown and south of the airport. The demo fleet visits
those stops more than 90 times in a 3-hour window. In an average October, Las Vegas gets
about 6 mm of rain all month. On 11 Oct it got 27 mm (1.08 in.) in a single day."*
Elevation is a proxy for exposure, not a flood map. Say so, then show the Fathom/FEMA
upgrade path.

NASADEM (≈100 m cells) gives a sharper picture: downtown's 121 surrounding cells range
from 614 to 629 m. But that one query scanned about 10 GB, so pre-compute it before the
demo.

## CARTO datasets that help

Checked live on `carto_dw` on 11 Nov 2026. The org has **no Data Observatory
subscriptions**, and no flood table exists in the connection. The public tables below can
already be queried directly.

**Free, usable today**
| Dataset | Table | Use in the demo |
|---|---|---|
| CARTO Spatial Features, USA (H3 res 8; also quadgrid 15/18) | `carto-do-public-data.carto.derived_spatialfeatures_usa_h3res8_v1_yearly_v4` | `elevation`, monthly `prec_*` (WorldClim normals), plus `population`/POIs for "who's affected". This is the proxy above |
| NASADEM, USA and Spain (quadgrid 18, ≈100 m) | `carto-do-public-data.nasa.environmental_nasadem_{usa,esp}_quadgrid18_v1_static_v1` | Fine-grained terrain: find the low spots and sinks around each stop. Large scans, so filter by quadbin |
| Avg precipitation 2000–2023 (raster, global) | `carto-demo-data.demo_rasters.avg_precipitation_june2000_to_may2023` | Too coarse for the city (~20 km pixels). Only good for a world/region intro slide |
| Kontur Population / ACS (already used in the CARTO path) | — | Count the residents and customers inside an exposed area |

**Premium (needs a commercial arrangement; can't be subscribed from the MCP)**
| Dataset | Why it's the real answer |
|---|---|
| **Fathom Flood Risk Scores** (USA, Spain + ~140 countries, H3 res 11 ≈ 25 m) | `risk_category` 0–100 by `type_of_flood`, including **PLUV (pluvial)**, the flash-flood type Las Vegas gets, plus climate scenarios to 2050+. Best single layer for both fleets |
| **Weather Source Historic Weather, hourly** (USA, 5 km grid, 2000–present) | Actual rainfall per hour, so you can line the 30 Oct and 11 Oct storms up with each trip. Also a 15-day **forecast** table for the "next storm" step |
| **Regrid Parcels** (USA) | A `fema_flood_zone` field per parcel (FEMA flood insurance map zones) for depots and customer sites |
| **AGS Climate and Weather Risk** (USA, block / H3 res 7) | Hazard indices (storm surge etc.). Less relevant inland |
| **Gloval Environmental Risks** (Spain, census section) | `river_flood_risk` at 10/50/100/500-year return periods. The Valencia DANA story |

**Free, but you load it yourself** (`import_data` from a URL into `carto_dw`): the FEMA
National Flood Hazard Layer for Clark County, the Clark County Regional Flood Control
District channels, the NWS warning polygons, and Spain's official flood-zone maps (SNCZI)
for Valencia.

Suggested pitch: **free terrain now, Fathom pluvial risk when it's for real.** Run the
Spatial Features query live. Then show the Fathom sample (`search_data_observatory` →
`sample` on `fathom_floodrisk_1418445b`) as the production version of the same question.

### 4 · "Set it up so I hear about it next time"

Geotab writes (the simulator's zone/rule lifecycle episode already shows the pattern):
- `Add typeName=Zone`: one zone per flood-prone stop or hub from step 3 (polygon points
  from the CARTO result), with a name like `Flood risk · downtown`.
- `Add typeName=Rule`: an *entering zone* rule on those zones, with a notification.
- Clean up after the demo with `Remove` (today `demo_fh_vegas8` has **0 zones**, so you'll
  start from a clean slate).

Before running a write on stage, confirm that the demo account allows writes.

### 5 · "When the next warning drops, who do I call?"

The playbook as one prompt: *"There's a flash flood warning, here's the polygon. Which
vehicles are inside it or heading in, and which customers will we miss?"*

**Rehearsed live on 11 Nov 2026 at 22:53 UTC**, replaying warning #62 as if it had just been
issued:
1. Geotab `Get typeName=DeviceStatusInfo` (propertySelector `device, latitude, longitude,
   speed, isDriving, dateTime`) returned all 50 vehicles' live positions.
2. CARTO `execute_query` ran the positions and the customer list against the warning
   polygon in `carto-dw-ac-yh2g23ii.shared.nws_vef_warnings_2026_aug_oct`. The exact SQL is
   in [`docs/flood-playbook.sql`](flood-playbook.sql).

**Captured (real calls; the customers are the illustrative ones from
`SAMPLE_DATA.carto.customers`):**
- **8 vehicles inside the polygon now:** Demo - 21 (driving, 109 km/h), Demo - 22 and
  Demo - 27 (arriving downtown), and Demo - 23, 24, 25, 26 and 28 (parked downtown).
- **6 vehicles within 1 km of it:** Demo - 29 (driving, 76 km/h, 0.54 km out), and
  Demo - 07 to 11 at the west-of-Strip stop (0.68 km out).
- **3 customers inside it:** Fourth Street Coffee Roasters (58 orders), Sahara Office
  Interiors (62) and Boulder Highway Auto Parts (74).

Talking point: *"That's the call sheet. Eight drivers to message now, six to reroute, and
three customers to warn that today's delivery may slip."*

During the demo, switch the polygon source to the live feed: import `https://api.weather.gov/alerts/active?area=NV`
with `import_data` (it returns GeoJSON polygons for active alerts) and filter on
`event = 'Flash Flood Warning'`. Outside monsoon season it will most likely be empty, so keep
the #62 replay as the fallback. Optional next step: `calculate_isolines` (15 min) from each
hub with the warned area subtracted, to show which customers can still be served. Close by
packaging it as a skill *for your own fleet* (see AGENTS.md: a worked example, not something
to install).

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
