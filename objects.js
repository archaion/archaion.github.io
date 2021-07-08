// STORE CONSTRUCTOR OUTPUT - DO NOT CALL ON STARTUP
// EXPLICIT DECLARATION OF PLAYER FOR TESTING ONLY - store args in local engine variables for Character creation
/*var Player = {
   ATK: () => {
      switch (this.Weapon.Type) {
         case "sword": return this.Melee + bonus(this.INS);
         case "gun": return this.Firearms + bonus(this.INS);
         default: return this.Survival;
      }
   },
   DMG: () => {                // Add secondary attribute bonus if weapon / armor equipped
      switch (this.Weapon.Type) {
         case "sword": return bonus(this.STR);
         case "gun": return bonus(this.DEX);
         default: return bonus(this.INS);
      }
   },
   DEF: () => this.Armor.Type == "armor" ? this.Athletics + bonus(this.STM) : this.Athletics,
   EVD: () => this.Armor.Type == "armor" ? this.Dodge + bonus(this.STM) : this.Dodge,
   HAX: () => this.Deck.Type == "deck" ? this.Computer + bonus(this.WIT) : this.Computer,
   CPU: () => this.Deck.Type == "deck" ? this.Technology + bonus(this.INT) : this.Technology,
   SEC: () => this.Deck.Type == "deck" ? this.Security + bonus(this.INT) : this.Security,
   Abilities: "Defense",
   Alertness: 10,
   Angle: 360,
   Armor: {
      ATK: () => roll(5),
      Amount: 1,
      BNS: 0,
      CPU: () => roll(5),
      Creds: 0,
      DEF: () => roll(5),
      DMG: () => roll(5),
      EVD: () => roll(5),
      Effect: 0,
      HAX: () => roll(5),
      Icon: "empty",
      Name: "Empty",
      SEC: () => roll(5),
      SKL: "Empty",
      Sprite: "empty",
      Type: "empty"
   },
   Athletics: 11,
   CHA: 12,
   Chip: {
      ATK: () => roll(5),
      Amount: 1,
      BNS: 0,
      CPU: () => roll(5),
      Creds: 0,
      DEF: () => roll(5),
      DMG: () => roll(5),
      EVD: () => roll(5),
      Effect: 0,
      HAX: () => roll(5),
      Icon: "empty",
      Name: "Empty",
      SEC: () => roll(5),
      SKL: "Empty",
      Sprite: "empty",
      Type: "empty"
   },
   Class: "Guard",
   Computer: 11,
   Crafts: 12,
   DEX: 13,
   Deck: {
      ATK: () => roll(5),
      Amount: 1,
      BNS: 0,
      CPU: () => roll(5),
      Creds: 0,
      DEF: () => roll(5),
      DMG: () => roll(5),
      EVD: () => roll(5),
      Effect: 0,
      HAX: () => roll(5),
      Icon: "empty",
      Name: "Empty",
      SEC: () => roll(5),
      SKL: "Empty",
      Sprite: "empty",
      Type: "empty"
   },
   Dodge: 12,
   EXP: 0,
   Etiquette: 11,
   Finance: 12,
   Firearms: 13,
   HP: 19,
   HP_max: 19,
   HUM: 13,
   ID: 0,
   INS: 15,
   INT: 14,
   Intimidate: 12,
   Intuition: 11,
   Investigate: 11,
   Items: {
      Empty: {
         ATK: () => roll(5),
         Amount: 1,
         BNS: 0,
         CPU: () => roll(5),
         Creds: 0,
         DEF: () => roll(5),
         DMG: () => roll(5),
         EVD: () => roll(5),
         Effect: 0,
         HAX: () => roll(5),
         Icon: "empty",
         Name: "Empty",
         SEC: () => roll(5),
         SKL: "Empty",
         Sprite: "empty",
         Type: "empty"
      }
   },
   Level: 1,
   MP: 12,
   MP_max: 12,
   Medicine: 11,
   Melee: 15,
   Mood: 0,
   Name: "Player",
   Occult: 12,
   Politics: 11,
   Race: "European",
   Repair: 11,
   Research: 12,
   SP: 19,
   SP_max: 19,
   STM: 13,
   STR: 14,
   Science: 12,
   Security: 10,
   Status: "idle",
   Stealth: 11,
   Streetwise: 11,
   Subterfuge: 11,
   Survival: 14,
   Technology: 12,
   WIL: 11,
   WIT: 14,
   Weapon: {
      ATK: () => roll(5),
      Amount: 1,
      BNS: 0,
      CPU: () => roll(5),
      Creds: 0,
      DEF: () => roll(5),
      DMG: () => roll(5),
      EVD: () => roll(5),
      Effect: 0,
      HAX: () => roll(5),
      Icon: "empty",
      Name: "Empty",
      SEC: () => roll(5),
      SKL: "Empty",
      Sprite: "empty",
      Type: "empty"
   },
   X_pos: 0,
   Y_pos: 0
};

var Enemy = {// new Character(2, "Enemy", "Asian", "Soldier", 1, {});        // REPLACE "ID" ARG WITH "UID" OF ENGINE OBJECT
   ATK: () => {
      switch (this.Weapon.Type) {
         case "sword": return this.Melee + bonus(this.INS);
         case "gun": return this.Firearms + bonus(this.INS);
         default: return this.Survival;
      }
   },

   DMG: () => {                // Add secondary attribute bonus if weapon / armor equipped
      switch (this.Weapon.Type) {
         case "sword": return bonus(this.STR);
         case "gun": return bonus(this.DEX);
         default: return bonus(this.INS);
      }
   },

   DEF: () => this.Armor.Type == "armor" ? this.Athletics + bonus(this.STM) : this.Athletics,
   EVD: () => this.Armor.Type == "armor" ? this.Dodge + bonus(this.STM) : this.Dodge,
   HAX: () => this.Deck.Type == "deck" ? this.Computer + bonus(this.WIT) : this.Computer,
   CPU: () => this.Deck.Type == "deck" ? this.Technology + bonus(this.INT) : this.Technology,
   SEC: () => this.Deck.Type == "deck" ? this.Security + bonus(this.INT) : this.Security,
   Abilities: "Vengeance",
   Alertness: 11,
   Angle: 360,
   Armor: {
      ATK: () => roll(5),
      Amount: 1,
      BNS: 0,
      CPU: () => roll(5),
      Creds: 0,
      DEF: () => roll(5),
      DMG: () => roll(5),
      EVD: () => roll(5),
      Effect: 0,
      HAX: () => roll(5),
      Icon: "empty",
      Name: "Empty",
      SEC: () => roll(5),
      SKL: "Empty",
      Sprite: "empty",
      Type: "empty",
   },
   Athletics: 13,
   CHA: 12,
   Chip: {
      ATK: () => roll(5),
      Amount: 1,
      BNS: 0,
      CPU: () => roll(5),
      Creds: 0,
      DEF: () => roll(5),
      DMG: () => roll(5),
      EVD: () => roll(5),
      Effect: 0,
      HAX: () => roll(5),
      Icon: "empty",
      Name: "Empty",
      SEC: () => roll(5),
      SKL: "Empty",
      Sprite: "empty",
      Type: "empty"
   },
   Class: "Soldier",
   Computer: 13,
   Crafts: 10,
   DEX: 16,
   Deck: {
      ATK: () => roll(5),
      Amount: 1,
      BNS: 0,
      CPU: () => roll(5),
      Creds: 0,
      DEF: () => roll(5),
      DMG: () => roll(5),
      EVD: () => roll(5),
      Effect: 0,
      HAX: () => roll(5),
      Icon: "empty",
      Name: "Empty",
      SEC: () => roll(5),
      SKL: "Empty",
      Sprite: "empty",
      Type: "empty"
   },
   Dodge: 12,
   EXP: 0,
   Etiquette: 12,
   Finance: 13,
   Firearms: 14,
   HP: 17,
   HP_max: 17,
   HUM: 15,
   ID: 2,
   INS: 13,
   INT: 16,
   Intimidate: 13,
   Intuition: 12,
   Investigate: 11,
   Items: {
      Empty: {
         ATK: () => roll(5),
         Amount: 1,
         BNS: 0,
         CPU: () => roll(5),
         Creds: 0,
         DEF: () => roll(5),
         DMG: () => roll(5),
         EVD: () => roll(5),
         Effect: 0,
         HAX: () => roll(5),
         Icon: "empty",
         Name: "Empty",
         SEC: () => roll(5),
         SKL: "Empty",
         Sprite: "empty",
         Type: "empty"
      }
   },
   Level: 1,
   MP: 20,
   MP_max: 20,
   Medicine: 11,
   Melee: 12,
   Mood: 0,
   Name: "Enemy",
   Occult: 10,
   Politics: 11,
   Race: "Asian",
   Repair: 11,
   Research: 11,
   SP: 18,
   SP_max: 18,
   STM: 13,
   STR: 13,
   Science: 11,
   Security: 11,
   Status: "idle",
   Stealth: 13,
   Streetwise: 12,
   Subterfuge: 12,
   Survival: 13,
   Technology: 11,
   WIL: 12,
   WIT: 11,
   Weapon: {
      ATK: () => roll(5),
      Amount: 1,
      BNS: 0,
      CPU: () => roll(5),
      Creds: 0,
      DEF: () => roll(5),
      DMG: () => roll(5),
      EVD: () => roll(5),
      Effect: 0,
      HAX: () => roll(5),
      Icon: "empty",
      Name: "Empty",
      SEC: () => roll(5),
      SKL: "Empty",
      Sprite: "empty",
      Type: "empty"
   },
   X_pos: 0,
   Y_pos: 0,
};*/

var Player = new Character(0, "Player", "European", "Guard", 1, {});
var Enemy = new Character(2, "Enemy", "Asian", "Soldier", 1, {});
var Cast = {
   "0": Player,
   "2": Enemy
};

var Props = {
   Katana: {
      Name: "Katana",               // Function reference and in-game display
      Type: "sword",                // Function reference
      ATK: 12,                      // Item stats
      DMG: 10,
      Creds: 500,                   // Sale / purchase value 
      Amount: "",                   // Number in inventory
      Sprite: "Katana.png",         // Images to display in-game (save in Construct -> Files)
      Icon: "Katana_icon.png"
   },
   MP6: {
      Name: "MP6",
      Type: "gun",
      ATK: 10,
      DMG: 12,
      Creds: 700,
      Amount: "",
      Sprite: "MP6.png",
      Icon: "MP6_icon.png"
   },
   Leather_Coat: {
      Name: "Leather Coat",
      Type: "armor",
      EVD: 12,
      DEF: 10,
      Creds: 150,
      Amount: "",
      Sprite: "Leather_Coat.png",
      Icon: "Leather_Coat_icon.png"
   },
   SynTech_40x: {
      Name: "SynTech 3000",
      Type: "deck",
      SEC: 10,
      HAX: 10,
      CPU: 12,
      Creds: 1000,
      Amount: "",
      Sprite: "SynTech_3000.png",
      Icon: "SynTech_3000_icon.png"
   },
   NiteViz: {
      Name: "NiteViz",
      Type: "chip",
      SKL: "Alertness",
      BNS: 1,                       // On skill check, add BNS
      Creds: 250,
      Amount: "",
      Sprite: "NiteViz.png",
      Icon: "NiteViz_icon.png"
   },
   //Crafting materials / consumables
   Hydrocell: {                     // Source: merchants, NPC computers
      Name: "Hydrocell",
      Type: "material",             // Combines with "Antenna"
      Amount: "",
      Sprite: "Hydrocell.png",      // Image: blue box
      Icon: "Hydrocell_icon.png"
   },
   Antenna: {                       // Source: merchants, NPC computers
      Name: "Antenna",
      Type: "material",             // Combines with "Hydrocell" 
      Amount: "",
      Sprite: "Antenna.png",        // Image: grey cylinder
      Icon: "Antenna_icon.png"
   },
   Opium: {                         // Source: merchants, red flowers
      Name: "Opium",
      Type: "material",             // Combines with "Bleach"
      Amount: "",
      Sprite: "Opium.png",          // Image: green pod
      Icon: "Opium_icon.png"
   },
   Bleach: {                        // Source: merchants, enemy NPCs
      Name: "Bleach",
      Type: "material",             // Combines with "Opium"
      Amount: "",
      Sprite: "Bleach.png",         // Image: brown bottle
      Icon: "Bleach_icon.png"
   },
   Vitae: {                         // Combines with "Soma"
      Name: "Vitae",
      Type: "material",             // Source: vampires
      Amount: "",
      Sprite: "Vitae.png",          // Image: red vial
      Icon: "Vitae_icon.png"
   },
   Soma: {                          // Combines with "Vitae" 
      Name: "Soma",
      Type: "material",             // Source: insects
      Amount: "",
      Sprite: "Soma.png",           // Image: yellow jar
      Icon: "Soma_icon.png"
   },
   Charger_Full: {                  // Result of Craft("Hydrocell", "Antenna")
      Name: "Charger (full)",
      Type: "parts",                // Restores SP
      Effect: 10,
      Amount: "",
      Sprite: "Charger.png",        // Image: green box (black wires)
      Icon: "Charger_icon.png"
   },
   Morphine_Full: {                 // Result of Craft("Opium", "Bleach")
      Name: "Morphine (full)",
      Type: "meds",                 // Restores HP
      Effect: 10,
      Amount: "",
      Sprite: "Morphine.png",       // Image: orange vial (white label)
      Icon: "Morphine_icon.png"
   },
   Fetch_Full: {                    // Result of Craft("Vitae", "Soma")
      Name: "Fetch (full)",         // Street version of the "Mead of Poetry"
      Type: "drugs",                // Restores MP
      Effect: 5,
      Amount: "",
      Sprite: "Fetch.png",          // Image: purple jar (grey cap) 
      Icon: "Fetch_icon.png"
   },
   Charger_Half: {
      Name: "Charger (half)",
      Type: "parts",
      Effect: 5,
      Amount: "",
      Sprite: "Charger_Half.png",
      Icon: "Charger_icon.png"
   },
   Morphine_Half: {
      Name: "Morphine (half)",
      Type: "meds",
      Effect: 5,
      Amount: "",
      Sprite: "Morphine_Half.png",
      Icon: "Morphine_Half_icon.png"
   },
   Fetch_Half: {
      Name: "Fetch (half)",
      Type: "drugs",
      Effect: 5,
      Amount: "",
      Sprite: "Fetch_Half.png",
      Icon: "Fetch_Half_icon.png"
   }
};

var Lines = {
   Hello: "Hello"
};


