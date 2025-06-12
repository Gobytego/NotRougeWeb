// --- Game Constants ---
const SAVE_FILE_KEY = "notrouge_save_data"; // Key for localStorage
const STARTING_GOLD = 100;
const STARTING_HEALTH = 100;
const STARTING_ATTACK = 10;
const STARTING_DEFENSE = 5;
const BASE_EXP_TO_LEVEL = 100;
const EXP_PER_LEVEL_MULTIPLIER = 1.5;
const SELL_PRICE_MULTIPLIER = 0.5; // Items sell for half their cost

// --- DOM Elements ---
const gameLogElement = document.getElementById('game-log');
const statsDisplayElement = document.getElementById('player-stats-display');
const buttonContainer = document.getElementById('button-container');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalMessage = document.getElementById('modal-message');
const modalYesBtn = document.getElementById('modal-yes-btn');
const modalNoBtn = document.getElementById('modal-no-btn');

// --- Game State ---
let player = null;
let currentEnemy = null;
let autoAttackInterval = null;
let shopItemsDisplay = []; // Items currently displayed in the shop

// --- Game Data (Embedded from NotRouge_Items.txt and NotRouge_Enemies.txt) ---
const ITEMS_DATA = [
    // Weapons
    { name: "Rusty Sword", item_type: "weapon", cost: 50, attack_bonus: 10, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Dagger of Swiftness", item_type: "weapon", cost: 90, attack_bonus: 7, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Steel Broadsword", item_type: "weapon", cost: 180, attack_bonus: 15, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Great Axe", item_type: "weapon", cost: 250, attack_bonus: 20, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Magic Staff", item_type: "weapon", cost: 300, attack_bonus: 12, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Elven Bow", item_type: "weapon", cost: 200, attack_bonus: 13, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Claymore", item_type: "weapon", cost: 320, attack_bonus: 22, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "War Hammer", item_type: "weapon", cost: 280, attack_bonus: 18, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Dragonfang Dagger", item_type: "weapon", cost: 400, attack_bonus: 25, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Legendary Sword", item_type: "weapon", cost: 500, attack_bonus: 30, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Poisoned Shiv", item_type: "weapon", cost: 70, attack_bonus: 8, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Spiked Club", item_type: "weapon", cost: 60, attack_bonus: 9, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Hunter's Bow", item_type: "weapon", cost: 120, attack_bonus: 10, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Goblin Dagger", item_type: "weapon", cost: 30, attack_bonus: 5, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Stone Club", item_type: "weapon", cost: 45, attack_bonus: 7, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Longsword", item_type: "weapon", cost: 150, attack_bonus: 12, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Battle Axe", item_type: "weapon", cost: 210, attack_bonus: 16, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Short Bow", item_type: "weapon", cost: 80, attack_bonus: 7, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Obsidian Blade", item_type: "weapon", cost: 380, attack_bonus: 28, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },

    // Armor
    { name: "Leather Armor", item_type: "armor", cost: 75, attack_bonus: 0, defense_bonus: 5, health_bonus: 0, heal_amount: 0 },
    { name: "Iron Helmet", item_type: "armor", cost: 120, attack_bonus: 0, defense_bonus: 8, health_bonus: 0, heal_amount: 0 },
    { name: "Chainmail Armor", item_type: "armor", cost: 220, attack_bonus: 0, defense_bonus: 12, health_bonus: 0, heal_amount: 0 },
    { name: "Plate Armor", item_type: "armor", cost: 350, attack_bonus: 0, defense_bonus: 18, health_bonus: 0, heal_amount: 0 },
    { name: "Iron Shield", item_type: "armor", cost: 100, attack_bonus: 0, defense_bonus: 6, health_bonus: 0, heal_amount: 0 },
    { name: "Cloak of Shadows", item_type: "armor", cost: 160, attack_bonus: 0, defense_bonus: 7, health_bonus: 0, heal_amount: 0 },
    { name: "Studded Leather", item_type: "armor", cost: 140, attack_bonus: 0, defense_bonus: 9, health_bonus: 0, heal_amount: 0 },
    { name: "Scale Mail", item_type: "armor", cost: 280, attack_bonus: 0, defense_bonus: 15, health_bonus: 0, heal_amount: 0 },
    { name: "Mithril Chainmail", item_type: "armor", cost: 450, attack_bonus: 0, defense_bonus: 25, health_bonus: 0, heal_amount: 0 },
    { name: "Holy Armor", item_type: "armor", cost: 600, attack_bonus: 0, defense_bonus: 30, health_bonus: 0, heal_amount: 0 },
    { name: "Crude Shield", item_type: "armor", cost: 40, attack_bonus: 0, defense_bonus: 3, health_bonus: 0, heal_amount: 0 },
    { name: "Woven Robe", item_type: "armor", cost: 30, attack_bonus: 0, defense_bonus: 2, health_bonus: 0, heal_amount: 0 },
    { name: "Wooden Shield", item_type: "armor", cost: 25, attack_bonus: 0, defense_bonus: 2, health_bonus: 0, heal_amount: 0 },
    { name: "Rough Tunic", item_type: "armor", cost: 20, attack_bonus: 0, defense_bonus: 1, health_bonus: 0, heal_amount: 0 },
    { name: "Splint Mail", item_type: "armor", cost: 200, attack_bonus: 0, defense_bonus: 10, health_bonus: 0, heal_amount: 0 },
    { name: "Cap of Stealth", item_type: "armor", cost: 130, attack_bonus: 0, defense_bonus: 4, health_bonus: 0, heal_amount: 0 },
    { name: "Gothic Plate", item_type: "armor", cost: 400, attack_bonus: 0, defense_bonus: 20, health_bonus: 0, heal_amount: 0 },
    { name: "Hardened Leather", item_type: "armor", cost: 110, attack_bonus: 0, defense_bonus: 7, health_bonus: 0, heal_amount: 0 },
    { name: "Shadow Weave Armor", item_type: "armor", cost: 300, attack_bonus: 0, defense_bonus: 16, health_bonus: 0, heal_amount: 0 },

    // Accessories
    { name: "Ring of Health", item_type: "accessory", cost: 150, attack_bonus: 0, defense_bonus: 0, health_bonus: 20, heal_amount: 0 },
    { name: "Amulet of Protection", item_type: "accessory", cost: 200, attack_bonus: 0, defense_bonus: 3, health_bonus: 10, heal_amount: 0 },
    { name: "Ring of Power", item_type: "accessory", cost: 280, attack_bonus: 5, defense_bonus: 5, health_bonus: 0, heal_amount: 0 },
    { name: "Orb of Wisdom", item_type: "accessory", cost: 320, attack_bonus: 0, defense_bonus: 0, health_bonus: 15, heal_amount: 0 },
    { name: "Ancient Ring", item_type: "accessory", cost: 450, attack_bonus: 7, defense_bonus: 7, health_bonus: 30, heal_amount: 0 },
    { name: "Lucky Charm", item_type: "accessory", cost: 80, attack_bonus: 0, defense_bonus: 0, health_bonus: 5, heal_amount: 0 },
    { name: "Copper Ring", item_type: "accessory", cost: 50, attack_bonus: 0, defense_bonus: 0, health_bonus: 3, heal_amount: 0 },
    { name: "Gauntlets of Strength", item_type: "accessory", cost: 170, attack_bonus: 8, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Boots of Agility", item_type: "accessory", cost: 160, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 0 },
    { name: "Orb of Protection", item_type: "accessory", cost: 250, attack_bonus: 0, defense_bonus: 10, health_bonus: 0, heal_amount: 0 },
    { name: "Shiny Ring", item_type: "accessory", cost: 100, attack_bonus: 2, defense_bonus: 2, health_bonus: 0, heal_amount: 0 },
    { name: "Crown of Kings", item_type: "accessory", cost: 500, attack_bonus: 10, defense_bonus: 10, health_bonus: 50, heal_amount: 0 },

    // Consumables
    { name: "Healing Potion", item_type: "consumable", cost: 20, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 50 },
    { name: "Minor Healing Potion", item_type: "consumable", cost: 10, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 25 },
    { name: "Greater Healing Potion", item_type: "consumable", cost: 50, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 100 },
    { name: "Mana Potion", item_type: "consumable", cost: 30, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 0 }, // Placeholder
    { name: "Super Healing Potion", item_type: "consumable", cost: 80, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 150 },
    { name: "Phoenix Feather", item_type: "consumable", cost: 100, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 200 },
    { name: "Bandage", item_type: "consumable", cost: 5, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 10 },
    { name: "Small Potion", item_type: "consumable", cost: 15, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 30 },
    { name: "Health Vial", item_type: "consumable", cost: 40, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 70 },
    { name: "Vial of Anti-Venom", item_type: "consumable", cost: 25, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 0 }, // Placeholder
    { name: "Mystic Brew", item_type: "consumable", cost: 60, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 120 },
    { name: "Tome of Healing", item_type: "consumable", cost: 70, attack_bonus: 0, defense_bonus: 0, health_bonus: 0, heal_amount: 140 }
];

const ENEMIES_DATA = [
    { name: "Goblin", health: 50, attack: 10, defense: 2, gold_drop: 10, exp_drop: 20 },
    { name: "Orc", health: 70, attack: 15, defense: 5, gold_drop: 20, exp_drop: 35 },
    { name: "Slime", health: 30, attack: 7, defense: 0, gold_drop: 5, exp_drop: 10 },
    { name: "Wolf", health: 60, attack: 12, defense: 3, gold_drop: 15, exp_drop: 25 },
    { name: "Skeleton Archer", health: 55, attack: 13, defense: 4, gold_drop: 18, exp_drop: 30 },
    { name: "Giant Spider", health: 65, attack: 11, defense: 3, gold_drop: 12, exp_drop: 28 },
    { name: "Bandit", health: 80, attack: 17, defense: 6, gold_drop: 25, exp_drop: 40 },
    { name: "Dire Wolf", health: 75, attack: 18, defense: 4, gold_drop: 22, exp_drop: 38 },
    { name: "Zombie", health: 45, attack: 9, defense: 1, gold_drop: 8, exp_drop: 15 },
    { name: "Cave Bat", health: 35, attack: 8, defense: 0, gold_drop: 7, exp_drop: 12 },
    { name: "Stone Golem", health: 150, attack: 25, defense: 15, gold_drop: 50, exp_drop: 100 },
    { name: "Dark Elf Rogue", health: 90, attack: 20, defense: 7, gold_drop: 30, exp_drop: 50 },
    { name: "Gnoll Warrior", health: 85, attack: 16, defense: 6, gold_drop: 28, exp_drop: 45 },
    { name: "Harpy", health: 60, attack: 14, defense: 2, gold_drop: 18, exp_drop: 32 },
    { name: "Ogre", health: 120, attack: 22, defense: 10, gold_drop: 40, exp_drop: 70 },
    { name: "Imp", health: 25, attack: 6, defense: 0, gold_drop: 5, exp_drop: 8 },
    { name: "Wight", health: 100, attack: 19, defense: 8, gold_drop: 35, exp_drop: 60 },
    { name: "Fire Elemental", health: 110, attack: 21, defense: 9, gold_drop: 38, exp_drop: 65 },
    { name: "Ice Elemental", health: 115, attack: 20, defense: 11, gold_drop: 40, exp_drop: 68 },
    { name: "Earth Elemental", health: 130, attack: 23, defense: 12, gold_drop: 45, exp_drop: 75 },
    { name: "Shadow Lurker", health: 70, attack: 16, defense: 5, gold_drop: 20, exp_drop: 30 },
    { name: "Venomous Snake", health: 40, attack: 9, defense: 1, gold_drop: 8, exp_drop: 15 },
    { name: "Berserker Orc", health: 95, attack: 25, defense: 5, gold_drop: 32, exp_drop: 55 },
    { name: "Elder Goblin", health: 60, attack: 12, defense: 3, gold_drop: 15, exp_drop: 28 },
    { name: "Frost Troll", health: 140, attack: 28, defense: 14, gold_drop: 48, exp_drop: 90 },
    { name: "Swamp Monster", health: 105, attack: 18, defense: 7, gold_drop: 33, exp_drop: 58 },
    { name: "Goblin Shaman", health: 55, attack: 11, defense: 3, gold_drop: 12, exp_drop: 25 },
    { name: "Ghost", health: 80, attack: 15, defense: 7, gold_drop: 28, exp_drop: 48 },
    { name: "Minotaur", health: 160, attack: 30, defense: 18, gold_drop: 60, exp_drop: 120 },
    { name: "Dragon Whelp", health: 130, attack: 24, defense: 13, gold_drop: 55, exp_drop: 95 },
    { name: "Giant Ant", health: 50, attack: 10, defense: 3, gold_drop: 10, exp_drop: 20 },
    { name: "Carrion Crawler", health: 90, attack: 17, defense: 6, gold_drop: 27, exp_drop: 42 },
    { name: "Specter", health: 75, attack: 14, defense: 6, gold_drop: 25, exp_drop: 40 },
    { name: "Griffin", health: 110, attack: 20, defense: 9, gold_drop: 37, exp_drop: 62 },
    { name: "Basilisk", health: 125, attack: 26, defense: 15, gold_drop: 52, exp_drop: 88 },
    { name: "Manticore", health: 135, attack: 27, defense: 16, gold_drop: 58, exp_drop: 98 },
    { name: "Vampire", health: 145, attack: 29, defense: 17, gold_drop: 65, exp_drop: 110 },
    { name: "Werewolf", health: 100, attack: 23, defense: 8, gold_drop: 36, exp_drop: 63 },
    { name: "Gargoyle", health: 95, attack: 20, defense: 10, gold_drop: 34, exp_drop: 59 },
    { name: "Abominable Snowman", health: 170, attack: 32, defense: 20, gold_drop: 70, exp_drop: 130 },
    { name: "Dark Knight", health: 180, attack: 35, defense: 22, gold_drop: 75, exp_drop: 140 },
    { name: "Lich", health: 160, attack: 30, defense: 15, gold_drop: 68, exp_drop: 125 },
    { name: "Wyvern", health: 150, attack: 28, defense: 14, gold_drop: 62, exp_drop: 105 },
    { name: "Gnome Trickster", health: 40, attack: 10, defense: 1, gold_drop: 10, exp_drop: 18 },
    { name: "Hobgoblin Sergeant", health: 85, attack: 17, defense: 7, gold_drop: 26, exp_drop: 44 },
    { name: "Goblin King", health: 120, attack: 20, defense: 8, gold_drop: 45, exp_drop: 80 },
    { name: "Giant Worm", health: 110, attack: 18, defense: 9, gold_drop: 30, exp_drop: 50 },
    { name: "Stonewalker", health: 90, attack: 20, defense: 12, gold_drop: 35, exp_drop: 60 },
    { name: "Forest Spirit", health: 70, attack: 15, defense: 4, gold_drop: 20, exp_drop: 30 },
    { name: "Deep One", health: 100, attack: 22, defense: 10, gold_drop: 40, exp_drop: 70 },
    { name: "Shadow Beast", health: 120, attack: 25, defense: 13, gold_drop: 50, exp_drop: 85 },
    { name: "Crystal Spider", health: 70, attack: 13, defense: 5, gold_drop: 25, exp_drop: 40 },
    { name: "Dust Devil", health: 40, attack: 8, defense: 0, gold_drop: 10, exp_drop: 15 },
    { name: "Desert Scorpion", health: 60, attack: 11, defense: 3, gold_drop: 15, exp_drop: 28 },
    { name: "Sandworm", health: 140, attack: 26, defense: 16, gold_drop: 55, exp_drop: 95 },
    { name: "Frost Giant", health: 200, attack: 38, defense: 25, gold_drop: 80, exp_drop: 150 },
    { name: "Fire Giant", health: 210, attack: 40, defense: 26, gold_drop: 85, exp_drop: 160 },
    { name: "Storm Giant", health: 220, attack: 42, defense: 27, gold_drop: 90, exp_drop: 170 },
    { name: "Ancient Dragon", health: 300, attack: 50, defense: 30, gold_drop: 150, exp_drop: 200 }
];


// --- Core Game Classes (JavaScript equivalents) ---

class Player {
    constructor(name = "Hero") {
        this.name = name;
        this.level = 1;
        this.experience = 0;
        this.max_health = STARTING_HEALTH;
        this.current_health = STARTING_HEALTH;
        this.attack = STARTING_ATTACK;
        this.defense = STARTING_DEFENSE;
        this.gold = STARTING_GOLD;
        this.inventory = []; // List of Item objects
        this.equipped = {
            "weapon": null,
            "armor": null,
            "accessory": null
        };
    }

    gainExp(expGained) {
        updateGameLog(`You gained ${expGained} experience!`);
        this.experience += expGained;
        while (this.experience >= calculateLevelUpExp(this.level)) {
            this.experience -= calculateLevelUpExp(this.level);
            this.levelUp();
        }
        updateStatsDisplay();
    }

    levelUp() {
        this.level += 1;
        this.max_health += 15;
        this.current_health = this.max_health; // Fully heal on level up
        this.attack += 3;
        this.defense += 2;
        updateGameLog(`\n*** You leveled up to Level ${this.level}! ***`);
        updateGameLog("Health +15, Attack +3, Defense +2.");
        updateGameLog("You feel stronger!");
    }

    takeDamage(damage) {
        const effectiveDamage = Math.max(0, damage - this.defense);
        this.current_health -= effectiveDamage;
        updateGameLog(`You took ${effectiveDamage} damage!`);
        updateStatsDisplay();
        if (this.current_health <= 0) {
            this.current_health = 0;
            return true; // Player is dead
        }
        return false; // Player is still alive
    }

    heal(amount) {
        const oldHealth = this.current_health;
        this.current_health = Math.min(this.max_health, this.current_health + amount);
        const healedAmount = this.current_health - oldHealth;
        updateGameLog(`You healed ${healedAmount} health. Current health: ${this.current_health}/${this.max_health}`);
        updateStatsDisplay();
    }

    equipItem(item) {
        if (this.equipped.hasOwnProperty(item.item_type)) {
            const oldItem = this.equipped[item.item_type];
            if (oldItem) {
                // Unequip old item's stats
                this.attack -= oldItem.attack_bonus;
                this.defense -= oldItem.defense_bonus;
                this.max_health -= oldItem.health_bonus;
                this.current_health = Math.min(this.current_health, this.max_health); // Adjust current health if max decreased
                this.inventory.push(oldItem); // Move old item back to inventory
                updateGameLog(`Unequipped ${oldItem.name}.`);
            }

            // Equip new item
            this.equipped[item.item_type] = item;
            this.attack += item.attack_bonus;
            this.defense += item.defense_bonus;
            this.max_health += item.health_bonus;
            this.current_health = Math.min(this.current_health, this.max_health); // Ensure current health doesn't exceed new max
            this.inventory = this.inventory.filter(invItem => invItem !== item); // Remove from inventory
            updateGameLog(`Equipped ${item.name}.`);
        } else {
            updateGameLog(`Cannot equip ${item.name}. It's not a recognized equipment type.`);
        }
        updateStatsDisplay();
    }

    // Convert player object to a plain object for saving
    toSerializableObject() {
        return {
            name: this.name,
            level: this.level,
            experience: this.experience,
            max_health: this.max_health,
            current_health: this.current_health,
            attack: this.attack,
            defense: this.defense,
            gold: this.gold,
            inventory: this.inventory.map(item => item.toSerializableObject()),
            equipped: {
                weapon: this.equipped.weapon ? this.equipped.weapon.toSerializableObject() : null,
                armor: this.equipped.armor ? this.equipped.armor.toSerializableObject() : null,
                accessory: this.equipped.accessory ? this.equipped.accessory.toSerializableObject() : null
            }
        };
    }
}

class Item {
    constructor(data) {
        this.name = data.name;
        this.item_type = data.item_type;
        this.cost = data.cost;
        this.attack_bonus = data.attack_bonus || 0;
        this.defense_bonus = data.defense_bonus || 0;
        this.health_bonus = data.health_bonus || 0;
        this.heal_amount = data.heal_amount || 0;
    }

    // Convert item object to a plain object for saving
    toSerializableObject() {
        return {
            name: this.name,
            item_type: this.item_type,
            cost: this.cost,
            attack_bonus: this.attack_bonus,
            defense_bonus: this.defense_bonus,
            health_bonus: this.health_bonus,
            heal_amount: this.heal_amount
        };
    }
}

class Enemy {
    constructor(data) {
        this.name = data.name;
        this.health = data.health;
        this.attack = data.attack;
        this.defense = data.defense;
        this.gold_drop = data.gold_drop;
        this.exp_drop = data.exp_drop;
        this.health_full = data.health; // Store original health for combat display
    }

    takeDamage(damage) {
        const effectiveDamage = Math.max(0, damage - this.defense);
        this.health -= effectiveDamage;
        updateGameLog(`The ${this.name} took ${effectiveDamage} damage!`);
        if (this.health <= 0) {
            this.health = 0;
            return true; // Enemy is dead
        }
        return false; // Enemy is still alive
    }
}

// --- Utility Functions ---

function calculateLevelUpExp(level) {
    return Math.ceil(BASE_EXP_TO_LEVEL * (EXP_PER_LEVEL_MULTIPLIER ** (level - 1)));
}

function updateGameLog(message) {
    gameLogElement.textContent += `\n${message}`;
    gameLogElement.scrollTop = gameLogElement.scrollHeight; // Scroll to bottom
}

function updateStatsDisplay() {
    if (player) {
        const weaponName = player.equipped.weapon ? player.equipped.weapon.name : 'None';
        const armorName = player.equipped.armor ? player.equipped.armor.name : 'None';
        const accessoryName = player.equipped.accessory ? player.equipped.accessory.name : 'None';

        statsDisplayElement.textContent = `
Name: ${player.name}
Level: ${player.level} (EXP: ${player.experience}/${calculateLevelUpExp(player.level)})
HP: ${player.current_health}/${player.max_health}
ATK: ${player.attack}
DEF: ${player.defense}
Gold: ${player.gold}

Equipped Gear:
Weapon: ${weaponName}
Armor: ${armorName}
Accessory: ${accessoryName}
        `;
    } else {
        statsDisplayElement.textContent = "No player data.";
    }
}

function showButtons(buttonGroup) {
    // Clear existing buttons
    buttonContainer.innerHTML = '';

    const createButton = (text, onClickHandler, isDynamic = false) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(
            'bg-purple-700', 'hover:bg-purple-800', 'text-white', 'font-bold',
            'py-2', 'px-4', 'rounded', 'transition-colors', 'duration-200', 'flex-grow', 'md:flex-none'
        );
        button.onclick = onClickHandler;
        buttonContainer.appendChild(button);
    };

    switch (buttonGroup) {
        case 'main_menu':
            createButton("New Game", startNewGame);
            createButton("Load Game", loadGame);
            createButton("Exit", () => updateGameLog("Thanks for playing! You can close this tab."));
            break;
        case 'town':
            createButton("Visit Shop", showShopMenu);
            createButton("Enter Dungeon", startDungeon);
            createButton("Inventory", showInventoryMenu);
            createButton("Save Game", () => saveGame(player));
            createButton("Exit Game", () => updateGameLog("Thanks for playing! You can close this tab."));
            break;
        case 'shop_buy':
            shopItemsDisplay.forEach((item, index) => {
                createButton(`Buy ${item.name} (${item.cost}g)`, () => buyShopItem(item));
            });
            createButton("Sell Item", showSellItemsMenu);
            createButton("Back to Town", showTownMenu);
            break;
        case 'shop_sell':
            const sellableItems = player.inventory.filter(item => !Object.values(player.equipped).includes(item));
            if (sellableItems.length > 0) {
                sellableItems.forEach(item => {
                    const sellPrice = Math.floor(item.cost * SELL_PRICE_MULTIPLIER);
                    createButton(`Sell ${item.name} (${sellPrice}g)`, () => confirmAction(`Sell ${item.name} for ${sellPrice} gold?`, () => sellItemAction(item)));
                });
            } else {
                updateGameLog("You have no sellable items in your inventory.");
            }
            createButton("Back to Shop", () => showShopMenu(false));
            break;
        case 'inventory_manage':
            player.inventory.forEach(item => {
                const actionText = item.item_type === "consumable" ? "Use" : "Equip";
                createButton(`${actionText} ${item.name}`, () => handleInventoryItemAction(item));
                if (!Object.values(player.equipped).includes(item)) { // Can't throw away equipped items
                     createButton(`Discard ${item.name}`, () => confirmAction(`Are you sure you want to discard ${item.name}? This cannot be undone!`, () => throwAwayItemAction(item)));
                }
            });
            createButton("Back to Town", showTownMenu);
            break;
        case 'combat':
            createButton("Attack", () => combatAction("attack"));
            createButton("Use Item", showCombatItemMenu);
            createButton("Flee", () => combatAction("flee"));
            createButton("Auto-Attack", () => combatAction("auto_attack"));
            break;
        case 'combat_item_use':
            const consumables = player.inventory.filter(item => item.item_type === "consumable");
            if (consumables.length > 0) {
                consumables.forEach(item => {
                    createButton(`Use ${item.name} (Heals: ${item.heal_amount})`, () => useCombatItem(item));
                });
            } else {
                updateGameLog("You have no usable items.");
            }
            createButton("Back to Combat", showCombatMenu);
            break;
        case 'dungeon_continue':
            createButton("Continue Exploring", dungeonNextRoom);
            createButton("Retreat to Town", showTownMenu);
            break;
        default:
            break;
    }
}

// Custom confirmation modal
function confirmAction(message, onConfirm, onCancel = null) {
    modalMessage.textContent = message;
    modalBackdrop.classList.remove('hidden');

    const handleYes = () => {
        modalBackdrop.classList.add('hidden');
        modalYesBtn.removeEventListener('click', handleYes);
        modalNoBtn.removeEventListener('click', handleNo);
        onConfirm();
    };

    const handleNo = () => {
        modalBackdrop.classList.add('hidden');
        modalYesBtn.removeEventListener('click', handleYes);
        modalNoBtn.removeEventListener('click', handleNo);
        if (onCancel) onCancel();
    };

    modalYesBtn.addEventListener('click', handleYes);
    modalNoBtn.addEventListener('click', handleNo);
}

// --- Game Persistence ---

function saveGame() {
    try {
        const serializablePlayer = player.toSerializableObject();
        localStorage.setItem(SAVE_FILE_KEY, JSON.stringify(serializablePlayer));
        updateGameLog("Game saved successfully!");
    } catch (e) {
        updateGameLog(`Error saving game: ${e}`);
    }
}

function loadGame() {
    try {
        const savedData = localStorage.getItem(SAVE_FILE_KEY);
        if (savedData) {
            const playerData = JSON.parse(savedData);
            player = new Player(playerData.name);
            Object.assign(player, playerData); // Copy saved properties

            // Reconstruct inventory and equipped items as Item objects
            player.inventory = playerData.inventory.map(itemData => new Item(itemData));
            for (const slot in playerData.equipped) {
                if (playerData.equipped[slot]) {
                    player.equipped[slot] = new Item(playerData.equipped[slot]);
                } else {
                    player.equipped[slot] = null;
                }
            }
            updateGameLog("Game loaded successfully!");
            updateStatsDisplay();
            showTownMenu();
        } else {
            updateGameLog("No saved game found. Please start a new game.");
            showMainMenu();
        }
    } catch (e) {
        updateGameLog(`Error loading game: ${e}`);
        showMainMenu();
    }
}

// --- Game Events and Menus ---

function handleDeath() {
    updateGameLog("You have been defeated!");
    updateGameLog("But your adventure doesn't end here...");

    // Apply persistence rules
    player.gold = Math.floor(player.gold / 2);
    updateGameLog(`You kept half your gold: ${player.gold} gold remaining.`);

    let keptEquipment = null;
    const allEquipment = Object.values(player.equipped).filter(item => item !== null).concat(player.inventory);
    const equippableItems = allEquipment.filter(item => item && item.item_type !== "consumable");

    // Reset player stats to base first, then apply kept equipment bonuses
    player.attack = STARTING_ATTACK;
    player.defense = STARTING_DEFENSE;
    player.max_health = STARTING_HEALTH;
    player.current_health = STARTING_HEALTH; // Start fresh

    if (equippableItems.length > 0) {
        keptEquipment = equippableItems[Math.floor(Math.random() * equippableItems.length)];
        // Clear inventory and equipped items before adding the kept item
        player.inventory = [];
        player.equipped = {"weapon": null, "armor": null, "accessory": null};

        // Add the kept item to inventory and re-equip if it's an equipable type
        if (["weapon", "armor", "accessory"].includes(keptEquipment.item_type)) {
            player.equipped[keptEquipment.item_type] = keptEquipment;
            // Apply bonuses from the re-equipped item
            player.attack += keptEquipment.attack_bonus;
            player.defense += keptEquipment.defense_bonus;
            player.max_health += keptEquipment.health_bonus;
            player.current_health = player.max_health; // Adjust current health to new max
        } else { // If kept item is a consumable, just add it to inventory (though unlikely for "equippableItems")
            player.inventory.push(keptEquipment);
        }
        updateGameLog(`You managed to keep one random piece of equipment: ${keptEquipment.name}.`);
    } else {
        updateGameLog("You had no equipment to keep.");
    }

    // Calculate levels to keep, ensuring it's at least level 1
    const levelsGained = player.level - 1;
    const levelsToKeep = Math.floor(levelsGained / 2);
    player.level = 1 + levelsToKeep;
    player.experience = 0; // Reset experience for current level

    updateGameLog(`You kept half your gained levels. You are now Level ${player.level}.`);
    player.current_health = player.max_health; // Full heal for new start

    saveGame(player); // Save the 'resurrected' state
    updateGameLog("You've been revived and returned to town!");
    updateStatsDisplay();
    showTownMenu();
}


// --- Main Menu ---
function showMainMenu() {
    showButtons('main_menu');
    updateGameLog("--- NotRouge by Gobytego ---");
    updateGameLog("Welcome, adventurer!");
    updateStatsDisplay(); // Clear or show default stats
}

function startNewGame() {
    const heroName = prompt("Enter your hero's name:", "Hero");
    if (heroName) {
        player = new Player(heroName);
        updateGameLog(`Welcome, ${player.name}!`);
        updateStatsDisplay();
        showTownMenu();
    } else {
        updateGameLog("New game cancelled.");
        showMainMenu();
    }
}

// --- Town Menu ---
function showTownMenu() {
    showButtons('town');
    updateGameLog(`\n--- Welcome to ${player.name}'s Town ---`);
    updateGameLog("What would you like to do?");
    updateStatsDisplay();
}

// --- Shop Menu ---
function showShopMenu() {
    updateGameLog(`\n--- Welcome to the Shop! (Gold: ${player.gold}) ---`);
    if (ITEMS_DATA.length === 0) {
        updateGameLog("The shop is currently empty. No items to display.");
        showButtons('dungeon_continue'); // Re-use continue/retreat for "back"
        return;
    }

    shopItemsDisplay = [...ITEMS_DATA]; // Get all items
    // Shuffle and pick 5 unique items if more than 5 available, otherwise all
    if (shopItemsDisplay.length > 5) {
        for (let i = shopItemsDisplay.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shopItemsDisplay[i], shopItemsDisplay[j]] = [shopItemsDisplay[j], shopItemsDisplay[i]];
        }
        shopItemsDisplay = shopItemsDisplay.slice(0, 5);
    }
    
    updateGameLog("--- Buy Items ---");
    shopItemsDisplay.forEach((item, index) => {
        let itemDesc = `${index + 1}. ${item.name} (${item.item_type}) - Cost: ${item.cost} gold`;
        if (item.attack_bonus) itemDesc += ` | ATK: +${item.attack_bonus}`;
        if (item.defense_bonus) itemDesc += ` | DEF: +${item.defense_bonus}`;
        if (item.health_bonus) itemDesc += ` | HP: +${item.health_bonus}`;
        if (item.heal_amount) itemDesc += ` | Heals: ${item.heal_amount}`;
        updateGameLog(itemDesc);
    });

    showButtons('shop_buy');
}

function buyShopItem(chosenItemData) {
    if (player.gold >= chosenItemData.cost) {
        player.gold -= chosenItemData.cost;
        player.inventory.push(new Item(chosenItemData)); // Add a new Item instance
        updateGameLog(`You bought ${chosenItemData.name} for ${chosenItemData.cost} gold!`);
        updateStatsDisplay();
        showShopMenu(); // Refresh shop display
    } else {
        updateGameLog("You don't have enough gold!");
    }
}

function showSellItemsMenu() {
    updateGameLog(`\n--- Sell Items (Your Gold: ${player.gold}) ---`);
    const sellableItems = player.inventory.filter(item => !Object.values(player.equipped).includes(item));

    if (sellableItems.length === 0) {
        updateGameLog("You have no sellable items in your inventory.");
    } else {
        updateGameLog("Select an item to sell:");
        sellableItems.forEach((item, index) => {
            const sellPrice = Math.floor(item.cost * SELL_PRICE_MULTIPLIER);
            updateGameLog(`${index + 1}. ${item.name} (Type: ${item.item_type}) - Sell for: ${sellPrice} gold`);
        });
    }
    showButtons('shop_sell');
}

function sellItemAction(itemToSell) {
    const sellPrice = Math.floor(itemToSell.cost * SELL_PRICE_MULTIPLIER);
    player.gold += sellPrice;
    player.inventory = player.inventory.filter(item => item !== itemToSell);
    updateGameLog(`You sold ${itemToSell.name} for ${sellPrice} gold!`);
    updateStatsDisplay();
    showSellItemsMenu(); // Refresh sell menu
}


// --- Inventory Menu ---
function showInventoryMenu() {
    updateGameLog("\n--- Inventory Management ---");
    if (player.inventory.length === 0) {
        updateGameLog("Your inventory is empty.");
        showButtons('dungeon_continue'); // Re-use continue/retreat for "back"
        return;
    }

    updateGameLog("Select an item to use/equip or discard:");
    player.inventory.forEach((item, index) => {
        let itemDesc = `${index + 1}. ${item.name} (${item.item_type})`;
        if (item.attack_bonus) itemDesc += ` | ATK: +${item.attack_bonus}`;
        if (item.defense_bonus) itemDesc += ` | DEF: +${item.defense_bonus}`;
        if (item.health_bonus) itemDesc += ` | HP: +${item.health_bonus}`;
        if (item.heal_amount) itemDesc += ` | Heals: ${item.heal_amount}`;
        updateGameLog(itemDesc);
    });
    showButtons('inventory_manage');
}

function handleInventoryItemAction(chosenItem) {
    if (chosenItem.item_type === "consumable") {
        if (chosenItem.heal_amount > 0) {
            player.heal(chosenItem.heal_amount);
            player.inventory = player.inventory.filter(item => item !== chosenItem);
            updateGameLog(`You used a ${chosenItem.name}.`);
        } else {
            updateGameLog("This item cannot be used.");
        }
    } else { // Equipable item
        player.equipItem(chosenItem);
        updateGameLog(`You equipped ${chosenItem.name}.`);
    }
    showInventoryMenu(); // Refresh inventory display
}

function throwAwayItemAction(itemToThrow) {
    if (Object.values(player.equipped).includes(itemToThrow)) {
        updateGameLog(`You cannot throw away ${itemToThrow.name} while it is equipped. Unequip it first.`);
        return;
    }

    player.inventory = player.inventory.filter(item => item !== itemToThrow);
    updateGameLog(`You threw away ${itemToThrow.name}.`);
    showInventoryMenu(); // Refresh inventory display
}


// --- Dungeon Handling ---
function startDungeon() {
    if (ENEMIES_DATA.length === 0) {
        updateGameLog("The dungeon seems eerily quiet... (No enemies loaded).");
        showTownMenu();
        return;
    }
    updateGameLog("You enter the dark and winding dungeon...");
    player.dungeonRoomCount = 0; // Store on player for persistent dungeon runs
    player.maxDungeonRooms = Math.floor(Math.random() * (7 - 3 + 1)) + 3; // Random 3-7 rooms
    dungeonNextRoom();
}

function dungeonNextRoom() {
    if (player.current_health <= 0) {
        handleDeath();
        return;
    }

    if (player.dungeonRoomCount >= player.maxDungeonRooms) {
        updateGameLog("You have cleared this section of the dungeon! You return to town.");
        showTownMenu();
        return;
    }

    player.dungeonRoomCount++;
    updateGameLog(`\n--- Dungeon Depth: ${player.dungeonRoomCount}/${player.maxDungeonRooms} ---`);
    updateGameLog("You explore deeper...");
    
    const encounterTypes = ["combat", "nothing", "treasure", "healing"];
    const weights = [0.6, 0.2, 0.15, 0.05];
    const encounterType = encounterTypes[weightedRandom(weights)];

    if (encounterType === "combat") {
        const enemyTemplate = ENEMIES_DATA[Math.floor(Math.random() * ENEMIES_DATA.length)];
        currentEnemy = new Enemy(enemyTemplate);
        updateGameLog(`A wild ${currentEnemy.name} appears!`);
        showCombatMenu();
    } else if (encounterType === "treasure") {
        const goldFound = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
        player.gold += goldFound;
        updateGameLog(`You found a hidden chest with ${goldFound} gold!`);
        updateStatsDisplay();
        showButtons('dungeon_continue');
    } else if (encounterType === "healing") {
        const healAmount = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
        player.heal(healAmount);
        updateGameLog(`You found a refreshing spring and healed ${healAmount} health!`);
        updateStatsDisplay();
        showButtons('dungeon_continue');
    } else { // "nothing"
        updateGameLog("You found nothing of interest in this area.");
        showButtons('dungeon_continue');
    }
}

function weightedRandom(weights) {
    let i;
    let sum = 0;
    for (i = 0; i < weights.length; i++) {
        sum += weights[i];
    }
    const r = Math.random() * sum;
    let currentSum = 0;
    for (i = 0; i < weights.length; i++) {
        currentSum += weights[i];
        if (r < currentSum) {
            return i;
        }
    }
    return weights.length - 1; // Fallback
}


// --- Combat Handling ---
function showCombatMenu() {
    showButtons('combat');
    updateGameLog(`--- Combat: ${player.name} vs ${currentEnemy.name} ---`);
    updateGameLog(`${player.name} HP: ${player.current_health}/${player.max_health} | ATK: ${player.attack} | DEF: ${player.defense}`);
    updateGameLog(`${currentEnemy.name} HP: ${currentEnemy.health}/${currentEnemy.health_full} | ATK: ${currentEnemy.attack} | DEF: ${currentEnemy.defense}`);
    updateGameLog("What will you do?");
}

function combatAction(actionType) {
    if (player.current_health <= 0 || currentEnemy.health <= 0) {
        return; // Combat already over
    }

    clearInterval(autoAttackInterval); // Stop auto-attack if a manual action is chosen

    if (actionType === "attack") {
        performPlayerAttack();
        if (currentEnemy && currentEnemy.health > 0) {
            performEnemyAttack();
        }
        checkCombatEnd();
    } else if (actionType === "flee") {
        performFleeAttempt();
        checkCombatEnd();
    } else if (actionType === "auto_attack") {
        updateGameLog("Initiating auto-attack...");
        autoAttackTurn(); // Start immediately
        if (player.current_health > 1 && currentEnemy && currentEnemy.health > 0) {
             autoAttackInterval = setInterval(autoAttackTurn, 100); // Faster turns in auto-attack
        }
    }
}

function performPlayerAttack() {
    const playerDamage = Math.max(1, player.attack + Math.floor(Math.random() * 11) - 5); // +/- 5 variance
    const enemyDead = currentEnemy.takeDamage(playerDamage);
    updateGameLog(`You hit the ${currentEnemy.name} for ${playerDamage} damage!`);
    if (enemyDead) {
        updateGameLog(`You defeated the ${currentEnemy.name}!`);
        player.gold += currentEnemy.gold_drop;
        player.gainExp(currentEnemy.exp_drop);
        updateGameLog(`You gained ${currentEnemy.gold_drop} gold and ${currentEnemy.exp_drop} experience.`);
        currentEnemy = null; // Mark enemy as defeated
    }
}

function performEnemyAttack() {
    if (currentEnemy && currentEnemy.health > 0) {
        const enemyDamage = Math.max(1, currentEnemy.attack + Math.floor(Math.random() * 7) - 3); // +/- 3 variance
        const playerDead = player.takeDamage(enemyDamage);
        updateGameLog(`The ${currentEnemy.name} hits you for ${enemyDamage} damage!`);
        if (playerDead) {
            currentEnemy = null; // Player died, combat ends
        }
    }
}

function checkCombatEnd() {
    updateStatsDisplay(); // Update player stats after each action
    if (player.current_health <= 0) {
        clearInterval(autoAttackInterval);
        handleDeath();
    } else if (currentEnemy === null) { // Enemy defeated
        clearInterval(autoAttackInterval);
        showButtons('dungeon_continue'); // Back to dungeon flow
    } else {
        // If combat not ended, display current state for next turn (unless auto-attacking)
        updateGameLog(`--- Combat: ${player.name} HP: ${player.current_health}/${player.max_health} vs ${currentEnemy.name} HP: ${currentEnemy.health}/${currentEnemy.health_full} ---`);
        if (!autoAttackInterval) { // Only prompt if not auto-attacking
            updateGameLog("What will you do next?");
        }
    }
}


function showCombatItemMenu() {
    updateGameLog("\n--- Your Consumable Items ---");
    const consumables = player.inventory.filter(item => item.item_type === "consumable");
    if (consumables.length === 0) {
        updateGameLog("You have no usable items.");
        showCombatMenu(); // Return to combat menu
        return;
    }

    consumables.forEach((item, index) => {
        updateGameLog(`${index + 1}. ${item.name} (Heals: ${item.heal_amount})`);
    });
    showButtons('combat_item_use');
}

function useCombatItem(itemToUse) {
    if (itemToUse.heal_amount > 0) {
        player.heal(itemToUse.heal_amount);
        player.inventory = player.inventory.filter(item => item !== itemToUse);
        updateGameLog(`You used a ${itemToUse.name}.`);
    } else {
        updateGameLog("This item cannot be used in combat.");
    }
    showCombatMenu(); // Return to combat menu after using item
}

function performFleeAttempt() {
    if (Math.random() < 0.5) {
        updateGameLog("You successfully fled from combat!");
        currentEnemy = null; // End combat
    } else {
        updateGameLog("You failed to flee!");
        performEnemyAttack(); // Enemy gets a free hit if flee fails
    }
}

function autoAttackTurn() {
    // Check conditions to stop auto-attack
    if (player.current_health <= 1) {
        updateGameLog("\nYour health is critically low (1 HP remaining)! Auto-attack stopped.");
        clearInterval(autoAttackInterval);
        showCombatMenu(); // Return to manual combat options
        return;
    }
    if (currentEnemy === null || currentEnemy.health <= 0) {
        updateGameLog("Enemy defeated.");
        clearInterval(autoAttackInterval);
        showButtons('dungeon_continue'); // Enemy defeated, move on
        return;
    }

    // Player attacks
    performPlayerAttack();
    
    // Check if enemy is defeated after player's attack
    if (currentEnemy === null || currentEnemy.health <= 0) {
        clearInterval(autoAttackInterval);
        showButtons('dungeon_continue');
        return;
    }

    // Enemy attacks
    performEnemyAttack();

    // Re-check player health after enemy attack
    if (player.current_health <= 0) {
        clearInterval(autoAttackInterval);
        handleDeath();
        return; // Exit this auto-attack turn as player is dead
    }

    // Update combat display (optional for auto-attack but useful for feedback)
    if (currentEnemy) { // Still in combat
         updateGameLog(`--- Auto-Combat: ${player.name} HP: ${player.current_health}/${player.max_health} vs ${currentEnemy.name} HP: ${currentEnemy.health}/${currentEnemy.health_full} ---`);
    }
}


// --- Initialization ---
function initGame() {
    updateStatsDisplay(); // Initial display of empty stats
    showMainMenu();
}

// Start the game when the window loads
window.onload = initGame;
