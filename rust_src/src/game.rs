use crate::era::Era;
use crate::unit::{Unit, UnitType};
use crate::ai::AI;
use serde::Serialize;
use rand::Rng;

#[derive(Serialize)]
pub struct GameState {
    pub player_health: i32,
    pub player_max_health: i32,
    pub player_gold: i32,
    pub player_era: u32,
    pub player_units_count: i32,
    pub player_castle_x: f32,

    pub enemy_health: i32,
    pub enemy_max_health: i32,
    pub enemy_gold: i32,
    pub enemy_era: u32,
    pub enemy_units_count: i32,
    pub enemy_castle_x: f32,

    pub wave: i32,
    pub is_game_over: bool,
    pub is_player_won: bool,
    pub paused: bool,
}

pub struct Game {
    // Player
    player_health: f32,
    player_max_health: f32,
    player_gold: i32,
    player_era: u32,
    player_castle_x: f32,

    // Enemy
    enemy_health: f32,
    enemy_max_health: f32,
    enemy_gold: i32,
    enemy_era: u32,
    enemy_castle_x: f32,

    // Game state
    units: Vec<Unit>,
    wave: i32,
    wave_timer: i32,
    gold_timer: i32,
    game_over: bool,
    player_won: bool,
    paused: bool,

    // AI
    ai: AI,

    // Constants
    canvas_width: f32,
    canvas_height: f32,
}

impl Game {
    pub fn new() -> Self {
        Game {
            player_health: 100.0,
            player_max_health: 100.0,
            player_gold: 500,
            player_era: 0,
            player_castle_x: 80.0,

            enemy_health: 100.0,
            enemy_max_health: 100.0,
            enemy_gold: 500,
            enemy_era: 0,
            enemy_castle_x: 1200.0, // Default canvas width - 80

            units: Vec::new(),
            wave: 1,
            wave_timer: 300,
            gold_timer: 60,
            game_over: false,
            player_won: false,
            paused: false,

            ai: AI::new(),

            canvas_width: 1280.0,
            canvas_height: 600.0,
        }
    }

    pub fn update(&mut self) {
        if self.paused || self.game_over {
            return;
        }

        // Update timers
        self.gold_timer -= 1;
        self.wave_timer -= 1;
        self.ai.update();

        // Generate gold
        if self.gold_timer <= 0 {
            self.player_gold += 10 + self.wave;
            self.enemy_gold += 10 + self.wave;
            self.gold_timer = 60;
        }

        // Update units
        for unit in &mut self.units {
            unit.update();
        }

        // Remove out of bounds units
        self.units.retain(|unit| {
            if unit.is_enemy && unit.x < -50.0 {
                return false;
            }
            if !unit.is_enemy && unit.x > self.canvas_width + 50.0 {
                return false;
            }
            true
        });

        // Unit combat
        self.handle_combat();

        // Remove dead units
        self.units.retain(|unit| unit.is_alive());

        // Enemy AI
        if self.ai.should_decide() {
            self.ai_make_decision();
            self.ai.reset_decision_timer();
        }

        // Wave progression
        if self.wave_timer <= 0 {
            self.wave += 1;
            self.wave_timer = 300;

            // Era upgrade every 5 waves
            if self.wave % 5 == 0 && self.wave <= 20 {
                let next_era = (self.wave / 5) as u32 - 1;
                if next_era < 5 {
                    self.player_era = next_era;
                    self.enemy_era = next_era;
                    self.player_gold += 200;
                    self.enemy_gold += 200;
                }
            }
        }

        // Check game over
        if self.player_health <= 0.0 {
            self.game_over = true;
            self.player_won = false;
        }
        if self.enemy_health <= 0.0 {
            self.game_over = true;
            self.player_won = true;
        }
    }

    fn handle_combat(&mut self) {
        let mut castle_damages = (0.0, 0.0); // (player_castle_dmg, enemy_castle_dmg)
        let mut kill_rewards = Vec::new(); // (is_enemy, reward_amount)

        // Combat phase
        for i in 0..self.units.len() {
            let unit = &self.units[i];
            
            if unit.attack_cooldown > 0 || !unit.is_alive() {
                continue;
            }

            // Find nearest target
            let mut target_idx = None;
            let mut min_distance = f32::INFINITY;

            for j in 0..self.units.len() {
                if i == j {
                    continue;
                }
                let other = &self.units[j];
                if (unit.is_enemy == other.is_enemy) || !other.is_alive() {
                    continue; // Same team or dead
                }

                let distance = (unit.x - other.x).abs();
                if distance < unit.range && distance < min_distance {
                    min_distance = distance;
                    target_idx = Some(j);
                }
            }

            // Apply damage
            if let Some(target_i) = target_idx {
                let damage = self.units[i].attack;
                let target_was_alive = self.units[target_i].is_alive();
                
                self.units[target_i].deal_damage(damage);
                self.units[i].attack_cooldown = 60;
                
                // Check if target just died
                if target_was_alive && !self.units[target_i].is_alive() {
                    let kill_reward = 20 + (self.units[target_i].era_level as i32 * 10);
                    kill_rewards.push((self.units[i].is_enemy, kill_reward));
                }
            } else {
                // Attack castle
                let castle_x = if unit.is_enemy {
                    self.player_castle_x
                } else {
                    self.enemy_castle_x
                };

                let castle_distance = (unit.x - castle_x).abs();
                if castle_distance < unit.range * 1.5 {
                    let damage = unit.attack / 60.0;
                    if unit.is_enemy {
                        castle_damages.0 += damage;
                    } else {
                        castle_damages.1 += damage;
                    }
                    self.units[i].attack_cooldown = 60;
                }
            }
        }

        // Apply kill rewards
        for (is_enemy, reward) in kill_rewards {
            if is_enemy {
                self.player_gold += reward;
            } else {
                self.enemy_gold += reward;
            }
        }

        self.player_health -= castle_damages.0;
        self.enemy_health -= castle_damages.1;
    }

    fn ai_make_decision(&mut self) {
        if self.enemy_gold < 50 {
            return;
        }

        let unit_type = self.ai.decide_unit_to_build(self.enemy_era);
        let cost = unit_type.cost();

        if self.enemy_gold >= cost {
            self.spawn_enemy_unit(unit_type);
            self.enemy_gold -= cost;
        }
    }

    pub fn spawn_player_unit(&mut self, unit_type: u32) -> bool {
        let unit_type = UnitType::from_u32(unit_type);
        let cost = unit_type.cost();

        if self.player_gold < cost || self.game_over {
            return false;
        }

        self.player_gold -= cost;
        let x = 100.0;
        let y = 100.0 + rand::random::<f32>() * (self.canvas_height - 200.0);

        let unit = Unit::new(x, y, unit_type as u32, self.player_era, false);
        self.units.push(unit);
        true
    }

    fn spawn_enemy_unit(&mut self, unit_type: UnitType) {
        let x = self.canvas_width - 100.0;
        let y = 100.0 + rand::random::<f32>() * (self.canvas_height - 200.0);

        let unit = Unit::new(x, y, unit_type as u32, self.enemy_era, true);
        self.units.push(unit);
    }

    pub fn upgrade_player_era(&mut self) {
        if self.player_era < 4 {
            let cost = 300 + (self.player_era as i32 * 100);

            if self.player_gold >= cost {
                self.player_gold -= cost;
                self.player_era += 1;
            }
        }
    }

    pub fn toggle_pause(&mut self) {
        self.paused = !self.paused;
    }

    // Getters
    pub fn get_player_health(&self) -> i32 {
        (self.player_health as i32).max(0)
    }

    pub fn get_player_max_health(&self) -> i32 {
        self.player_max_health as i32
    }

    pub fn get_player_gold(&self) -> i32 {
        self.player_gold
    }

    pub fn get_player_units_count(&self) -> i32 {
        self.units.iter().filter(|u| !u.is_enemy).count() as i32
    }

    pub fn get_player_era(&self) -> u32 {
        self.player_era
    }

    pub fn get_enemy_health(&self) -> i32 {
        (self.enemy_health as i32).max(0)
    }

    pub fn get_enemy_max_health(&self) -> i32 {
        self.enemy_max_health as i32
    }

    pub fn get_enemy_gold(&self) -> i32 {
        self.enemy_gold
    }

    pub fn get_enemy_units_count(&self) -> i32 {
        self.units.iter().filter(|u| u.is_enemy).count() as i32
    }

    pub fn get_enemy_era(&self) -> u32 {
        self.enemy_era
    }

    pub fn get_wave(&self) -> i32 {
        self.wave
    }

    pub fn get_wave_progress(&self) -> f32 {
        ((300 - self.wave_timer) as f32 / 300.0).max(0.0).min(1.0)
    }

    pub fn is_game_over(&self) -> bool {
        self.game_over
    }

    pub fn is_player_won(&self) -> bool {
        self.player_won
    }

    pub fn get_units_json(&self) -> String {
        serde_json::to_string(&self.units).unwrap_or_else(|_| "[]".to_string())
    }
}
