/*
 * sample-data.js — the explicit sample-data store ("the fleet of record").
 *
 * THIS FILE IS THE SINGLE SOURCE OF TRUTH for the numbers, drivers and findings
 * used by the Safety / Maintenance / Operations / Agentic scenarios in
 * conversations.js. Those nodes read their charts (and, where practical, their
 * tool results) from here via `window.SAMPLE_DATA`, so a number only has to
 * change in one place and every conversation that quotes it stays consistent.
 *
 * Grounding policy:
 *   - `facts` below are REAL — validated against the live Geotab demo databases
 *     (demo_fh_vegas4, demo_fh4) on 18-19 Jun 2026 and re-queried since: fleet
 *     sizes, vehicle mix, the fleet-wide speeding pattern, the 597-record
 *     Sprinter fault cluster, etc.
 *   - Everything else (drivers, safety scores, severity tiers, fuel/idle/$,
 *     downtime) is REALISTIC, FICTIONAL data, grounded on genuine Geotab
 *     capabilities a real customer would see (Driver ID, Safety Center
 *     scorecards, maintenance reminders, fault lamp severity, fuel/idle
 *     reports). The demo accounts are sparse; this store fills them out so the
 *     simulator shows the fully-instrumented experience.
 *   - Driver names are FICTIONAL. No real PII.
 *
 * To add a grounded scenario: add its data here, then have the node build its
 * chart/result from `window.SAMPLE_DATA` (see conversations.js → "Grounding on
 * the sample-data store").
 */
window.SAMPLE_DATA = {
  /* ---------------------------------------------- REAL, validated facts */
  facts: {
    groundedOn: "18-19 Jun 2026 (re-queried for the safety/ops scenarios)",
    fleets: {
      demo_fh_vegas4: {
        region: "Las Vegas, USA",
        vehicles: 50,
        mix: "35 Ford Transit 250 cargo vans + 15 Ford F-150 pickups",
        exceptions7d: 4811,        // real: GetCountOf ExceptionEvent, 7d
        speeding30d: 20653,        // real: RulePostedSpeedingId, 30d
      },
      demo_fh4: {
        region: "Spain (Galicia + Valencia)",
        vehicles: 50,
        mix: "30 intercity coaches + 15 heavy trucks/tractors + 5 Mercedes Sprinter vans",
        faults7d: 597,             // real: GetCountOf FaultData, 7d
        harshBraking30d: 289,      // real: RuleHarshBrakingId, 30d (demo accounts)
        faultCluster: "5 Sprinter vans (Demo - 06..10) own ~555 of 597 device faults",
      },
    },
  },

  /* ---------------------------------------------- driver roster (Driver ID) */
  /* Fictional. vehicle = the device they're assigned to this week. */
  drivers: {
    demo_fh_vegas4: [
      { name: "Marcus Bell",   vehicle: "Demo - 08" },
      { name: "Priya Nair",    vehicle: "Demo - 01" },
      { name: "Tina Alvarez",  vehicle: "Demo - 22" },
      { name: "Sam Whitfield", vehicle: "Demo - 33" },
      { name: "Devon Carter",  vehicle: "Demo - 15" },
      { name: "Luis Romero",   vehicle: "Demo - 04" },
      { name: "Grace Kim",     vehicle: "Demo - 10" },
      { name: "Andre Foster",  vehicle: "Demo - 25" },
      { name: "Ben Ortiz",     vehicle: "Demo - 16" },
      { name: "Chloe Tran",    vehicle: "Demo - 20" },
      { name: "Hannah Brooks", vehicle: "Demo - 17" },
      { name: "Eddie Vance",   vehicle: "Demo - 29" },
      { name: "Rosa Mendez",   vehicle: "Demo - 41" },
      { name: "Will Dawson",   vehicle: "Demo - 05" },
    ],
    demo_fh4: [
      { name: "Iker Sáez",    vehicle: "Demo - 02", type: "MAN coach" },
      { name: "Pau Serra",    vehicle: "Demo - 12", type: "Actros truck" },
      { name: "Marta Ferrer", vehicle: "Demo - 14", type: "Actros truck" },
      { name: "Bruno Gil",    vehicle: "Demo - 19", type: "Actros truck" },
      { name: "Núria Pons",   vehicle: "Demo - 25", type: "MAN coach" },
      { name: "Lucía Mena",   vehicle: "Demo - 28", type: "MAN coach" },
      { name: "Roberto Vila", vehicle: "Demo - 31", type: "MAN coach" },
      { name: "Aitor Vidal",  vehicle: "Demo - 41", type: "Renault T tractor" },
    ],
  },

  /* ============================================== VEGAS · safety & ops ===== */
  vegas: {
    /* Driver Safety Scorecard — weighted score 0-100 (higher = safer). */
    fleetSafetyScore: 78,
    benchmark: 82,
    trendWoW: "-6%",
    eventMixPct: { speeding: 90, harshBrake: 6, harshAccel: 3, seatbelt: 1 },
    safetyScorecard: [
      { rank: 1,  driver: "Marcus Bell",   vehicle: "Demo - 08", score: 47, events: 131, mix: "Speeding 109 · Harsh brake 14 · Seatbelt 8" },
      { rank: 2,  driver: "Tina Alvarez",  vehicle: "Demo - 22", score: 52, events: 119, mix: "Harsh accel 31 · Speeding 74 · Cornering 14" },
      { rank: 3,  driver: "Sam Whitfield", vehicle: "Demo - 33", score: 55, events: 102, mix: "Harsh brake 41 · Speeding 56 · Cornering 5" },
      { rank: 4,  driver: "Devon Carter",  vehicle: "Demo - 15", score: 58, events: 118, mix: "Speeding 107 · Harsh brake 9 · Seatbelt 2" },
      { rank: 5,  driver: "Priya Nair",    vehicle: "Demo - 01", score: 61, events: 121, mix: "Speeding 111 · Cornering 7 · Harsh brake 3" },
      { rank: 6,  driver: "Luis Romero",   vehicle: "Demo - 04", score: 63, events: 117, mix: "Speeding 110 · Harsh accel 5 · Seatbelt 2" },
      { rank: 7,  driver: "Grace Kim",     vehicle: "Demo - 10", score: 65, events: 116, mix: "Speeding 110 · Harsh brake 4 · Accel 2" },
      { rank: 8,  driver: "Andre Foster",  vehicle: "Demo - 25", score: 66, events: 110, mix: "Speeding 107 · Seatbelt 3" },
      { rank: 9,  driver: "Ben Ortiz",     vehicle: "Demo - 16", score: 67, events: 113, mix: "Speeding 107 · Harsh accel 6" },
      { rank: 10, driver: "Chloe Tran",    vehicle: "Demo - 20", score: 68, events: 109, mix: "Speeding 107 · Harsh brake 2" },
    ],

    /* Harsh braking by driver — last 30 days, graded by g-force severity. */
    harshBraking: {
      fleetTotal30d: 412,
      fleetTrendVsPrev30d: "-12%",
      byDriver: [
        { driver: "Sam Whitfield", vehicle: "Demo - 33", total: 58, severe: 9, moderate: 21, mild: 28, trend: "+22%" },
        { driver: "Tina Alvarez",  vehicle: "Demo - 22", total: 47, severe: 6, moderate: 18, mild: 23, trend: "+4%" },
        { driver: "Marcus Bell",   vehicle: "Demo - 08", total: 39, severe: 5, moderate: 14, mild: 20, trend: "-8%" },
        { driver: "Grace Kim",     vehicle: "Demo - 10", total: 28, severe: 2, moderate: 9,  mild: 17, trend: "-15%" },
        { driver: "Devon Carter",  vehicle: "Demo - 15", total: 24, severe: 1, moderate: 8,  mild: 15, trend: "-3%" },
      ],
      hotspot: {
        driver: "Sam Whitfield", vehicle: "Demo - 33",
        location: "W Charleston Blvd & S Rancho Dr",
        events: 23, of: 58, severeHere: 7, peakHours: "16:00–18:00",
      },
    },

    /* School-zone speeding this month (posted-speed proxy, ≤20 mph segments). */
    schoolZone: {
      byDriver: [
        { driver: "Marcus Bell",  vehicle: "Demo - 08", violations: 4, near: "Walter Bracken STEAM",   worst: "34 in a 15 mph zone", when: "07:50, school in" },
        { driver: "Devon Carter", vehicle: "Demo - 15", violations: 2, near: "John S. Park Elementary", worst: "29 in a 15 mph zone", when: "15:10, school out" },
        { driver: "Chloe Tran",   vehicle: "Demo - 20", violations: 1, near: "Las Vegas Academy",        worst: "26 in a 20 mph zone", when: "08:05, school in" },
      ],
      schools: ["Walter Bracken STEAM", "John S. Park Elementary", "Las Vegas Academy"],
      limitsMph: [15, 15, 20],
    },

    /* Fuel economy by type — this month. */
    fuel: {
      monthlyUSD: 41500,
      blendedMpg: 17.3,
      recoverableUSDPerMonth: "2,500–3,000",
      byType: [
        { type: "Ford Transit 250 (van)", shortType: "Transit 250", count: 35, mpg: 18.2, ratedMpg: 19.5 },
        { type: "Ford F-150 (pickup)",    shortType: "F-150",       count: 15, mpg: 15.1, ratedMpg: 16.0 },
      ],
      worstVsTypeAvg: [
        { driver: "Marcus Bell",  vehicle: "Demo - 08", mpg: 14.9, vsType: "-18%" },
        { driver: "Devon Carter", vehicle: "Demo - 15", mpg: 15.6, vsType: "-14%" },
        { driver: "Priya Nair",   vehicle: "Demo - 01", mpg: 16.0, vsType: "-12%" },
      ],
    },

    /* Idling — last 7 days. */
    idle: {
      fleetIdleHours7d: 118,
      gallons: 59,
      costUSD: 210,
      annualizedUSD: 10920,
      co2kg: 525,
      byDriver: [
        { driver: "Hannah Brooks", vehicle: "Demo - 17", idleHours: 6.1, costUSD: 10.9 },
        { driver: "Eddie Vance",   vehicle: "Demo - 29", idleHours: 5.4, costUSD: 9.6 },
        { driver: "Sam Whitfield", vehicle: "Demo - 33", idleHours: 4.8, costUSD: 8.5 },
        { driver: "Rosa Mendez",   vehicle: "Demo - 41", idleHours: 4.3, costUSD: 7.6 },
        { driver: "Will Dawson",   vehicle: "Demo - 05", idleHours: 3.9, costUSD: 6.9 },
      ],
    },

    /* Drivers flagged for individual 1:1 coaching (non-systemic risk). */
    coaching: [
      { driver: "Marcus Bell",   vehicle: "Demo - 08", score: 47, why: "multi-factor: speed + harsh braking + 8 seatbelt + 4 school-zone events" },
      { driver: "Tina Alvarez",  vehicle: "Demo - 22", score: 52, why: "31 harsh accelerations — aggressive launches, up 4%" },
      { driver: "Sam Whitfield", vehicle: "Demo - 33", score: 55, why: "9 severe brakes, 40% at Charleston & Rancho 16:00-18:00" },
    ],

    /* Annual recoverable-savings model (the ROI / business-case scenario).
     * Each lever's annualUSD is the CONSERVATIVE (low-end) capturable figure;
     * low/high give the range. Levers cross-link to the scenario that fixes them.
     * Numbers reconcile with fuel.monthlyUSD ($41.5k → ~$498k/yr) and
     * idle.annualizedUSD ($10.9k) elsewhere in this store. */
    savings: {
      currency: "USD",
      annualFuelSpendUSD: 498000,
      fleetVehicles: 50,
      totalAnnualUSD: 75500,
      perVehicleUSD: 1510,
      levers: [
        { lever: "Speeding → fuel",            annualUSD: 33000, low: 30000, high: 36000, basis: "close the 6–8% gap between 17.3 mpg fleet avg and rated economy", fixesNode: "ep2-action" },
        { lever: "Collision & insurance",      annualUSD: 28000, low: 18000, high: 40000, basis: "coach the 3 multi-factor drivers + telematics premium credit & claims avoidance (risk-weighted)", fixesNode: "ep-agentic-coaching" },
        { lever: "Maintenance & downtime",     annualUSD: 12000, low: 9000,  high: 16000, basis: "preventive-vs-reactive servicing; fewer unplanned out-of-service days", fixesNode: "ep-maint-overdue" },
        { lever: "Idling",                     annualUSD: 2500,  low: 2200,  high: 3300,  basis: "20–30% cut on the $10.9k/yr currently burned parked", fixesNode: "ep-ops-idle" },
      ],
    },
  },

  /* ============================================== SPAIN · maintenance ===== */
  spain: {
    /* Overdue maintenance reminders — read against live odometer/engine hours. */
    overdue: [
      { vehicle: "Demo - 25", type: "MAN coach",    driver: "Núria Pons",   service: "Annual roadworthiness (ITV)", overdue: "19 days",  priority: "CRITICAL — legal",          chartLabel: "Demo - 25 · ITV (days×100)", chartValue: 1900 },
      { vehicle: "Demo - 02", type: "MAN coach",    driver: "Iker Sáez",    service: "Brake inspection",            overdue: "6,100 km", priority: "HIGH — passenger safety",  chartLabel: "Demo - 02 · brakes (km)",     chartValue: 6100 },
      { vehicle: "Demo - 14", type: "Actros truck", driver: "Marta Ferrer", service: "Engine oil & filter",         overdue: "8,400 km", priority: "HIGH",                    chartLabel: "Demo - 14 · oil (km)",        chartValue: 8400 },
      { vehicle: "Demo - 19", type: "Actros truck", driver: "Bruno Gil",    service: "Engine oil & filter",         overdue: "4,700 km", priority: "MEDIUM",                  chartLabel: "Demo - 19 · oil (km)",        chartValue: 4700 },
      { vehicle: "Demo - 41", type: "Renault T",    driver: "Aitor Vidal",  service: "DPF service / tyre rotation",  overdue: "3,900 km", priority: "MEDIUM",                  chartLabel: "Demo - 41 · DPF (km)",        chartValue: 3900 },
    ],

    /* Fault triage — last 7 days, 597 records by warning-lamp severity. */
    faults: {
      total7d: 597,
      informationalDevice: 580,   // GO unplugged / power / GPS, on the 5 Sprinters
      critical: [
        { vehicle: "Demo - 12", driver: "Pau Serra",    fault: "Brake system air pressure low",   lamp: "red" },
        { vehicle: "Demo - 28", driver: "Lucía Mena",   fault: "Engine coolant temperature high", lamp: "red" },
        { vehicle: "Demo - 31", driver: "Roberto Vila", fault: "SCR aftertreatment — derate imminent", lamp: "red" },
      ],
      warning: { "DPF regeneration required": 5, "AdBlue/DEF low": 4, "Battery voltage low": 3, "Tyre pressure low": 2 },
      actionableChart: [
        { label: "🔴 Brake pressure (Demo-12)", value: 1 },
        { label: "🔴 Coolant high (Demo-28)",   value: 1 },
        { label: "🔴 SCR derate (Demo-31)",     value: 1 },
        { label: "🟡 DPF regen",                value: 5 },
        { label: "🟡 AdBlue low",               value: 4 },
        { label: "🟡 Battery low",              value: 3 },
        { label: "🟡 Tyre pressure",            value: 2 },
      ],
    },

    /* Unplanned downtime — this quarter. */
    downtime: {
      fleetDownDays: 38,
      lostEUR: 23400,
      byVehicle: [
        { vehicle: "Demo - 08", label: "Demo - 08 (van)",   downDays: 9.2, cause: "recurring power/connector fault",  estCostEUR: 3700 },
        { vehicle: "Demo - 06", label: "Demo - 06 (van)",   downDays: 6.1, cause: "connector fault + awaiting parts", estCostEUR: 2450 },
        { vehicle: "Demo - 07", label: "Demo - 07 (van)",   downDays: 4.8, cause: "connector fault",                 estCostEUR: 1920 },
        { vehicle: "Demo - 28", label: "Demo - 28 (coach)", downDays: 4.2, cause: "coolant/overheat repair",         estCostEUR: 3360 },
        { vehicle: "Demo - 12", label: "Demo - 12 (truck)", downDays: 3.5, cause: "brake system repair",             estCostEUR: 2800 },
      ],
    },
  },

  /* ============================== MotherDuck warehouse teaching experience === */
  warehouse: {
    database: "geotab_demo_fh4",
    source: "demo_fh4",
    factsWindow: "2026-06-26 01:42:40 UTC → now",
    bootstrapRows: 522162,
    incrementalRows: 157419,
    silverRows: 679577,
    dimensionRows: 50,
    stages: {
      empty: [
        { kind: "default", name: "Database", status: "empty", tables: [] },
      ],
      schemas: [
        { kind: "default", name: "Database", status: "ready", active: true, tables: [{ name: "gps_points", rows: "0 rows" }] },
      ],
      loaded: [
        { kind: "default", name: "Database", status: "loaded", active: true, tables: [{ name: "gps_points", rows: "157,419 rows", sample: [
          { DeviceName: "Demo - 02", GpsDateTime: "2026-06-26 01:42:41", Speed: "48", Latitude: "39.4699", Longitude: "-0.3763" },
          { DeviceName: "Demo - 14", GpsDateTime: "2026-06-26 01:42:42", Speed: "0", Latitude: "39.4731", Longitude: "-0.3808" },
          { DeviceName: "Demo - 31", GpsDateTime: "2026-06-26 01:42:43", Speed: "67", Latitude: "39.4564", Longitude: "-0.3521" },
        ] }] },
      ],
      layered: [
        { kind: "bronze", name: "Bronze", status: "append-only", active: true, tables: [{ name: "bronze.gps_raw", rows: "679,581 rows", }] },
        { kind: "silver", name: "Silver", status: "queryable", active: true, tables: [{ name: "silver.planet_gps_pings", rows: "679,577 rows", }, { name: "silver.dim_device", rows: "50 rows", }] },
        { kind: "gold", name: "Gold", status: "ready", tables: [{ name: "gold.daily_device_km", rows: "31 days", }] },
      ],
      incremental: [
        { kind: "bronze", name: "Bronze", status: "+ new batch", active: true, tables: [{ name: "bronze.gps_raw", rows: "+18,742 rows", }] },
        { kind: "silver", name: "Silver", status: "deduped", active: true, tables: [{ name: "silver.planet_gps_pings", rows: "+18,731 rows", }, { name: "silver.dim_device", rows: "50 rows", }] },
        { kind: "gold", name: "Gold", status: "refreshed", active: true, tables: [{ name: "gold.daily_device_km", rows: "+1 day", }] },
      ],
      operational: [
        { kind: "bronze", name: "Bronze", status: "facts landing", active: true, tables: [
          { name: "bronze.gps_raw", rows: "698,323 rows", },
          { name: "bronze.trips_raw", rows: "8,412 rows", },
          { name: "bronze.driver_changes_raw", rows: "1,126 rows", },
          { name: "bronze.status_data_raw", rows: "1.9M rows", },
          { name: "bronze.exception_events_raw", rows: "42,806 rows", },
          { name: "bronze.fault_data_raw", rows: "4,918 rows", },
        ] },
        { kind: "silver", name: "Silver", status: "joined facts", active: true, tables: [
          { name: "silver.planet_gps_pings", rows: "698,308 rows", },
          { name: "silver.trips", rows: "8,407 rows", },
          { name: "silver.driver_assignments", rows: "1,118 rows", },
          { name: "silver.status_data", rows: "1.9M rows", },
          { name: "silver.exception_events", rows: "42,781 rows", },
          { name: "silver.fault_data", rows: "4,912 rows", },
          { name: "silver.dim_user", rows: "113 rows", note: "drivers are Users with isDriver=true" },
          { name: "silver.dim_rule", rows: "386 rows", },
          { name: "silver.dim_diagnostic", rows: "2,184 rows", },
        ] },
        { kind: "gold", name: "Gold", status: "ops marts", active: true, tables: [
          { name: "gold.daily_device_km", rows: "31 days", },
          { name: "gold.driver_safety_score", rows: "50 drivers", },
          { name: "gold.maintenance_risk", rows: "50 vehicles", },
          { name: "gold.idling_cost_daily", rows: "31 days", },
        ] },
      ],
      restated: [
        { kind: "bronze", name: "Bronze", status: "every version kept", active: true, tables: [
          { name: "bronze.trips_raw", rows: "8,412 rows", note: "append-only: retired + current trip ids both on disk", sample: [
            { TripId: "b10FEE52", DeviceName: "Demo - 31", trip_start_utc: "2026-06-29 23:18:24", trip_end_utc: "2026-06-29 23:28:51", _batch_id: "forward" },
            { TripId: "b11011A1", DeviceName: "Demo - 31", trip_start_utc: "2026-06-29 23:18:24", trip_end_utc: "2026-06-29 23:42:07", _batch_id: "reconcile" },
          ] },
          { name: "bronze.driver_changes_raw", rows: "1,126 rows", note: "DriverChange login/logout — append-only events", sample: [
            { device: "Demo - 31", driver: "u_demo_31", dateTime: "2026-06-29 23:18:24", type: "login" },
            { device: "Demo - 31", driver: "u_demo_31", dateTime: "2026-06-30 02:41:10", type: "logout" },
          ] },
        ] },
        { kind: "silver", name: "Silver", status: "reconciled", active: true, tables: [
          { name: "silver.trips", rows: "8,407 rows", note: "1 row per drive · key (DeviceId, trip_start_utc) · latest load wins", sample: [
            { TripId: "b11011A1", DeviceName: "Demo - 31", trip_start_utc: "2026-06-29 23:18:24", trip_end_utc: "2026-06-29 23:42:07", driver_id: "u_demo_31" },
            { TripId: "b10F7C03", DeviceName: "Demo - 14", trip_start_utc: "2026-06-29 22:51:09", trip_end_utc: "2026-06-29 23:05:44", driver_id: "UnknownDriverId" },
          ] },
          { name: "silver.driver_assignments", rows: "1,118 rows", note: "Trip.driver → dim_user.id or UnknownDriverId" },
          { name: "silver.dim_user", rows: "113 rows", note: "drivers are Users with isDriver=true" },
        ] },
        { kind: "gold", name: "Gold", status: "reconcile audit", active: true, tables: [
          { name: "gold.trip_reconcile_log", rows: "50 retired · 51 re-split" },
        ] },
      ],
      quality: [
        { kind: "bronze", name: "Bronze", status: "audited", active: true, tables: [
          { name: "bronze.gps_raw", rows: "698,323 rows" },
          { name: "bronze.trips_raw", rows: "8,412 rows" },
          { name: "bronze.exception_events_raw", rows: "42,806 rows" },
        ] },
        { kind: "silver", name: "Silver", status: "checked", active: true, tables: [
          { name: "silver.fact_freshness", rows: "5 rows" },
          { name: "silver.coverage_by_device", rows: "50 rows" },
          { name: "silver.driver_assignment_coverage", rows: "50 rows" },
          { name: "silver.ingest_anomalies", rows: "2 warnings" },
        ] },
        { kind: "gold", name: "Gold", status: "answer-ready", active: true, tables: [
          { name: "gold.fleet_ops_overview", rows: "1 row" },
          { name: "gold.driver_coaching_queue", rows: "14 rows" },
          { name: "gold.shop_worklist", rows: "9 rows" },
        ] },
      ],
      /* The cost node reuses the `quality` stage above — the MotherDuck panel
         always shows the real bronze/silver/gold tables, never pricing rows. */
    },
  },
};
