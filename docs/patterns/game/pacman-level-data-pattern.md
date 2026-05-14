# Pac-Man Level Data Pattern

## Purpose

This guide documents how Pac-Man maze data is represented, parsed, queried, and converted into scene entities.

## Recommended Rule

- Keep Pac-Man level data under `src/app/pacman/levels`.
- Use fixed-width text rows and preserve spaces exactly.
- Keep tile parsing and tile collision queries Pac-Man-specific until a generic tile engine is needed.
- Treat parsed tile-map queries as the authoritative static collision source.
- Generate render/metadata entities from level data instead of manually positioning static maze objects.
- Use tunnel tile pairing from parsed level data for movement wrapping.

## Why This Rule Exists

- Pac-Man movement, pellets, tunnels, spawns, and ghost behavior all depend on the same maze model.
- Text rows make early maps easy to review in code.
- A single tile-map authority prevents wall entities and collision data from drifting apart.

## Recommended Structure Or Usage Pattern

```text
src/app/pacman/
  constants/pacman-level.constant.ts
  interfaces/pacman-level.interface.ts
  levels/
    classic-level.ts
    pacman-level.parser.ts
  components/
    pacman-tile.component.ts
    pacman-collectible.component.ts
    pacman-spawn.component.ts
  factories/
    pacman-level-entity.factory.ts
```

Use these symbols in level rows:

- `#`: wall
- `.`: pellet
- `o`: power pellet
- ` `: path
- `P`: player spawn
- `G`: ghost spawn
- `H`: ghost house
- `T`: tunnel

Tile world positions use top-left coordinates: `{ x: column * tileSize, y: row * tileSize }`.

Movement uses actor centers for tile alignment and tile queries for static collision. Wall entities are render/metadata output from the level model, not the source for movement blocking.

Tunnel wrapping is valid only when an actor crosses the level boundary from a tunnel tile that has a paired exit. The wrapped position should align the actor center to the paired tunnel tile center before scene serialization.

## Checklist

1. Keep every row the same length.
2. Do not trim rows; leading and trailing spaces are path tiles.
3. Include exactly one player spawn.
4. Include at least one ghost spawn and one ghost-house tile.
5. Use either zero tunnel tiles or exactly two tunnel tiles.
6. Add tests for parser validation and query behavior when changing map data.
7. Keep movement collision backed by parsed level queries instead of duplicating wall state in a physics index.

## Anti-Patterns

- Do not store Pac-Man tile symbols or map parsing in the generic game engine.
- Do not infer collision authority from wall render entities.
- Do not add browser drawing logic to level parsers, components, or systems.
- Do not manually hard-code actor positions when the level defines spawn tiles.
- Do not emit collision events for wall blocking unless another system needs a defined collision payload.
