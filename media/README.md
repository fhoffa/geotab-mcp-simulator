# media/

Generated assets for episodes that need a clip the live MCP can't supply.

Right now that's **Ep-Dashcam** (`ep-dashcam` in `data/conversations.js`):
`SearchMedia` is a real Geotab MCP tool, but neither demo database has any
camera media enrolled — Vegas (`demo_fh_vegas4`) returns an empty result,
Spain (`demo_fh4`) returns a server error. The episode shows that real,
empty/erroring tool call honestly, then plays an **illustrative** clip below
it — clearly disclosed in-app as a reconstruction, never presented as a real
MCP capture (see the `media-disclosure` banner in `app.js`/`styles.css`).

## Files expected here

- `dashcam-demo01-harsh-brake.mp4` — the clip
- `dashcam-demo01-harsh-brake.jpg` — a poster frame (optional; first frame is
  used if omitted)

Until these exist, the episode shows a styled "no clip yet" fallback instead
of a broken video — see `media-fallback` in `app.js`. Drop the generated
files in this folder with these exact names and reload; no code changes
needed.

## Generation prompt

Paste into a video-generation tool (Sora, Veo, Runway, Pika, etc.):

```
Forward-facing dashcam footage from inside a commercial fleet vehicle driving
on a multi-lane urban arterial road in Las Vegas, Nevada. Daytime, clear
desert sky, palm trees and low-rise commercial buildings along the road. Fixed,
wide-angle camera mounted behind the windshield, slight lens distortion,
realistic compressed dashcam video quality — no cinematic color grading.

The vehicle travels at a steady speed in light traffic. A sedan two car-lengths
ahead suddenly brakes; the dashcam vehicle brakes hard in response — the view
dips and shakes slightly, the lead car's brake lights flare bright red. No
collision occurs; both vehicles come to a controlled stop.

Burn in a small on-screen telemetry overlay, bottom-left corner: vehicle ID
"DEMO-01", a speed readout that drops quickly (e.g. ~45 mph to ~10 mph), and a
timestamp. Duration: 8-10 seconds.
```

Why these specifics: Demo - 01 is the same vehicle already used in the
posted-speed dispute episode (Ep10) and the fleet-wide speeding finding
(Ep1/Ep2) — grounded facts from the live demo data, not invented for this
clip. The scenario (hard braking, no collision) fits a coaching conversation
rather than a dramatized crash.
