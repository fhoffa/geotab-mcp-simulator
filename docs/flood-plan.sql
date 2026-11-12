-- Flood readiness plan: the CARTO queries behind docs/FLOOD-PLAN.md (BigQuery, carto_dw).
-- Tables (created 12 Nov 2026):
--   shared.nws_vef_warnings_2016_2026      import_data <- https://mesonet.agron.iastate.edu/api/1/vtec/sbw_interval.geojson?begints=2016-01-01T00:00Z&endts=2026-11-01T00:00Z&wfo=VEF
--   shared.nws_vef_storm_reports_2016_2026 import_data <- https://mesonet.agron.iastate.edu/geojson/lsr.geojson?sts=2016-01-01T00:00Z&ets=2026-11-01T00:00Z&wfos=VEF
--   shared.geotab_vegas8_routes            6 LINESTRINGs built from Geotab LogRecord (Demo - 02, 30 Oct 2026 19:40-22:55 UTC)
--   shared.geotab_vegas8_route_flood_risk  the scoring query below, materialised

-- 1. Flash flood warnings per leg, 10 years
WITH w AS (
  SELECT CONCAT(EXTRACT(YEAR FROM utc_issue),'-',eventid) ev, utc_polygon_begin b, utc_polygon_end e, geom
  FROM `carto-dw-ac-yh2g23ii.shared.nws_vef_warnings_2016_2026` WHERE phenomena='FF' AND significance='W')
SELECT r.leg, r.km, COUNT(DISTINCT w.ev) ffw_events_10y,
  ROUND(SUM(TIMESTAMP_DIFF(w.e, w.b, MINUTE))/60,1) warned_hours_10y,
  ROUND(AVG(SAFE_DIVIDE(ST_LENGTH(ST_INTERSECTION(w.geom, r.geom)), ST_LENGTH(r.geom)))*100) avg_pct_of_leg_covered
FROM `carto-dw-ac-yh2g23ii.shared.geotab_vegas8_routes` r JOIN w ON ST_INTERSECTS(w.geom, r.geom)
GROUP BY 1,2 ORDER BY 3 DESC;

-- 2. When: month / 3-hour block (local) of warnings that touch any route
WITH routes AS (SELECT ST_UNION_AGG(geom) g FROM `carto-dw-ac-yh2g23ii.shared.geotab_vegas8_routes`),
w AS (SELECT CONCAT(EXTRACT(YEAR FROM utc_issue),'-',eventid) ev, utc_polygon_begin b
  FROM `carto-dw-ac-yh2g23ii.shared.nws_vef_warnings_2016_2026`, routes
  WHERE phenomena='FF' AND significance='W' AND ST_INTERSECTS(geom, routes.g))
SELECT 'month' dim, FORMAT_TIMESTAMP('%m', b, 'America/Los_Angeles') k, COUNT(DISTINCT ev) n FROM w GROUP BY 2
UNION ALL
SELECT 'hour', FORMAT('%02d', DIV(EXTRACT(HOUR FROM b AT TIME ZONE 'America/Los_Angeles'),3)*3), COUNT(DISTINCT ev) FROM w GROUP BY 2
ORDER BY 1,2;

-- 3. Flood reports within 500 m of a route
WITH f AS (SELECT * FROM `carto-dw-ac-yh2g23ii.shared.nws_vef_storm_reports_2016_2026`
  WHERE typetext IN ('FLASH FLOOD','FLOOD') AND lon BETWEEN -115.40 AND -114.95 AND lat BETWEEN 35.95 AND 36.35)
SELECT r.leg, ROUND(ST_DISTANCE(f.geom, r.geom)) m_from_route,
  FORMAT_TIMESTAMP('%Y-%m-%d %H:%M', f.valid, 'America/Los_Angeles') local_time, f.typetext, f.city, f.remark
FROM f JOIN `carto-dw-ac-yh2g23ii.shared.geotab_vegas8_routes` r ON ST_DWITHIN(f.geom, r.geom, 500)
QUALIFY ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY ST_DISTANCE(f.geom, r.geom)) = 1
ORDER BY f.valid;

-- 4. Risk score per route cell (H3 res 8)
CREATE OR REPLACE TABLE `carto-dw-ac-yh2g23ii.shared.geotab_vegas8_route_flood_risk` AS
WITH cells AS (SELECT `carto-un`.carto.H3_TOPARENT(c, 8) h3, ANY_VALUE(leg) leg
  FROM `carto-dw-ac-yh2g23ii.shared.geotab_vegas8_routes`, UNNEST(`carto-un`.carto.H3_POLYFILL(ST_BUFFER(geom, 40), 10)) c GROUP BY 1),
sf AS (SELECT geoid, elevation FROM `carto-do-public-data.carto.derived_spatialfeatures_usa_h3res8_v1_yearly_v4`
  WHERE geoid IN (SELECT k FROM cells, UNNEST(`carto-un`.carto.H3_KRING(h3,2)) k)),
w AS (SELECT CONCAT(EXTRACT(YEAR FROM utc_issue),'-',eventid) ev, geom FROM `carto-dw-ac-yh2g23ii.shared.nws_vef_warnings_2016_2026`
  WHERE phenomena='FF' AND significance='W'),
f AS (SELECT geom FROM `carto-dw-ac-yh2g23ii.shared.nws_vef_storm_reports_2016_2026`
  WHERE typetext IN ('FLASH FLOOD','FLOOD') AND lon BETWEEN -115.40 AND -114.95 AND lat BETWEEN 35.95 AND 36.35),
base AS (SELECT c.h3, c.leg, `carto-un`.carto.H3_CENTER(c.h3) ctr, s.elevation elev,
  s.elevation - (SELECT AVG(n.elevation) FROM UNNEST(`carto-un`.carto.H3_KRING(c.h3,2)) k JOIN sf n ON n.geoid=k) rel_elev
  FROM cells c LEFT JOIN sf s ON s.geoid=c.h3),
scored AS (SELECT b.h3, b.leg, ROUND(b.elev) elev, ROUND(b.rel_elev,1) rel_elev,
  (SELECT COUNT(DISTINCT ev) FROM w WHERE ST_INTERSECTS(w.geom, b.ctr)) ffw_10y,
  (SELECT COUNT(*) FROM f WHERE ST_DWITHIN(f.geom, b.ctr, 750)) flood_reports_750m FROM base b)
SELECT *, ROUND(ffw_10y/35*40 + LEAST(flood_reports_750m,3)*15 + GREATEST(0, -rel_elev)*1.5, 1) risk_score FROM scored;
