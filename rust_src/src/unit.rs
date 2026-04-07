use crate::era::Era;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UnitType {
    Soldier = 0,
    Archer = 1,
    Knight = 2,
    Mage = 3,
}

impl UnitType {
    pub fn cost(&self) -> i32 {
        match self {
            UnitType::Soldier => 50,
            UnitType::Archer => 80,
            UnitType::Knight => 120,
            UnitType::Mage => 150,
        }
    }

    pub fn from_u32(value: u32) -> Self {
        match value {
            0 => UnitType::Soldier,
            1 => UnitType::Archer,
            2 => UnitType::Knight,
            3 => UnitType::Mage,
            _ => UnitType::Soldier,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UnitStats {
    pub hp: f32,
    pub speed: f32,
    pub attack: f32,
    pub range: f32,
    pub size: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Unit {
    pub x: f32,
    pub y: f32,
    pub unit_type: u32, // 0=Soldier, 1=Archer, 2=Knight, 3=Mage
    pub era_level: u32,
    pub is_enemy: bool,
    pub hp: f32,
    pub max_hp: f32,
    pub speed: f32,
    pub attack: f32,
    pub range: f32,
    pub size: f32,
    pub attack_cooldown: i32,
}

impl Unit {
    pub fn new(x: f32, y: f32, unit_type: u32, era_level: u32, is_enemy: bool) -> Self {
        let stats = Unit::get_unit_stats(unit_type, era_level);
        let vx = if is_enemy { -stats.speed } else { stats.speed };

        Unit {
            x,
            y,
            unit_type,
            era_level,
            is_enemy,
            hp: stats.hp,
            max_hp: stats.hp,
            speed: stats.speed,
            attack: stats.attack,
            range: stats.range,
            size: stats.size,
            attack_cooldown: 0,
        }
    }

    fn get_unit_stats(unit_type: u32, era_level: u32) -> UnitStats {
        let era_mult = 1.0 + (era_level as f32 * 0.3);

        let (hp, speed, attack, range, size) = match unit_type {
            0 => (20.0, 1.5, 5.0, 30.0, 8.0),   // Soldier
            1 => (12.0, 1.2, 8.0, 120.0, 7.0),  // Archer
            2 => (35.0, 1.0, 12.0, 40.0, 10.0), // Knight
            3 => (18.0, 1.3, 15.0, 150.0, 6.0), // Mage
            _ => (20.0, 1.5, 5.0, 30.0, 8.0),   // Default: Soldier
        };

        UnitStats {
            hp: hp * era_mult,
            speed,
            attack: attack * era_mult,
            range,
            size,
        }
    }

    pub fn update(&mut self) {
        if !self.is_enemy {
            self.x += self.speed;
        } else {
            self.x -= self.speed;
        }
        self.attack_cooldown -= 1;
    }

    pub fn deal_damage(&mut self, damage: f32) {
        self.hp -= damage;
    }

    pub fn is_alive(&self) -> bool {
        self.hp > 0.0
    }

    pub fn get_color(&self) -> &str {
        match self.era_level {
            0 => "#8B4513",
            1 => "#FF6B6B",
            2 => "#FFD700",
            3 => "#00D4FF",
            4 => "#A020F0",
            _ => "#8B4513",
        }
    }
}
