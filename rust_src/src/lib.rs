mod era;
mod unit;
mod game;
mod ai;

use wasm_bindgen::prelude::*;
use game::Game;
use std::cell::RefCell;
use std::rc::Rc;

thread_local! {
    static GAME: RefCell<Option<Rc<RefCell<Game>>>> = RefCell::new(None);
}

#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn create_game() {
    GAME.with(|game| {
        *game.borrow_mut() = Some(Rc::new(RefCell::new(Game::new())));
    });
}

#[wasm_bindgen]
pub fn update_game() {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow_mut().update();
        }
    });
}

#[wasm_bindgen]
pub fn spawn_player_unit(unit_type: u32) -> bool {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow_mut().spawn_player_unit(unit_type)
        } else {
            false
        }
    })
}

#[wasm_bindgen]
pub fn upgrade_player_era() {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow_mut().upgrade_player_era();
        }
    });
}

#[wasm_bindgen]
pub fn toggle_pause() {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow_mut().toggle_pause();
        }
    });
}

#[wasm_bindgen]
pub fn reset_game() {
    GAME.with(|game| {
        *game.borrow_mut() = Some(Rc::new(RefCell::new(Game::new())));
    });
}

#[wasm_bindgen]
pub fn get_player_health() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_player_health()
        } else {
            100
        }
    })
}

#[wasm_bindgen]
pub fn get_player_max_health() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_player_max_health()
        } else {
            100
        }
    })
}

#[wasm_bindgen]
pub fn get_player_gold() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_player_gold()
        } else {
            0
        }
    })
}

#[wasm_bindgen]
pub fn get_player_units_count() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_player_units_count()
        } else {
            0
        }
    })
}

#[wasm_bindgen]
pub fn get_player_era() -> u32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_player_era()
        } else {
            0
        }
    })
}

#[wasm_bindgen]
pub fn get_enemy_health() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_enemy_health()
        } else {
            100
        }
    })
}

#[wasm_bindgen]
pub fn get_enemy_max_health() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_enemy_max_health()
        } else {
            100
        }
    })
}

#[wasm_bindgen]
pub fn get_enemy_gold() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_enemy_gold()
        } else {
            0
        }
    })
}

#[wasm_bindgen]
pub fn get_enemy_units_count() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_enemy_units_count()
        } else {
            0
        }
    })
}

#[wasm_bindgen]
pub fn get_enemy_era() -> u32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_enemy_era()
        } else {
            0
        }
    })
}

#[wasm_bindgen]
pub fn get_wave() -> i32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_wave()
        } else {
            1
        }
    })
}

#[wasm_bindgen]
pub fn get_wave_progress() -> f32 {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_wave_progress()
        } else {
            0.0
        }
    })
}

#[wasm_bindgen]
pub fn is_game_over() -> bool {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().is_game_over()
        } else {
            false
        }
    })
}

#[wasm_bindgen]
pub fn is_player_won() -> bool {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().is_player_won()
        } else {
            false
        }
    })
}

#[wasm_bindgen]
pub fn get_units_json() -> String {
    GAME.with(|game| {
        if let Some(g) = game.borrow().as_ref() {
            g.borrow().get_units_json()
        } else {
            "[]".to_string()
        }
    })
}
