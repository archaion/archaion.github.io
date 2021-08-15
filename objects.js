
// STORE CONSTRUCTOR OUTPUT AS JSON & LOAD ON ENGINE START - DO NOT CALL ON STARTUT
// EXPLICIT DECLARATION OF PLAYER FOR TESTING ONLY - store args in local engine variables for Character creation

var Cast = Lines = Stage = Props = Bill = {};

Props = {                        // Usable and equippable items
   Empty: {                      // Placeholder
      Name: "Empty",
      Type: "empty",
      ATK: () => roll(0),
      DMG: () => roll(0),
      EVD: () => roll(0),
      DEF: () => roll(0),
      SEC: () => roll(0),
      HAX: () => roll(0),
      CPU: () => roll(0),
      SKL: "Empty",
      BNS: 0,
      Effect: 0,
      Creds: 0,
      Amount: 1,
      Sprite: "empty",
      Icon: "empty"
   },
   Credits: {
      Name: "Credits",              // Function reference and in-game display
      Type: "money",                // Function reference
      Amount: 1,                    // Number in inventory (default 1)
      Sprite: "Credits.png",        // Images to display in-game (save in Construct -> Files)
      Icon: "Credits_icon.png"
   },
   Katana: {
      Name: "Katana",
      Type: "sword",
      ATK: () => roll(12),                      // Item stats
      DMG: () => roll(10),
      Creds: 500,                   // Sale / purchase value 
      Amount: 1,
      Sprite: "Katana.png",
      Icon: "Katana_icon.png"
   },
   Knife: {
      Name: "Knife",
      Type: "sword",
      ATK: () => roll(5),                      // Item stats
      DMG: () => roll(5),
      Creds: 0,                   // Sale / purchase value 
      Amount: 1,
      Sprite: "Knife.png",
      Icon: "Knife_icon.png"
   },
   MP6: {
      Name: "MP6",
      Type: "gun",
      ATK: () => roll(10),
      DMG: () => roll(12),
      Creds: 700,
      Amount: 1,
      Sprite: "MP6.png",
      Icon: "MP6_icon.png"
   },
   "Leather Coat": {
      Name: "Leather Coat",
      Type: "armor",
      EVD: () => roll(12),
      DEF: () => roll(10),
      Creds: 150,
      Amount: 1,
      Sprite: "Leather_Coat.png",
      Icon: "Leather_Coat_icon.png"
   },
   "Street Clothes": {
      Name: "Street Clothes",
      Type: "armor",
      EVD: () => roll(12),
      DEF: () => roll(10),
      Creds: 20,
      Amount: 1,
      Sprite: "Street_Clothes.png",
      Icon: "Street_Clothes_icon.png"
   },
   "SynTech 40x": {
      Name: "SynTech 40x",
      Type: "deck",
      SEC: () => roll(10),
      HAX: () => roll(10),
      CPU: () => roll(12),
      Creds: 1000,
      Amount: 1,
      Sprite: "SynTech_3000.png",
      Icon: "SynTech_3000_icon.png"
   },
   NiteViz: {
      Name: "NiteViz",
      Type: "chip",
      SKL: "Alertness",
      BNS: 1,                       // On skill check, add BNS
      Creds: 250,
      Amount: 1,
      Sprite: "NiteViz.png",
      Icon: "NiteViz_icon.png"
   },
   //Crafting materials / consumables
   Hydrocell: {                     // Source: merchants, NPC computers
      Name: "Hydrocell",
      Type: "material",             // Combines with "Antenna"
      Amount: 1,
      Sprite: "Hydrocell.png",      // Image: blue box
      Icon: "Hydrocell_icon.png"
   },
   Antenna: {                       // Source: merchants, NPC computers
      Name: "Antenna",
      Type: "material",             // Combines with "Hydrocell" 
      Amount: 1,
      Sprite: "Antenna.png",        // Image: grey cylinder
      Icon: "Antenna_icon.png"
   },
   Opium: {                         // Source: merchants, red flowers
      Name: "Opium",
      Type: "material",             // Combines with "Bleach"
      Amount: 1,
      Sprite: "Opium.png",          // Image: green pod
      Icon: "Opium_icon.png"
   },
   Bleach: {                        // Source: merchants, enemy NPCs
      Name: "Bleach",
      Type: "material",             // Combines with "Opium"
      Amount: 1,
      Sprite: "Bleach.png",         // Image: brown bottle
      Icon: "Bleach_icon.png"
   },
   Vitae: {                         // Combines with "Soma"
      Name: "Vitae",
      Type: "material",             // Source: vampires
      Amount: 1,
      Sprite: "Vitae.png",          // Image: red vial
      Icon: "Vitae_icon.png"
   },
   Soma: {                          // Combines with "Vitae" 
      Name: "Soma",
      Type: "material",             // Source: insects
      Amount: 1,
      Sprite: "Soma.png",           // Image: yellow jar
      Icon: "Soma_icon.png"
   },
   "Charger (full)": {                  // Result of Craft("Hydrocell", "Antenna")
      Name: "Charger (full)",
      Type: "parts",                // Restores SP
      Effect: 10,
      Amount: 1,
      Sprite: "Charger.png",        // Image: green box (black wires)
      Icon: "Charger_icon.png"
   },
   "Morphine (full)": {                 // Result of Craft("Opium", "Bleach")
      Name: "Morphine (full)",
      Type: "meds",                 // Restores HP
      Effect: 10,
      Amount: 1,
      Sprite: "Morphine.png",       // Image: orange vial (white label)
      Icon: "Morphine_icon.png"
   },
   "Fetch (full)": {                    // Result of Craft("Vitae", "Soma")
      Name: "Fetch (full)",         // Street version of the "Mead of Poetry"
      Type: "drugs",                // Restores MP
      Effect: 5,
      Amount: 1,
      Sprite: "Fetch.png",          // Image: purple jar (grey cap) 
      Icon: "Fetch_icon.png"
   },
   "Charger (half)": {
      Name: "Charger (half)",
      Type: "parts",
      Effect: 5,
      Amount: 1,
      Sprite: "Charger_Half.png",
      Icon: "Charger_icon.png"
   },
   "Morphine (half)": {
      Name: "Morphine (half)",
      Type: "meds",
      Effect: 5,
      Amount: 1,
      Sprite: "Morphine_Half.png",
      Icon: "Morphine_Half_icon.png"
   },
   "Fetch (half)": {
      Name: "Fetch (half)",
      Type: "drugs",
      Effect: 5,
      Amount: 1,
      Sprite: "Fetch_Half.png",
      Icon: "Fetch_Half_icon.png"
   },
   // Food
   Apple: {
      Name: "Apple",
      Type: "food",
      Effect: 1,
      Amount: 1,
      Sprite: "Apple.png",
      Icon: "Apple_icon.png"
   }
};

//var Player = new Character(0, "Player", "European", "Guard", 1, {});
var Player = JSON.parse('{"ID":0,"Name":"Player","Race":"European","Class":"Guard","Level":1,"EXP":0,"Status":"idle","Mood":0,"Angle":0,"Y_pos":0,"X_pos":0,"Quests":{},"Items":{},"Weapon":{},"Armor":{},"Deck":{},"Chip":{},"STR":12,"DEX":13,"STM":16,"INT":14,"WIT":14,"CHA":14,"WIL":11,"INS":13,"HUM":13,"HP_min":13,"SP_min":18,"MP_min":13,"HP":17,"SP":16,"MP":14}');
Player.Chip = Player.Deck = Props["Empty"];
Player.Weapon = Player.Items.Knife = Props["Knife"];
Player.Armor = Player.Items["Street Clothes"] = Props["Street Clothes"];
Player.Abilities = { Name: "Defense", Caption: "Increase your DEX and reduce enemy STR by 1d10 for 30s" }
Player.__proto__ = Character.prototype;

var Enemy = new Character(2, "Enemy", "Asian", "Soldier", 1, {});

Cast = {                            // Player and NPC objects
   0: Player,
   2: Enemy        // NPC key must match UID in engine
};

Bill = {                        // Menu reference lists - call values in engine
   Character: {
      Info: {
         Name: Player.Name, Race: Player.Race, Class: Player.Class, Level: Player.Level, EXP: Player.EXP,
         HP: Player.HP, SP: Player.SP, MP: Player.MP, HP_max: Player.HP_max(), SP_max: Player.SP_max(), MP_max: Player.MP_max(),
         Weapon: Player.Weapon.Name, Armor: Player.Armor.Name, Deck: Player.Deck.Name, Chip: Player.Chip.Name
      },
      Stats: {
         STR: Player.STR, DEX: Player.DEX, STM: Player.STM,
         INT: Player.INT, WIT: Player.WIT, CHA: Player.CHA,
         WIL: Player.WIL, INS: Player.INS, HUM: Player.HUM,
         ATK: Player.ATK, DMG: Player.DMG, DEF: Player.DEF, EVD: Player.EVD,
         CPU: Player.CPU, SEC: Player.SEC, HAX: Player.HAX,
      },
      Skills: {
         Firearms: Player.Firearms(), Athletics: Player.Athletics(), Melee: Player.Melee(), Dodge: Player.Dodge(),
         Computer: Player.Computer(), Alertness: Player.Alertness(), Stealth: Player.Stealth(), Security: Player.Security(),
         Repair: Player.Repair(), Technology: Player.Technology(), Medicine: Player.Medicine(), Survival: Player.Survival(),
         Occult: Player.Occult(), Research: Player.Research(), Crafts: Player.Crafts(), Science: Player.Science(),
         Finance: Player.Finance(), Etiquette: Player.Etiquette(), Intimidate: Player.Intimidate(), Streetwise: Player.Streetwise()
      },
      Feats: {
         Ability: Player.Abilities.Name, Description: Player.Abilities.Caption
      }
   },
   Quests: {
         Active: Player.Quests
   }
}

Lines = {                           // NPC dialogue - see GetLines()
   2: {                                                  // NPC engine UID
      0: {                                               // Topic ID
         // NPC: "Yes? What do you want?"
         Text: "1. Who are you?",                        // User input prompts, with newline before each
         1: "1",                                         // Key = user input, value = next topic
      },
      1: {
         // NPC: "The name's Goldman. I own this place."
         Text: "1. Do you have any work for me?",
         1: "2",
      },
      2: {
         // NPC: "As a matter of fact, I do. Get me some apples from that tree over there and I'll pay you a dollar."
         Text: "1. Okay, I'll be right back with your apples Mr. Goldman.\n2. No, get them yourself.",
         1: "3",
         2: "4",
      },
      3: {                                               // Accept quest = set INSTANCE variable
         // NPC: "Very good. And be quick about it, I don't have all day."
         Text: "1. Yes, sir. (LEAVE)",
         1: "END",
         Quest: "A0",                                     // Set to NPCs.Topic variable - "END" topic only
         Script: function () {
            return Player.Quests["Goldman"] = {A0: "Bring the apples to Goldman."};    // Key = NPC ID, value = description !!!!!!!!!
         }
      },
      4: {
         // NPC: "Fine, I'll just pay someone else to do it.",
         Text: "1. Good luck. (LEAVE)",
         1: "END",                                       // "END" value exits "talk" state
         Quest: 0                                        // Reset dialogue
      },
      // QUEST-SPECIFIC DIALOGUE:
      A0: {
         //NPC: "Do you have those apples I asked for?"
         Text: "1. Yes, here you go. \n2. No, I don't have them.",
         1: "A1",                                        // Topic = quest "A1"
         2: "A2"
      },
      A1: {                                              // Reset variable and call Trade() 
         // NPC: "Alright, hand them over then."
         Path1: {
            Text: "1. (GIVE APPLES)",
            1: "A3"
         },
         Path2: {
            Text: "1. I don't have them.",
            1: "A2",
         },
         Script: function () {
            return Player.Items.Apple ? "Path1" : "Path2";  // Display Text1 or Text2 in engine
         }
      },
      A2: {                                              // No change to instance variable
         // NPC: "Well hurry up and get them!"
         Text: "1. Okay. (LEAVE)",
         1: "END",
         Quest: "A0"                                     // Reset dialogue to quest start
      },
      A3: {
         // NPC: "Excellent, heres your dollar. Run along now."
         Text: "1. Thanks. (LEAVE)",
         1: "END",
         Quest: 0,                                       // End quest & reset dialogue
         Script: function () { 
            delete Player.Quests["Goldman"];
            Trade(0, "add", 1, "Credits");
            Trade(0, "remove", 1, "Apple");
            return "reward"
         }
      }
   }
};

Stage = {                       // Interactive objects and scripted events
   6: {
      Script: function () {
         return "true";
      },
      Text: "It's an apple tree."
   },
   24: {                                     // Key matches engine UID
      Script: function () {
         if (this.Stock > 1) {               // If true, perform actions in engine
            Trade(0, "add", 1, "Apple");
            this.Stock -= 1;
            return "true";
         } else {
            Trade(0, "add", 1, "Apple");
            this.Stock -= 1;
            return "false";
         }
      },
      Stock: 1,
      Text: "Got an Apple."
   }
}

/*


   "c2dictionary": true,                     // Engine JSON formatting
   "data": {                                 // Steps to import and display in engine:
      "2": {                                 // Set 1st key to Speaker variable - Character ID matching object UID in engine
         "0": {                              // Set 2nd key to Topic variable
            "NPC": {                         // Set 3rd key to dictionary - "Load from JSON" -> GetLines(Speaker, Topic, N/P)
               "0": "Hello.",                // Get 4th keys using "For Each Key" -> create & set to text objects in NPC box
            },
            "PC": {                          // Set other 3rd key to dictionary, repeat above for PC box
               "1": "Who are you?",          // Set value of selected key to Topic variable, repeat above
               "2": "Goodbye."               // PC values = Player dialogue choices [KEY MATCHES NEXT TOPIC]
            }
         },




var Player = {
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

/*

var Player = { //new Character(0, "Player", "European", "Guard", 1, {});
Abilities: "Defense",
Angle: 360,
Armor: {
   Name: "Empty",
   Type: "empty",
   ATK: () => roll(5),        // Dice pool, eg. 2d10 = roll(10) + roll(10)
   DMG: () => roll(5),
   EVD: () => roll(5),
   DEF: () => roll(5),
   SEC: () => roll(5),
   HAX: () => roll(5),
   CPU: () => roll(5),
   SKL: "Empty",
   BNS: 0,
   Effect: 0,
   Creds: 0,
   Amount: 1,
   Sprite: "empty",
   Icon: "empty"
},
CHA: 13,
Chip: {
   Name: "Empty",
   Type: "empty",
   ATK: () => roll(5),        // Dice pool, eg. 2d10 = roll(10) + roll(10)
   DMG: () => roll(5),
   EVD: () => roll(5),
   DEF: () => roll(5),
   SEC: () => roll(5),
   HAX: () => roll(5),
   CPU: () => roll(5),
   SKL: "Empty",
   BNS: 0,
   Effect: 0,
   Creds: 0,
   Amount: 1,
   Sprite: "empty",
   Icon: "empty"
},
Class: "Guard",
DEX: 13,
Deck: {
   Name: "Empty",
   Type: "empty",
   ATK: () => roll(5),        // Dice pool, eg. 2d10 = roll(10) + roll(10)
   DMG: () => roll(5),
   EVD: () => roll(5),
   DEF: () => roll(5),
   SEC: () => roll(5),
   HAX: () => roll(5),
   CPU: () => roll(5),
   SKL: "Empty",
   BNS: 0,
   Effect: 0,
   Creds: 0,
   Amount: 1,
   Sprite: "empty",
   Icon: "empty"
},
EXP: 0,
HP: 15,
HP_min: 11,
HUM: 14,
ID: 0,
INS: 16,
INT: 15,
Items: {
   Empty: {
   Name: "Empty",
   Type: "empty",
   ATK: () => roll(5),        // Dice pool, eg. 2d10 = roll(10) + roll(10)
   DMG: () => roll(5),
   EVD: () => roll(5),
   DEF: () => roll(5),
   SEC: () => roll(5),
   HAX: () => roll(5),
   CPU: () => roll(5),
   SKL: "Empty",
   BNS: 0,
   Effect: 0,
   Creds: 0,
   Amount: 1,
   Sprite: "empty",
   Icon: "empty"
}
},
Level: 1,
MP: 12,
MP_min: 20,
Mood: 0,
Name: "Player",
Race: "European",
SP: 14,
SP_min: 11,
STM: 16,
STR: 14,
Status: "idle",
WIL: 11,
WIT: 12,
Weapon: {
   Name: "Empty",
   Type: "empty",
   ATK: () => roll(5),        // Dice pool, eg. 2d10 = roll(10) + roll(10)
   DMG: () => roll(5),
   EVD: () => roll(5),
   DEF: () => roll(5),
   SEC: () => roll(5),
   HAX: () => roll(5),
   CPU: () => roll(5),
   SKL: "Empty",
   BNS: 0,
   Effect: 0,
   Creds: 0,
   Amount: 1,
   Sprite: "empty",
   Icon: "empty"
},
X_pos: 0,
Y_pos: 0
}
Object.setPrototypeOf(Player, Character);
*/
