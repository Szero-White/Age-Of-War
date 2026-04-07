use crate::unit::UnitType;
use rand::Rng;

pub struct AI {
    decision_timer: i32,
}

impl AI {
    pub fn new() -> Self {
        AI {
            decision_timer: 120,
        }
    }

    pub fn update(&mut self) {
        self.decision_timer -= 1;
    }

    pub fn should_decide(&self) -> bool {
        self.decision_timer <= 0
    }

    pub fn reset_decision_timer(&mut self) {
        self.decision_timer = 120;
    }

    pub fn decide_unit_to_build(&self, era_level: u32) -> UnitType {
        let mut rng = rand::thread_rng();

        match era_level {
            3 | 4 => {
                if rng.gen::<f32>() > 0.5 {
                    UnitType::Mage
                } else {
                    UnitType::Knight
                }
            }
            1 | 2 => {
                if rng.gen::<f32>() > 0.6 {
                    UnitType::Archer
                } else {
                    UnitType::Knight
                }
            }
            _ => UnitType::Soldier,
        }
    }
}
