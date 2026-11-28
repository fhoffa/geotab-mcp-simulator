# Standalone Altitude API conversation

Direct entry: `/#altitude` (for GitHub Pages, append `#altitude` to the repository's site URL). This graph is intentionally not linked from the main simulator's dialogs or scenario picker. It is unlisted, not private: every asset is public.

This is a separate, prerecorded API lesson, **not an MCP connector or a live AI service**. All traffic/weather values, directions, lengths and returned identifiers are independently fictional. The named streets and approximate search coordinates are public location context; the demo makes no findings about them. Never enter credentials here.

## What it teaches

Define a bounded question → resolve and inspect road segments → run separate dated hourly jobs → retrieve modeled weather separately → compare matched hours locally → distinguish speed, section time and above-limit measures → investigate uncertainty → leave a follow-up question open.

- Geographical job: `POST /api/v2/zones/segments`; inspect `properties.code` versus the encoded `properties.id`.
- Traffic job: `POST /api/v2/traffic/speed-trend`, one segment per job with `aggregationUnit:"hour"`. Pooled hour-of-day profiles are not dated weather observations.
- Poll `GET /api/v2/jobs/{id}` until complete, then retrieve the result URL. Follow result pagination, including the `Link` header with `rel="next"`.
- Payloads, tool-result excerpts and opaque identifiers are examples, not executable requests with real IDs. New jobs and purchased-data coverage require authorized Altitude API access outside the simulator.
- Road search radius is miles (`isMetric:false`); traffic speeds are mph and crossing times seconds. Direction is relative to returned geometry, not inferred from the sign of an ID.
- Synthetic traffic hours are declared local hour-starts. This is **not a verified traffic API clock contract**: confirm the actual contract before interpreting real weather comparisons. Open-Meteo rain is a preceding-hour sum; traffic hour T joins weather T+1, with T and T−1 covering the previous two hours. A ±1h sensitivity check does not validate UTC versus local time.
- Dry controls use the same section, direction, weekday and clock hour, nearby dates, no rain in the current/prior two hours, and exclude the fixture's holiday. Hourly metrics are averaged with equal weight across matched rainy hours, not pooled across individual trips. An average of hourly p85 values is not a pooled-trip percentile.
- The harsh-events/last-mile question is not answered. Vehicle classification, event definitions and driving exposure would need a separate feasibility check.

## Public mechanic references

- [Start road-segment jobs](https://altitudehelp.geotab.com/api-guide/zones/createroadsegmentsjob)
- [Read road-segment results](https://altitudehelp.geotab.com/api-guide/zones/getroadsegments)
- [Start dated speed-trend jobs](https://altitudehelp.geotab.com/api-guide/traffic/createspeedtrendjob)
- [Read speed-trend results](https://altitudehelp.geotab.com/api-guide/traffic/getspeedtrend)
- [Open-Meteo historical weather](https://open-meteo.com/en/docs/historical-weather-api)

## Locator and weather visuals

`assets/map-sf-altitude.webp` is a static Produced Work drawn for this simulator from public [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright) data, available under [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/). It is **not** an OSM/CARTO raster-tile download. Streets, park/water polygons and coastline came from a bounded, read-only [Overpass](https://overpass-api.de/) geometry extract (OSM base `2026-11-25T20:42:08Z`); styling, sparse labels and WebP rendering were authored locally. No service is contacted when viewing the map. Visible attribution and a copyright link accompany it in every locale.

The fixed extent is west/east `-122.523/-122.403`, south/north `37.711/37.785`; Web Mercator (EPSG:3857), normalized into a `1024 × 800` image. Markers are calculated from the existing public road-search coordinates using longitude horizontally and `ln(tan(π/4 + latitude·π/360))` vertically. The approximate 2 km scale uses ground width at the extent's center latitude (Earth radius 6,378,137 m). Markers are proposed search locations only, not vehicles, API-selected section boundaries or directional geometry. All returned selections and traffic/weather examples remain fictional.

To reproduce the public source extract, submit this query to Overpass (the date pins the source state; original retrieval used that current OSM base). Keep OpenStreetMap attribution and the ODbL notice when reusing its data or the rendered map:

```text
[out:json][timeout:45][date:"2026-11-25T20:42:08Z"];
(
  way[highway~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified)(_link)?$"](37.711,-122.523,37.785,-122.403);
  way[leisure=park](37.711,-122.523,37.785,-122.403);
  way[natural~"^(water|coastline)$"](37.711,-122.523,37.785,-122.403);
);
out geom;
```

The weather panel uses two aligned rows for the rainy and matched-dry Wednesdays. The final 08:00–09:00 cells are the matched traffic observations; the two earlier dry cells are guard intervals only, not extra matches. It explains in plain language that traffic labels start their intervals while modeled preceding-hour weather totals end them, without plotting rainfall magnitude. The hourly-results step expands one representative Mission request/poll/result lifecycle, explains that the same bounded request runs separately for the other three sections, and renders one readable response-row card from the same fixture. The speed cards use a shared 0–60 mph scale, the above-limit card uses 0–100%, and the slower-crossing step uses a shared seconds axis for mean time and the average hourly p85 marker. These remain declared example assumptions, not verification of an Altitude clock contract or journey-level distributions.

## Routing and maintenance

`?n=` takes precedence over the hash, as in the main app. `?n=hub#altitude` is therefore still the main simulator. Use a clean base URL with `#altitude`. All Altitude node IDs have the `altitude` prefix. Subsequent Altitude choices write hash links, remove `n` and retain an explicit `lang`; main simulator query routing is unchanged. Hash-only steps do not intentionally trigger the main app's per-node query-pageview convention. Cross-mode Back/Forward or hash navigation reloads into the correct graph; this mode has its own restart and deep-link context.

The main graph, its locales and its map stay separate. English source is `window.ALTITUDE_CONVERSATIONS`; numbers are `SAMPLE_DATA.altitude`; Spanish display overlays are namespaced under each locale's `.altitude`. Core UI locales load first, then Altitude English, Latin American Spanish and optional Spain overrides.

Run `node scripts/check-graph.js` to validate **both** graphs, locales and the Altitude fixture contracts. After Altitude edits, run `node scripts/check-graph.js --altitude --fix-map` and `node scripts/check-graph.js --stamp-i18n`. Plain `--fix-map` continues to update only the main map, so the unchanged CI fails if this committed map is stale.

## Nodes (10)

| id | title | database | leads to |
|---|---|---|---|
| `altitude` | An Altitude conversation, not MCP | — | `altitude-scope` |
| `altitude-scope` | Define the places and comparison | — | `altitude-segments` |
| `altitude-segments` | Resolve the road segments | — | `altitude-hours` |
| `altitude-hours` | Ask for dated hours, not a typical hour | — | `altitude-weather` |
| `altitude-weather` | Weather is a separate source | — | `altitude-compare` |
| `altitude-compare` | Compare the same rainy hours | — | `altitude-behavior`, `altitude-tail` |
| `altitude-behavior` | Progress and above-limit driving are different | — | `altitude-tail`, `altitude-limits` |
| `altitude-tail` | Look beyond the average | — | `altitude-limits` |
| `altitude-limits` | What would make this defensible? | — | `altitude-next` |
| `altitude-next` | Leave the next question open | — | restart |
