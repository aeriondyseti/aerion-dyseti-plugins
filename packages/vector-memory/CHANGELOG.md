# Changelog

## [1.4.1] - 2026-03-11

### Changed
- Renamed "checkpoint" concept to "waypoint" throughout the plugin
- Renamed "store" operation to "set" for waypoints (`store_checkpoint` → `set_waypoint`)
- Restored colon-separated skill names (`checkpoint-get` → `waypoint:get`, etc.)
- Renamed skill directories: `checkpoint-get/` → `waypoint-get/`, `checkpoint-store/` → `waypoint-set/`, `checkpoint-workflow/` → `waypoint-workflow/`
- Updated MCP tool references: `store_checkpoint` → `set_waypoint`, `get_checkpoint` → `get_waypoint`
- Updated all hook scripts, plugin metadata, and marketplace listing to use "waypoint" terminology

## [1.3.0] - 2026-03-07

### Changed
- Raised context monitor warning thresholds to reduce false positives:
  - Turn count: 80/150/250 → 120/180/250 (warn/strong/critical)
  - Context tokens: 100k/140k/170k → 120k/150k/175k
  - Compressions: 1/3/5 → 2/4/6
- Replaced compression detection heuristic (token-drop guessing) with actual
  compaction tracking via `SessionStart` hook with `compact` source
- Removed `peak_context_length` from monitor state (no longer needed)

### Added
- `session-clear.ts` hook script handling two `SessionStart` sources:
  - `clear` — resets all context-monitor state when user runs `/clear`
  - `compact` — increments compression counter on actual context compaction

### Fixed
- Context monitor state now resets on `/clear` instead of persisting stale
  turn counts and compression counts from the previous session
