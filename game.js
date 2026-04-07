// Age of War 3 Clone - Game Logic

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const topBar = document.querySelector('.top-bar');
const bottomBar = document.querySelector('.bottom-bar');

function resizeCanvas() {
    const horizontalPadding = 24;
    const verticalPadding = 28;
    const availableHeight = window.innerHeight - topBar.offsetHeight - bottomBar.offsetHeight - verticalPadding;

    canvas.width = Math.max(960, window.innerWidth - horizontalPadding);
    canvas.height = Math.max(180, availableHeight);

    if (game) {
        game.enemy.castleX = canvas.width - 80;
    }
}

// Game States
const ERAS = {
    PRIMITIVE: { name: 'Thời Nguyên Thủy', level: 0, color: '#8B4513' },
    MEDIEVAL: { name: 'Thời Trung Cổ', level: 1, color: '#FF6B6B' },
    INDUSTRIAL: { name: 'Thời Công Nghiệp', level: 2, color: '#FFD700' },
    MODERN: { name: 'Thời Hiện Đại', level: 3, color: '#00D4FF' },
    FUTURISTIC: { name: 'Thời Tương Lai', level: 4, color: '#A020F0' }
};

const UNIT_TYPES = {
    SOLDIER: 0,
    ARCHER: 1,
    KNIGHT: 2,
    MAGE: 3
};

const ERA_COLORS = ['#8B4513', '#FF6B6B', '#FFD700', '#00D4FF', '#A020F0'];

const UNIT_CONFIGS = [
    { name: '🐷 Lính', type: UNIT_TYPES.SOLDIER, cost: 50 },
    { name: '🏹 Thủ Cung', type: UNIT_TYPES.ARCHER, cost: 80 },
    { name: '⚔️ Hiệp Sĩ', type: UNIT_TYPES.KNIGHT, cost: 120 },
    { name: '🔮 Pháp Sư', type: UNIT_TYPES.MAGE, cost: 150 },
    { name: '🏛️ Nâng Cấp Era', type: 'era', cost: 300 }
];

const UNIT_LABELS = ['Lính', 'Thủ Cung', 'Hiệp Sĩ', 'Pháp Sư'];
const UNIT_ACCENTS = ['#f59e0b', '#22d3ee', '#f97316', '#c084fc'];
const UNIT_SYMBOLS = ['S', 'A', 'K', 'M'];

// Unit classes definition
class Unit {
    constructor(x, y, type, era, isEnemy = false, options = {}) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.era = era;
        this.isEnemy = isEnemy;
        this.alive = true;
        this.statMultiplier = options.statMultiplier || 1;
        this.isElite = Boolean(options.isElite);
        
        const unitStats = this.getUnitStats();
        this.hp = unitStats.hp;
        this.maxHp = unitStats.hp;
        this.speed = unitStats.speed;
        this.attack = unitStats.attack;
        this.range = unitStats.range;
        this.size = unitStats.size;
        this.attackCooldown = 0;
        this.vx = isEnemy ? -this.speed : this.speed;
        this.bob = Math.random() * Math.PI * 2;
    }

    getLabel() {
        return UNIT_LABELS[this.type] || 'Lính';
    }

    getAccent() {
        return UNIT_ACCENTS[this.type] || '#ffffff';
    }

    getSymbol() {
        return UNIT_SYMBOLS[this.type] || '?';
    }

    getUnitStats() {
        const eraLevel = this.era.level;
        let base = {};

        if (this.type === UNIT_TYPES.SOLDIER) {
            base = { hp: 20, speed: 1.5, attack: 5, range: 30, size: 14 };
        } else if (this.type === UNIT_TYPES.ARCHER) {
            base = { hp: 12, speed: 1.2, attack: 8, range: 120, size: 13 };
        } else if (this.type === UNIT_TYPES.KNIGHT) {
            base = { hp: 35, speed: 1, attack: 12, range: 40, size: 17 };
        } else if (this.type === UNIT_TYPES.MAGE) {
            base = { hp: 18, speed: 1.3, attack: 15, range: 150, size: 12 };
        }

        // Scale with era
        const multiplier = 1 + (eraLevel * 0.3);
        const eliteScale = this.statMultiplier;
        return {
            hp: base.hp * multiplier * eliteScale,
            speed: base.speed * (1 + (eliteScale - 1) * 0.2),
            attack: base.attack * multiplier * eliteScale,
            range: base.range,
            size: base.size + (this.isElite ? 2 : 0)
        };
    }

    update() {
        this.x += this.vx;
        this.bob += 0.08;
        this.attackCooldown--;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y + Math.sin(this.bob) * 1.5);

        if (this.isEnemy) ctx.scale(-1, 1);

        const accent = this.getAccent();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        if (this.isElite) {
            ctx.save();
            ctx.globalAlpha = 0.75;
            ctx.strokeStyle = this.isEnemy ? 'rgba(244, 63, 94, 0.95)' : 'rgba(34, 211, 238, 0.95)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, -this.size * 0.35, this.size * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.36)';
        ctx.beginPath();
        ctx.ellipse(0, this.size * 0.78, this.size * 1.1, this.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = this.era.color;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        
        if (this.type === UNIT_TYPES.SOLDIER) {
            // Soldier - spear infantry
            ctx.fillStyle = '#6b4f2a';
            ctx.fillRect(-this.size * 0.94, -this.size * 1.05, 3, this.size * 2.2);
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(-this.size * 1.0, -this.size * 1.1);
            ctx.lineTo(-this.size * 0.84, -this.size * 1.4);
            ctx.lineTo(-this.size * 0.68, -this.size * 1.1);
            ctx.fill();
            ctx.fillStyle = this.era.color;
            ctx.fillRect(-this.size * 0.48, -this.size * 1.0, this.size * 0.96, this.size * 1.38);
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(-this.size * 0.2, -this.size * 0.48, this.size * 0.4, this.size * 0.36);
            ctx.strokeStyle = accent;
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.52, -this.size * 0.78);
            ctx.lineTo(this.size * 0.52, -this.size * 0.78);
            ctx.stroke();
        } else if (this.type === UNIT_TYPES.ARCHER) {
            // Archer - bow and robe
            ctx.strokeStyle = accent;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.size * 0.5, -this.size * 0.48, this.size * 0.48, -Math.PI * 0.35, Math.PI * 0.35);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.size * 0.08, -this.size * 0.92);
            ctx.lineTo(this.size * 0.56, -this.size * 0.48);
            ctx.lineTo(this.size * 0.08, -this.size * 0.08);
            ctx.stroke();
            ctx.fillStyle = this.era.color;
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.48, -this.size * 1.06);
            ctx.lineTo(this.size * 0.48, -this.size * 1.06);
            ctx.lineTo(this.size * 0.2, this.size * 0.38);
            ctx.lineTo(-this.size * 0.28, this.size * 0.38);
            ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(-this.size * 0.05, -this.size * 1.25, this.size * 0.26, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === UNIT_TYPES.KNIGHT) {
            // Knight - armor + shield
            ctx.fillStyle = '#9ca3af';
            ctx.fillRect(-this.size * 0.66, -this.size * 1.18, this.size * 1.32, this.size * 1.88);
            ctx.fillStyle = this.era.color;
            ctx.fillRect(-this.size * 0.46, -this.size * 1.0, this.size * 0.92, this.size * 1.16);
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(this.size * 0.6, -this.size * 0.68);
            ctx.lineTo(this.size * 1.0, -this.size * 0.45);
            ctx.lineTo(this.size * 0.95, this.size * 0.2);
            ctx.lineTo(this.size * 0.58, this.size * 0.4);
            ctx.lineTo(this.size * 0.34, this.size * 0.06);
            ctx.fill();
            ctx.fillStyle = this.getAccent();
            ctx.fillRect(-this.size * 0.17, -this.size * 0.92, this.size * 0.34, this.size * 0.38);
        } else if (this.type === UNIT_TYPES.MAGE) {
            // Mage - robe, staff and orb
            ctx.fillStyle = this.era.color;
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.86, -this.size * 0.58);
            ctx.lineTo(this.size * 0.86, -this.size * 0.58);
            ctx.lineTo(this.size * 0.3, this.size * 0.92);
            ctx.lineTo(-this.size * 0.3, this.size * 0.92);
            ctx.fill();
            ctx.strokeStyle = accent;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.size * 0.42, -this.size * 0.92);
            ctx.lineTo(this.size * 0.42, this.size * 0.65);
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.size * 0.42, -this.size * 1.0, this.size * 0.24, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.arc(this.size * 0.42, -this.size * 1.0, this.size * 0.12, 0, Math.PI * 2);
            ctx.fill();
        }

        // Unit label for clarity
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Segoe UI, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.getLabel(), 0, -this.size * 1.9);

        // Type badge
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(0, -this.size * 1.48, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px Segoe UI, Arial, sans-serif';
        ctx.fillText(this.getSymbol(), 0, -this.size * 1.2);

        if (this.isElite) {
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 12px Segoe UI, Arial, sans-serif';
            ctx.fillText('★', 0, -this.size * 2.25);
        }

        // Health bar
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(-this.size * 0.65, -this.size * 1.72, this.size * 1.3, 5);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(-this.size * 0.6, -this.size * 1.65, this.size * 1.2, 3);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-this.size * 0.6, -this.size * 1.65, (this.size * 1.2) * (this.hp / this.maxHp), 3);

        // Enemy marker so both sides are visually distinct at a glance
        if (this.isEnemy) {
            ctx.strokeStyle = 'rgba(251, 113, 133, 0.95)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.size * 0.95, -this.size * 1.42, this.size * 1.9, this.size * 2.0);
        } else {
            ctx.strokeStyle = 'rgba(125, 211, 252, 0.95)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.size * 0.95, -this.size * 1.42, this.size * 1.9, this.size * 2.0);
        }

        ctx.restore();
    }
}

class Game {
    constructor() {
        this.reset();
    }

    getUnitCost(type) {
        if (type === UNIT_TYPES.SOLDIER) return 50;
        if (type === UNIT_TYPES.ARCHER) return 80;
        if (type === UNIT_TYPES.KNIGHT) return 120;
        return 150;
    }

    getAttackCooldown(unit) {
        if (unit.type === UNIT_TYPES.SOLDIER) return 54;
        if (unit.type === UNIT_TYPES.ARCHER) return 72;
        if (unit.type === UNIT_TYPES.KNIGHT) return 82;
        return 90;
    }

    getFuryState(isEnemy) {
        return isEnemy ? this.enemyFury : this.playerFury;
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    calculateDifficultyScale() {
        const waveScale = 1 + Math.min(0.95, (this.wave - 1) * 0.045);
        const hpAdvantage = (this.player.health - this.enemy.health) / 220;
        return this.clamp(waveScale + hpAdvantage, 1, 2.25);
    }

    getDifficultyLabel() {
        if (this.difficultyScale < 1.25) return 'Thường';
        if (this.difficultyScale < 1.6) return 'Khó';
        if (this.difficultyScale < 1.95) return 'Ác Liệt';
        return 'Địa Ngục';
    }

    getEnemyEconomyBonus() {
        return Math.floor((this.difficultyScale - 1) * 7) + Math.floor(this.wave / 4);
    }

    getAiDecisionInterval() {
        const fastByDifficulty = Math.floor((this.difficultyScale - 1) * 52);
        const fastByWave = Math.floor(this.wave * 1.2);
        return Math.max(48, 120 - fastByDifficulty - fastByWave);
    }

    launchRaidWave() {
        if (this.wave < 3) return;

        const raidCount = 2 + Math.floor(this.wave / 4);
        const types = [UNIT_TYPES.SOLDIER, UNIT_TYPES.ARCHER, UNIT_TYPES.KNIGHT, UNIT_TYPES.MAGE];

        for (let i = 0; i < raidCount; i++) {
            const pick = types[Math.floor(Math.random() * types.length)];
            this.spawnUnit(true, pick, {
                skipCostCheck: true,
                xOverride: canvas.width - 130 - (i * 16),
                statMultiplier: 1 + (this.difficultyScale - 1) * 0.35,
                isElite: false
            });
        }

        if (this.wave % 5 === 0) {
            const eliteType = this.wave % 10 === 0 ? UNIT_TYPES.MAGE : UNIT_TYPES.KNIGHT;
            this.spawnUnit(true, eliteType, {
                skipCostCheck: true,
                xOverride: canvas.width - 150,
                statMultiplier: 1.35 + (this.wave / 30),
                isElite: true
            });
            this.showToast('⚠️ Wave Đột Kích: Elite xuất hiện!');
        } else {
            this.showToast('⚠️ Wave Đột Kích: quân địch tăng viện!');
        }
    }

    addFury(isEnemy, amount) {
        const fury = this.getFuryState(isEnemy);
        if (fury.active) return;
        fury.value = Math.min(100, fury.value + amount);
        if (fury.value >= 100) {
            fury.active = true;
            fury.timer = 420;
            fury.value = 0;
            this.showToast(isEnemy ? 'Địch kích hoạt Nộ Chiến!' : 'Bạn kích hoạt Nộ Chiến!');
        }
    }

    createAttackEffect(attacker, targetX, targetY, isCastleHit = false) {
        const accent = attacker.getAccent();
        const sourceX = attacker.x + (attacker.isEnemy ? -attacker.size * 0.8 : attacker.size * 0.8);
        const sourceY = attacker.y - attacker.size * 0.3;

        if (attacker.type === UNIT_TYPES.ARCHER) {
            this.projectiles.push({
                type: 'arrow',
                x: sourceX,
                y: sourceY,
                toX: targetX,
                toY: targetY,
                progress: 0,
                speed: 0.18,
                color: accent,
                life: 22
            });
            return;
        }

        if (attacker.type === UNIT_TYPES.MAGE) {
            this.projectiles.push({
                type: 'orb',
                x: sourceX,
                y: sourceY,
                toX: targetX,
                toY: targetY,
                progress: 0,
                speed: 0.12,
                color: accent,
                life: 26
            });
            return;
        }

        this.attackEffects.push({
            type: attacker.type === UNIT_TYPES.KNIGHT ? 'smash' : 'slash',
            x: targetX,
            y: targetY,
            color: accent,
            life: 12,
            maxLife: 12,
            isCastleHit
        });
    }

    createImpactEffect(x, y, color, isCritical = false) {
        this.attackEffects.push({
            type: isCritical ? 'crit-burst' : 'impact',
            x,
            y,
            color,
            life: isCritical ? 18 : 14,
            maxLife: isCritical ? 18 : 14,
            isCastleHit: false
        });
    }

    reset() {
        // Player data
        this.player = {
            health: 100,
            maxHealth: 100,
            gold: 500,
            era: ERAS.PRIMITIVE,
            units: [],
            castleX: 80
        };

        // Enemy data
        this.enemy = {
            health: 100,
            maxHealth: 100,
            gold: 500,
            era: ERAS.PRIMITIVE,
            units: [],
            castleX: canvas.width - 80
        };

        this.units = [];
        this.wave = 1;
        this.gameOver = false;
        this.gameOverWon = false;
        this.paused = false;
        this.gameSpeed = 1;
        this.waveTimer = 300;
        this.goldTimer = 60;
        this.spawnEffects = [];
        this.attackEffects = [];
        this.projectiles = [];
        this.playerFury = { value: 0, active: false, timer: 0 };
        this.enemyFury = { value: 0, active: false, timer: 0 };
        this.difficultyScale = 1;

        // Enemy AI
        this.aiDecisionTimer = 120;

        this.buildUpgradeButtons();

        this.updateUI();
    }

    update() {
        if (this.paused || this.gameOver) return;

        // Timers
        this.goldTimer--;
        this.waveTimer--;
        this.aiDecisionTimer--;
        this.difficultyScale = this.calculateDifficultyScale();

        // Generate gold
        if (this.goldTimer <= 0) {
            this.player.gold += 10 + this.wave;
            this.enemy.gold += 10 + this.wave + this.getEnemyEconomyBonus();
            this.goldTimer = 60;
        }

        // Update units
        for (let i = this.units.length - 1; i >= 0; i--) {
            const unit = this.units[i];
            unit.update();

            // Out of bounds
            if ((unit.isEnemy && unit.x < -50) || (!unit.isEnemy && unit.x > canvas.width + 50)) {
                this.units.splice(i, 1);
                continue;
            }

            // Find target and attack
            let target = null;
            let minDistance = Infinity;

            if (unit.isEnemy) {
                // Enemy attacks player units or castle
                for (let other of this.units) {
                    if (!other.isEnemy) {
                        const distance = Math.abs(unit.x - other.x);
                        if (distance < unit.range && distance < minDistance) {
                            minDistance = distance;
                            target = other;
                        }
                    }
                }
                // Check player castle
                if (!target) {
                    const castleDistance = Math.abs(unit.x - this.player.castleX);
                    if (castleDistance < unit.range * 1.5 && unit.attackCooldown <= 0) {
                        const fury = this.getFuryState(unit.isEnemy);
                        const dmgMult = fury.active ? 1.35 : 1;
                        this.player.health -= (unit.attack * dmgMult) / 60;
                        const cooldown = this.getAttackCooldown(unit) * (fury.active ? 0.65 : 1);
                        unit.attackCooldown = Math.max(16, cooldown);
                        this.createAttackEffect(unit, this.player.castleX - 32, canvas.height * 0.5, true);
                        this.createImpactEffect(this.player.castleX - 24, canvas.height * 0.5 + 4, '#ef4444');
                    }
                }
            } else {
                // Player units attack enemy units or castle
                for (let other of this.units) {
                    if (other.isEnemy) {
                        const distance = Math.abs(unit.x - other.x);
                        if (distance < unit.range && distance < minDistance) {
                            minDistance = distance;
                            target = other;
                        }
                    }
                }
                // Check enemy castle
                if (!target) {
                    const castleDistance = Math.abs(unit.x - this.enemy.castleX);
                    if (castleDistance < unit.range * 1.5 && unit.attackCooldown <= 0) {
                        const fury = this.getFuryState(unit.isEnemy);
                        const dmgMult = fury.active ? 1.35 : 1;
                        this.enemy.health -= (unit.attack * dmgMult) / 60;
                        const cooldown = this.getAttackCooldown(unit) * (fury.active ? 0.65 : 1);
                        unit.attackCooldown = Math.max(16, cooldown);
                        this.createAttackEffect(unit, this.enemy.castleX + 32, canvas.height * 0.5, true);
                        this.createImpactEffect(this.enemy.castleX + 24, canvas.height * 0.5 + 4, '#fb7185');
                    }
                }
            }

            // Attack target
            if (target && unit.attackCooldown <= 0) {
                const fury = this.getFuryState(unit.isEnemy);
                const cooldown = this.getAttackCooldown(unit) * (fury.active ? 0.65 : 1);
                const critical = Math.random() < 0.14;
                const dmgMult = (fury.active ? 1.3 : 1) * (critical ? 1.75 : 1);
                const damage = unit.attack * dmgMult;

                target.hp -= damage;
                unit.attackCooldown = Math.max(16, cooldown);
                this.createAttackEffect(unit, target.x, target.y - target.size * 0.5, false);
                this.createImpactEffect(target.x, target.y - target.size * 0.45, unit.getAccent(), critical);
                this.addFury(unit.isEnemy, critical ? 6 : 3);

                if (target.hp <= 0) {
                    const eliteBonus = target.isElite ? 40 : 0;
                    const killReward = 20 + (target.era.level * 10) + eliteBonus;
                    if (unit.isEnemy) {
                        this.player.gold += killReward;
                    } else {
                        this.enemy.gold += killReward;
                    }
                    this.addFury(unit.isEnemy, 10);
                }
            }

            // Remove dead units
            if (unit.hp <= 0) {
                this.units.splice(i, 1);
            }
        }

        // Update spawn effects
        for (let i = this.spawnEffects.length - 1; i >= 0; i--) {
            this.spawnEffects[i].life -= 1;
            this.spawnEffects[i].radius += 1.8;
            if (this.spawnEffects[i].life <= 0) {
                this.spawnEffects.splice(i, 1);
            }
        }

        // Update attack effects
        for (let i = this.attackEffects.length - 1; i >= 0; i--) {
            this.attackEffects[i].life -= 1;
            if (this.attackEffects[i].life <= 0) {
                this.attackEffects.splice(i, 1);
            }
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.progress += p.speed;
            p.life -= 1;
            if (p.progress >= 1 || p.life <= 0) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update fury states
        const furyStates = [this.playerFury, this.enemyFury];
        for (const fury of furyStates) {
            if (fury.active) {
                fury.timer -= 1;
                if (fury.timer <= 0) {
                    fury.active = false;
                    fury.timer = 0;
                }
            }
        }

        // AI decision making
        if (this.aiDecisionTimer <= 0) {
            this.aiMakeDecision();
            this.aiDecisionTimer = this.getAiDecisionInterval();
        }

        // Check game over
        if (this.player.health <= 0) {
            this.gameOver = true;
            this.gameOverWon = false;
        }
        if (this.enemy.health <= 0) {
            this.gameOver = true;
            this.gameOverWon = true;
        }

        // Wave progression
        if (this.waveTimer <= 0) {
            this.wave++;
            this.waveTimer = 300;

            if (this.wave % 3 === 0) {
                this.launchRaidWave();
            }
            
            // Increase era after certain waves
            if (this.wave % 5 === 0 && this.wave <= 20) {
                let nextEra = this.wave / 5;
                const eraKeys = Object.keys(ERAS);
                if (nextEra - 1 < eraKeys.length) {
                    this.player.era = ERAS[eraKeys[nextEra - 1]];
                    this.enemy.era = ERAS[eraKeys[nextEra - 1]];
                    this.player.gold += 200;
                    this.enemy.gold += 200;
                }
            }
        }

        this.updateUI();
    }

    aiMakeDecision() {
        // Simple AI: build units based on economy and enemy threat
        if (this.enemy.gold < 50) return;

        let unitToBuild = UNIT_TYPES.SOLDIER;
        
        // Decide unit type based on era
        if (this.enemy.era.level >= 3) {
            unitToBuild = Math.random() > 0.5 ? UNIT_TYPES.MAGE : UNIT_TYPES.KNIGHT;
        } else if (this.enemy.era.level >= 1) {
            unitToBuild = Math.random() > 0.6 ? UNIT_TYPES.ARCHER : UNIT_TYPES.KNIGHT;
        }

        // Spawn if affordable
        const enemyCost = this.getUnitCost(unitToBuild);
        if (this.enemy.gold >= enemyCost) {
            this.spawnUnit(true, unitToBuild);
            this.enemy.gold -= enemyCost;
        }
    }

    spawnUnit(isEnemy, type = UNIT_TYPES.SOLDIER, options = {}) {
        const unitType = type;
        const unitCost = this.getUnitCost(unitType);

        if (!options.skipCostCheck && !isEnemy && (this.gameOver || this.player.gold < unitCost)) {
            return false;
        }

        const laneMin = 100;
        const laneMax = Math.max(laneMin + 40, canvas.height - 100);
        const y = options.yOverride ?? (laneMin + Math.random() * (laneMax - laneMin));
        const x = options.xOverride ?? (isEnemy ? canvas.width - 100 : 100);
        const era = isEnemy ? this.enemy.era : this.player.era;
        
        const unit = new Unit(x, y, unitType, era, isEnemy, {
            statMultiplier: options.statMultiplier || 1,
            isElite: options.isElite || false
        });
        this.units.push(unit);
        this.spawnEffects.push({ x, y, radius: 14, life: 18, isEnemy });
        if (!isEnemy && !options.silent) {
            this.showToast(`Đã ra quân ${UNIT_LABELS[unitType] || 'Lính'}`);
        }
        return true;
    }

    upgradeEra() {
        const eraKeys = Object.keys(ERAS);
        const currentLevel = this.player.era.level;
        
        if (currentLevel < eraKeys.length - 1) {
            const cost = 300 + (currentLevel * 100);
            
            if (this.player.gold >= cost) {
                this.player.gold -= cost;
                this.player.era = ERAS[eraKeys[currentLevel + 1]];
            }
        }
    }

    draw() {
        this.drawBackground();

        // Player castle
        this.drawCastle(this.player.castleX, canvas.height * 0.5, this.player.era.color, false);

        // Enemy castle
        this.drawCastle(this.enemy.castleX, canvas.height * 0.5, this.enemy.era.color, true);

        // Draw units
        for (let unit of this.units) {
            unit.draw();
        }

        this.drawSpawnEffects();
        this.drawProjectiles();
        this.drawAttackEffects();

        // Wave indicator
        ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
        ctx.fillRect(0, 0, canvas.width * (300 - this.waveTimer) / 300, 5);
    }

    drawSpawnEffects() {
        for (const effect of this.spawnEffects) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, effect.life / 18);
            ctx.strokeStyle = effect.isEnemy ? 'rgba(251, 113, 133, 0.85)' : 'rgba(125, 211, 252, 0.9)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = effect.isEnemy ? 'rgba(251, 113, 133, 0.18)' : 'rgba(125, 211, 252, 0.18)';
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    drawProjectiles() {
        for (const projectile of this.projectiles) {
            const px = projectile.x + (projectile.toX - projectile.x) * projectile.progress;
            const py = projectile.y + (projectile.toY - projectile.y) * projectile.progress;
            const alpha = Math.max(0.2, 1 - projectile.progress);

            ctx.save();
            ctx.globalAlpha = alpha;
            if (projectile.type === 'arrow') {
                ctx.strokeStyle = projectile.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(px - 10, py);
                ctx.lineTo(px + 8, py);
                ctx.stroke();

                ctx.fillStyle = '#f8fafc';
                ctx.beginPath();
                ctx.moveTo(px + 8, py);
                ctx.lineTo(px + 2, py - 4);
                ctx.lineTo(px + 2, py + 4);
                ctx.fill();
            } else {
                ctx.fillStyle = projectile.color;
                ctx.shadowColor = projectile.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(px, py, 5.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.beginPath();
                ctx.arc(px - 1, py - 1, 2.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    drawAttackEffects() {
        for (const effect of this.attackEffects) {
            const alpha = Math.max(0, effect.life / effect.maxLife);
            const progress = 1 - alpha;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = effect.color;
            ctx.fillStyle = effect.color;

            if (effect.type === 'slash') {
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, 12 + progress * 12, -0.8, 0.8);
                ctx.stroke();
            } else if (effect.type === 'smash') {
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y + 4, 10 + progress * 18, 0, Math.PI * 2);
                ctx.stroke();
            } else if (effect.type === 'crit-burst') {
                ctx.strokeStyle = '#fde047';
                ctx.lineWidth = 2.5;
                for (let i = 0; i < 7; i++) {
                    const angle = (Math.PI * 2 * i) / 7 + progress * 0.9;
                    const r1 = 3 + progress * 3;
                    const r2 = 12 + progress * 18;
                    ctx.beginPath();
                    ctx.moveTo(effect.x + Math.cos(angle) * r1, effect.y + Math.sin(angle) * r1);
                    ctx.lineTo(effect.x + Math.cos(angle) * r2, effect.y + Math.sin(angle) * r2);
                    ctx.stroke();
                }
            } else {
                ctx.lineWidth = effect.isCastleHit ? 5 : 3;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, 8 + progress * 16, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    drawBackground() {
        const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
        sky.addColorStop(0, '#0d1b2a');
        sky.addColorStop(0.55, '#1b4965');
        sky.addColorStop(1, '#4a6fa5');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sun / moon
        ctx.save();
        ctx.fillStyle = 'rgba(255, 221, 120, 0.9)';
        ctx.beginPath();
        ctx.arc(canvas.width - 140, 90, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Clouds
        const clouds = [
            { x: 130, y: 70, scale: 1.1 },
            { x: canvas.width * 0.42, y: 110, scale: 0.85 },
            { x: canvas.width * 0.7, y: 60, scale: 1.2 }
        ];
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        clouds.forEach(cloud => {
            ctx.save();
            ctx.translate(cloud.x, cloud.y);
            ctx.scale(cloud.scale, cloud.scale);
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.arc(22, -8, 28, 0, Math.PI * 2);
            ctx.arc(50, 0, 20, 0, Math.PI * 2);
            ctx.arc(26, 10, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        const groundTop = canvas.height * 0.8;

        // Distant hills
        ctx.fillStyle = 'rgba(11, 51, 73, 0.55)';
        ctx.beginPath();
        ctx.moveTo(0, groundTop + 8);
        ctx.quadraticCurveTo(canvas.width * 0.2, groundTop - 40, canvas.width * 0.35, groundTop + 2);
        ctx.quadraticCurveTo(canvas.width * 0.52, groundTop - 52, canvas.width * 0.7, groundTop - 6);
        ctx.quadraticCurveTo(canvas.width * 0.86, groundTop - 30, canvas.width, groundTop + 6);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fill();

        // Ground (reduced height)
        const ground = ctx.createLinearGradient(0, groundTop, 0, canvas.height);
        ground.addColorStop(0, '#517c4d');
        ground.addColorStop(1, '#2f5133');
        ctx.fillStyle = ground;
        ctx.fillRect(0, groundTop, canvas.width, canvas.height - groundTop);

        // Grass blades / texture
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, groundTop);
            ctx.lineTo(i + 8, groundTop - 14);
            ctx.stroke();
        }
    }

    drawCastle(x, y, color, isEnemy) {
        ctx.save();
        ctx.translate(x, y);
        
        if (isEnemy) ctx.scale(-1, 1);

        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 6;

        // Main tower
        const tower = ctx.createLinearGradient(-50, -90, 50, 50);
        tower.addColorStop(0, color);
        tower.addColorStop(0.6, '#2c2c2c');
        tower.addColorStop(1, '#121212');
        ctx.fillStyle = tower;
        ctx.fillRect(-44, -84, 88, 124);

        // Side towers
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(-60, -62, 16, 42);
        ctx.fillRect(44, -62, 16, 42);

        // Battlements
        ctx.fillStyle = color;
        for (let i = -44; i <= 26; i += 18) {
            ctx.fillRect(i, -92, 12, 12);
        }

        // Roof
        const roof = ctx.createLinearGradient(-50, -130, 50, -70);
        roof.addColorStop(0, '#fbbf24');
        roof.addColorStop(1, '#7c2d12');
        ctx.fillStyle = roof;
        ctx.beginPath();
        ctx.moveTo(-56, -84);
        ctx.lineTo(0, -130);
        ctx.lineTo(56, -84);
        ctx.fill();

        // Roof trim
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Flag
        ctx.fillStyle = color;
        ctx.fillRect(-5, -140, 10, 60);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(5, -140);
        ctx.lineTo(28, -132);
        ctx.lineTo(5, -123);
        ctx.fill();

        // Door and windows
        ctx.fillStyle = '#301f12';
        ctx.fillRect(-14, -24, 28, 64);
        ctx.fillStyle = '#5a3a22';
        ctx.fillRect(-11, -21, 22, 58);
        ctx.fillStyle = 'rgba(255, 240, 170, 0.8)';
        ctx.fillRect(-30, -56, 14, 16);
        ctx.fillRect(16, -56, 14, 16);
        ctx.fillRect(-8, -44, 16, 10);

        // Stone lines
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        for (let i = -42; i <= 38; i += 12) {
            ctx.beginPath();
            ctx.moveTo(i, -64);
            ctx.lineTo(i, 34);
            ctx.stroke();
        }

        // Walls
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(-52, -84, 52, 84);
        ctx.strokeRect(0, -84, 52, 84);

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.restore();
    }

    buildUpgradeButtons() {
        const grid = document.getElementById('upgradesGrid');
        grid.innerHTML = '';

        UNIT_CONFIGS.forEach((upgrade) => {
            const btn = document.createElement('button');
            btn.className = 'upgrade-btn';
            btn.dataset.type = String(upgrade.type);
            btn.innerHTML = `${upgrade.name}<span class="upgrade-cost">💰${upgrade.cost}</span>`;

            btn.addEventListener('click', () => {
                if (upgrade.type === 'era') {
                    game.upgradeEra();
                    game.showToast('Nâng cấp kỷ nguyên');
                } else if (!game.gameOver && !game.paused) {
                    const spawned = game.spawnUnit(false, upgrade.type);
                    if (spawned) {
                        game.player.gold -= upgrade.cost;
                    } else {
                        game.showToast('Không đủ vàng để ra quân');
                    }
                }
                game.updateUpgradeButtonStates();
            });

            grid.appendChild(btn);
        });

        this.updateUpgradeButtonStates();
    }

    updateUpgradeButtonStates() {
        const buttons = document.querySelectorAll('.upgrade-btn');
        buttons.forEach((btn, index) => {
            const upgrade = UNIT_CONFIGS[index];
            const canAfford = this.player.gold >= upgrade.cost;
            btn.disabled = !canAfford || this.gameOver;

            if (!btn.disabled) {
                btn.style.outline = 'none';
            }
        });
    }

    showToast(message) {
        let toast = document.getElementById('gameToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gameToast';
            toast.style.position = 'fixed';
            toast.style.left = '50%';
            toast.style.bottom = '120px';
            toast.style.transform = 'translateX(-50%)';
            toast.style.padding = '10px 16px';
            toast.style.borderRadius = '999px';
            toast.style.background = 'rgba(15, 23, 42, 0.88)';
            toast.style.border = '1px solid rgba(255,255,255,0.16)';
            toast.style.color = '#fff';
            toast.style.fontWeight = '700';
            toast.style.zIndex = '30';
            toast.style.boxShadow = '0 14px 30px rgba(0,0,0,0.35)';
            toast.style.pointerEvents = 'none';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
        }, 1200);
    }

    updateUI() {
        // Player stats
        document.getElementById('playerHealth').style.width = (this.player.health / this.player.maxHealth) * 100 + '%';
        document.getElementById('playerHealthText').textContent = Math.max(0, Math.floor(this.player.health)) + '/' + this.player.maxHealth;
        document.getElementById('playerGold').textContent = Math.floor(this.player.gold);
        document.getElementById('playerUnits').textContent = this.units.filter(u => !u.isEnemy).length;
        document.getElementById('playerEra').textContent = this.player.era.name;

        // Enemy stats
        document.getElementById('enemyHealth').style.width = (this.enemy.health / this.enemy.maxHealth) * 100 + '%';
        document.getElementById('enemyHealthText').textContent = Math.max(0, Math.floor(this.enemy.health)) + '/' + this.enemy.maxHealth;
        document.getElementById('enemyGold').textContent = Math.floor(this.enemy.gold);
        document.getElementById('enemyUnits').textContent = this.units.filter(u => u.isEnemy).length;
        document.getElementById('enemyEra').textContent = this.enemy.era.name;

        // Wave
        const furyIconPlayer = this.playerFury.active ? '🔥' : '⚡';
        const furyIconEnemy = this.enemyFury.active ? '🔥' : '⚡';
        const furyPlayerText = this.playerFury.active ? 'Nộ' : `${Math.floor(this.playerFury.value)}%`;
        const furyEnemyText = this.enemyFury.active ? 'Nộ' : `${Math.floor(this.enemyFury.value)}%`;
        const diffLabel = this.getDifficultyLabel();
        document.getElementById('waveText').textContent = `Sóng ${this.wave} | ${diffLabel} | Bạn ${furyIconPlayer}${furyPlayerText} - Địch ${furyIconEnemy}${furyEnemyText}`;

        // Game over
        if (this.gameOver) {
            const screen = document.getElementById('gameOverScreen');
            screen.classList.remove('hidden');
            document.getElementById('gameOverTitle').textContent = this.gameOverWon ? 'Bạn Thắng! 🎉' : 'Bạn Thua! 💔';
            document.getElementById('gameOverText').textContent = this.gameOverWon ? 
                `Lâu đài địch bị phá huỷ ở sóng ${this.wave}!` : 
                `Lâu đài của bạn bị chiếm lấy ở sóng ${this.wave}!`;
        }
    }
}

// Game instance
let game;
resizeCanvas();
game = new Game();

// Event listeners
document.getElementById('pauseBtn').addEventListener('click', function() {
    game.paused = !game.paused;
    this.textContent = game.paused ? '▶ Tiếp Tục' : '⏸ Tạm Dừng';
});

document.getElementById('resetBtn').addEventListener('click', () => {
    game = new Game();
    document.getElementById('gameOverScreen').classList.add('hidden');
});

document.getElementById('speedBtn').addEventListener('click', function() {
    game.gameSpeed = game.gameSpeed === 1 ? 2 : 1;
    this.textContent = game.gameSpeed === 1 ? '⏩ Tốc Độ' : '⏸ Bình Thường';
});

window.addEventListener('resize', () => {
    resizeCanvas();
});

// Game loop
function gameLoop() {
    for (let i = 0; i < game.gameSpeed; i++) {
        game.update();
    }
    game.draw();
    game.updateUpgradeButtonStates();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
