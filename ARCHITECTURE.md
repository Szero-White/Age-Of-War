# Rust Code Architecture Guide

## Overview

Age of War Rust + WASM is structured as a modular Cargo library that exports WebAssembly bindings for the game engine.

```
rust_src/
├── Cargo.toml          # Dependencies & build config
└── src/
    ├── lib.rs          # WASM FFI & thread-local game state
    ├── game.rs         # Core game logic & state machine
    ├── unit.rs         # Unit types, stats, & combat mechanics
    ├── era.rs          # Era definitions & progression
    └── ai.rs           # Enemy AI decision making
```

---

## Module Breakdown

### `lib.rs` - WebAssembly Interface

**Purpose**: Exports functions that JavaScript can call via WASM

**Key Concepts**:
- `thread_local!` macro for global game state
- `#[wasm_bindgen]` attribute for JS-callable functions
- Getter functions following the "query" pattern

**Main Functions** (40+ total):
- `create_game()` / `reset_game()` - Lifecycle
- `update_game()` - Game tick
- `spawn_player_unit(type)` - Player action
- `get_*` functions - State queries for UI

**Design Pattern**:
```rust
GAME.with(|game| {
    if let Some(g) = game.borrow().as_ref() {
        g.borrow_mut().some_method()
    }
})
```

This ensures safe access to the global game state from multiple async contexts.

---

### `game.rs` - Game State & Logic

**Core Struct**: `Game`
- Player/Enemy data: health, gold, era, castle position
- Units collection: `Vec<Unit>`
- Timers: gold generation, wave progression, AI decisions
- State flags: paused, game_over, player_won

**Main Methods**:

1. **`new()` & `reset()`**
   - Initialize game constants: canvas size, starting values
   - Reset on game over

2. **`update()`**
   - Called every frame by JS
   - Manages: timers, gold gen, unit updates, combat, AI, wave progression
   - Check win/lose conditions

3. **`handle_combat()`**
   - Each unit finds nearest enemy target
   - Apply damage & track kill rewards
   - Units attack castles if no enemy in range
   - Award gold for kills

4. **`ai_make_decision()`**
   - Called periodically (every 120 frames)
   - Decides unit type based on enemy era
   - Spawns unit if affordable

5. **`spawn_player_unit()` / `spawn_enemy_unit()`**
   - Create new unit at spawn position
   - Player version deducts gold, checks affordability
   - AI version called automatically

6. **`upgrade_player_era()`**
   - Next era in chain if affordable
   - Deduct gold cost

**Gameplay Constants** (could be external config):
```rust
gold_per_tick: 10 + wave_bonus
wave_length: 300 frames
ai_decision_interval: 120 frames
castle_x_left: 80, castle_x_right: 1200
```

---

### `unit.rs` - Unit System

**Structs**:

1. **`UnitType` enum**
   - 4 unit types (Soldier, Archer, Knight, Mage)
   - `cost()` - Returns spawn cost in gold

2. **`Unit` struct**
   - Position: x, y
   - Stats: hp, attack, speed, range, size
   - State: is_enemy, era_level, attack_cooldown
   - Serialized for JSON export to JS

**Stats Scaling**:
```rust
era_multiplier = 1.0 + (era_level * 0.3)
hp *= multiplier
attack *= multiplier
// speed and range are fixed per unit type
```

**Unit Types**:

| Type | HP | Attack | Range | Speed | Role |
|------|----|----- --|-------|-------|------|
| Soldier | 20 | 5 | 30 | 1.5 | Melee DPS |
| Archer | 12 | 8 | 120 | 1.2 | Ranged DPS |
| Knight | 35 | 12 | 40 | 1.0 | Tank |
| Mage | 18 | 15 | 150 | 1.3 | High DPS |

**Methods**:
- `new()` - Create unit with stats
- `update()` - Move & reduce cooldown
- `deal_damage()` - Health decrease
- `is_alive()` - Check hp > 0
- `get_unit_stats()` - Static function for stat calculation

---

### `era.rs` - Era Progression

**`Era` enum** (5 tiers):
- Primitive (0) → Medieval (1) → Industrial (2) → Modern (3) → Futuristic (4)

**Methods**:
- `name()` - Display name (Vietnamese)
- `color()` - Hex color for rendering
- `level()` - Numeric level (0.0-4.0)
- `next()` - Returns next era or None if final
- `from_u32()` / `as_u32()` - Type conversion

**Era Unlock**:
- Automatic every 5 waves (waves 5, 10, 15, 20)
- Both player and enemy level up together
- Grants 200 gold bonus

---

### `ai.rs` - Enemy AI

**`AI` struct**:
- `decision_timer` - Countdown to next decision

**Decision Making** (`decide_unit_to_build`):
- **Eras 3-4 (Modern/Futuristic)**: Mage or Knight (50% each)
- **Eras 1-2 (Medieval/Industrial)**: Archer (40%) or Knight (60%)
- **Eras 0 (Primitive)**: Soldier

**AI Constraints**:
- Only builds if gold >= 50
- Respects unit costs
- Resets decision timer every 120 frames
- Fixed interval prevents constant spam

**Improvement Opportunities**:
- Dynamic strategy based on player units count
- Resource management (save for expensive units)
- Adaptive difficulty scaling

---

## Game Loop Flow

```
JavaScript
    │
    ├─ requestAnimationFrame()
    │
    ├─> wasm.update_game()
    │     │
    │     └─> Game::update()
    │           ├─ Timers countdown
    │           ├─ Gold generation
    │           ├─ Unit movement
    │           ├─ Combat resolution
    │           ├─ Dead unit cleanup
    │           ├─ AI decisions
    │           └─ Wave progression
    │
    ├─> Get game state (get_player_health, etc)
    │
    ├─> Draw canvas using state
    │
    └─ Repeat
```

---

## Serialization to JavaScript

### `Unit` → JSON
```rust
pub struct Unit {
    pub x: f32,
    pub y: f32,
    pub unit_type: u32,
    pub is_enemy: bool,
    pub hp: f32,
    pub max_hp: f32,
    // ...fields marked #[serde(serialize)]
}
```

**JavaScript receives**:
```javascript
const units = JSON.parse(wasm.get_units_json());
// [
//   { x: 150.2, y: 250.5, unit_type: 0, is_enemy: false, hp: 25.3, ... },
//   { x: 1100.1, y: 280.2, unit_type: 1, is_enemy: true, hp: 12.0, ... }
// ]
```

---

## Common Modifications

### Adding New Unit Type

1. **`unit.rs`**: Add to `UnitType` enum
   ```rust
   pub enum UnitType {
       Soldier = 0,
       // ...new type
       NewUnit = 4,
   }
   ```

2. **`unit.rs`**: Update `get_unit_stats()`
   ```rust
   4 => (hp: 30.0, speed: 1.5, attack: 10.0, range: 50.0, size: 9.0),
   ```

3. **`game.rs`**: Update spawn cost array usage
   ```rust
   let unit_costs = [50, 80, 120, 150, 100]; // New cost
   ```

4. **`index_rust.html`**: Update UI button
   ```javascript
   { name: '🛡️ New Unit', type: 4, cost: 100 }
   ```

### Adjusting Combat Parameters

**In `game.rs` combat section**:
- `unit.attack` - Damage per hit
- `60` - Attack cooldown in frames (for 1 hit/sec at 60 FPS)
- `unit.range` - Detection radius

### Changing Difficulty

**`ai.rs`**:
```rust
pub fn decide_unit_to_build(&self, era_level: u32) -> UnitType {
    // Make AI smarter/dumber here
    // Modify decision logic
}
```

**`game.rs`**:
```rust
let gold_per_wave = 10 + self.wave; // Increase for harder game
```

---

## Performance Considerations

1. **Combat Loop**: O(n²) per frame (each unit checks all others)
   - Acceptable for ~100 units
   - Could optimize with spatial partitioning for 1000+ units

2. **Unit Storage**: `Vec<Unit>` is efficient for small counts
   - Consider ECS for large-scale optimization

3. **JSON Serialization**: 
   - Only serialize when units change (optimization opportunity)
   - Currently done every frame

4. **WASM Module Size**: ~1MB (mostly Rust stdlib)
   - Acceptable trade-off for type safety

---

## Testing

**Compile locally**:
```bash
cd rust_src
cargo build --target wasm32-unknown-unknown
```

**Run tests** (if added):
```bash
cargo test
```

**Check for warnings**:
```bash
cargo clippy
```

---

## Further Reading

- Wasm-bindgen: https://docs.rs/wasm-bindgen/
- Rust Book: https://doc.rust-lang.org/book/
- WASM in Rust: https://www.rust-lang.org/what/wasm/

