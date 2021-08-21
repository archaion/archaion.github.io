
/*************************************************************************************************************************/
/*                                                     DECLARATIONS                                                      */
/*************************************************************************************************************************/


var context = new AudioContext();      // Force autoplay

var Cast = Lines = Stage = Props = Bill = {};


/*************************************************************************************************************************/
/*                                                      FUNCTIONS                                                        */
/*************************************************************************************************************************/


////////////////////// COMMENTS = USAGE & ENGINE ACTIVATOR (PARAMETER TYPES) - SEE BELOW FOR NOTES /////////////////////////


// Random number generation (args: maximum value)
roll = (max) => Math.floor(Math.random() * max) + 1;

// Skill bonus from equipment (args: Character, "skill name")
chip = (ID, skill) => {
   var My = Cast[ID];
   return My.Chip.SKL == skill ? My.Chip.BNS : 0;
}

// Attribute and skill bonuses (args: Character.ATTRIBUTE)
bonus = (atr) => {
   if (atr - 10 >= 10) return 5;
   if (atr - 10 >= 8) return 4;
   if (atr - 10 >= 6) return 3;
   if (atr - 10 >= 4) return 2;
   if (atr - 10 >= 2) return 1;
   if (atr - 10 < 2) return 0;
}

// Get current value of Status property for "NPC" Character object (args: engine UID) 
GetStatus = (ID) => {
   var My = Cast[ID];               // Engine usage: GetStatus(x) -> value = "state" -> set State
   return My.Status;
}

// Get properties or values from object literals (args: object name, engine UID or property, key, value)
GetValue = (type, object, property, key, value) => {
   var data;
   if (value) {
      data = this[object][property][key][value];            // this = global object
   } else if (key) {
      data = this[object][property][key];
   } else if (property) {
      data = this[object][property];
   } else {
      data = this[object];
   }
   return type == 1 ? JSON.stringify({ "c2dictionary": true, data }) : data;
}

// Activate Script method of Stage object and return its Text property (args: engine UID)
Activate = (ID, object, property) => {
   return property ? this[object][ID][property].Script?.() : this[object][ID].Script?.();    // Call Script method
}

// Set angle of Vector object in engine (args: Character, "direction")
Turn = (ID, angle) => {
   var My = Cast[ID];

   switch (angle) {                            // Set as rotation of Player vector in engine 
      case "R": return My.Angle = 0;
      case "DR": return My.Angle = 45;
      case "D": return My.Angle = 90;
      case "DL": return My.Angle = 135;
      case "L": return My.Angle = 180;
      case "UL": return My.Angle = 225;
      case "U": return My.Angle = 270;
      case "UR": return My.Angle = 315;
   }
}

// Roll to avoid detection by holding "sneak" near targets (args: self, Character, line-of-sight)
Sneak = (ID1, ID2, sight) => {
   var My = Cast[ID1], Your = Cast[ID2];

   if (sight) {                                       // Only NPCs with LoS to Character (engine)
      var check = My.Stealth() + roll(10),            // Roll check
         target = Your.Alertness() + roll(10),
         distance = (Math.abs(My.Y_pos - Your.Y_pos) + Math.abs(My.X_pos - Your.X_pos));

      if (check < target + 100 - distance) {          // Success - Character is unnoticed
         if (Your.Mood < 0);                          // Failure - NPC may becomes hostile
      }
   }
}

// Equip item from inventory by selecting "Equip" in menu (args: Character, "item name")
Equip = (ID, item) => {
   var My = Cast[ID],
      equipment = My.Items[item];

   switch (equipment.Type) {
      case "Sword":
      case "Gun": return My.Weapon = equipment;
      case "Armor": return My.Armor = equipment;
      case "Deck": return My.Deck = equipment;
      case "Chip": return My.Chip = equipment;
   }
}

// Roll attack and damage by pressing "attack" near target (args: self, Character, LoS)
Attack = (ID1, ID2) => {
   var My = Cast[ID1], Your = Cast[ID2], result;

   if (My.Weapon.Type == "Sword" || My.Weapon.Type == "Empty") {
      if (roll(10) + My.ATK() + My.Weapon.ATK() > roll(10) + Your.DEF() + Your.Armor.DEF()) {     // Hitbox collision
         result = My.DMG() + My.Weapon.DMG() - bonus(Your.STM);
         return result > 0 ? Your.HP -= result : "miss";
      } return "miss";
   }

   if (My.Weapon.Type == "Gun") {
      if (roll(10) + My.ATK() + My.Weapon.ATK() > roll(10) + Your.EVD() + Your.Armor.EVD()) {     // LoS collision
         result = My.DMG() + My.Weapon.DMG() - bonus(Your.STM);
         return result > 0 ? Your.HP -= result : "miss";
      } return "miss";
   }

   if (My.Weapon.Type == "Deck") {
      if (roll(10) + My.HAX() + My.Deck.HAX() > roll(10) + Your.SEC() + Your.Deck.SEC()) {
         result = My.CPU() + My.Weapon.CPU() - bonus(Your.INT);
         return result > 0 ? Your.SP -= result : "miss";
      } return "miss";
   }
}

// Roll dialogue skill checks by selecting options in dialogue menu (args: self, Character, "skill name")
Talk = (ID1, ID2, skill, line) => {
   var My = Cast[ID1], Your = Cast[ID2],
      mine, yours, check, target;
   // IF LINE = NULL, ITERATE / RETURN PC & NPC VALUES OF KEY MATCHING ID2
   // LINE ARGUMENT = UID OF TEXT OBJECT SELECTED IN ENGINE
   // MATCH WITH CORRESPONDING "NPC" KEY & RETURN VALUE 
   //MATCH ID WITH PROPERTY OF LINES OBJECT
   //RETURN VALUE

   switch (skill) {
      case "Finance": (mine = My.Finance(), yours = Your.Streetwise()); break;            // On buying or selling (prices)
      case "Intimidate": (mine = My.Intimidate(), yours = Your.Etiquette()); break;
      case "Politics": (mine = My.Politics(), yours = Your.Intuition()); break;
      case "Investigate": (mine = My.Investigate(), yours = Your.Subterfuge()); break;    // On use of NPC decks (access)
   }

   check = mine + roll(10);                                                               // Roll skill checks
   target = yours + roll(10);
   check > target ? Your.Mood += check - target : Your.Mood -= target - check;            // Increase or decrease Your.Mood

   /* 
   //----------------SET RESPONSE TO DIALOGUE OPTIONS IN ENGINE
   My.Talk = (Your, mood) => {
      if response = politics, My.Skill(Your, "intuition")
      if response = intimidate, My.Skill(Your, "etiquette")
      if Your.Mood > 0
   END -> My.Status = "leave"
 
   }*/
}

// Add or remove items in Character inventory (args: engine UID, "add" OR "remove", number, item name)
Trade = (ID, change, number, name) => {
   var My = Cast[ID];          // If called from Talk(), ID = Your.ID

   if (change == "add") {
      return My.Items[name] ? My.Items[name].Amount += number :
         (My.Items[name] = Props[name], My.Items[name].Amount = number);
   } else if (change == "remove") {
      return My.Items[name].Amount > number ? My.Items[name].Amount -= number :
         delete My.Items[name];
   }
}

// Roll craft check to combine items by pressing "craft" at workbench (args: self, item name, item name)
Craft = (ID, itemA, itemB) => {
   var My = Cast[ID],
      item1 = My.Items[itemA], item2 = My.Items[itemB],
      check = My.Crafts() + roll(10),                               // Roll check
      target = My.Crafts() + roll(20) - My.Research();

   switch (itemA, itemB) {                                        // Items must be in correct order
      case ("Hydrocell", "Antenna"):
         item1.Amount == 1 ? delete item1 : item1.Amount -= 1;    // Remove items used
         item2.Amount == 1 ? delete item2 : item2.Amount -= 1;
         if (check > target) {                                    // Success: create superior item
            return My.Items.Charger_Full ?
               My.Items.Charger_Full.Amount += 1 :                // Increase existing item amount, or create new item
               My.Items.Charger_Full = {
                  Name: "Charger (full)",
                  Type: "Parts",
                  Effect: 10,
                  Amount: 1,
                  Sprite: "Charger_Full.png",
                  Icon: "Charger_Full_icon.png"
               };
         } else {                                                 // Failure: create inferior item
            return My.Items.Charger_Half ?
               My.Items.Charger_Half.Amount += 1 :
               My.Items.Charger_Half = {
                  Name: "Charger (half)",
                  Type: "Parts",
                  Effect: 5,
                  Amount: 1,
                  Sprite: "Charger_Half.png",
                  Icon: "Charger_Half_icon.png"
               };
         };
      case ("Opium", "Bleach"):
         item1.Amount == 1 ? delete item1 : item1.Amount -= 1;
         item2.Amount == 1 ? delete item2 : item2.Amount -= 1;
         if (check > target) {
            return My.Items.Morphine_Full ?
               My.Items.Morphine_Full.Amount += 1 :
               My.Items.Morphine_Full = {
                  Name: "Morphine (full)",
                  Type: "Meds",
                  Effect: 10,
                  Amount: 1,
                  Sprite: "Morphine_Full.png",
                  Icon: "Morphine_Full_icon.png"
               };
         } else {
            return My.Items.Morphine_Half ?
               My.Items.Morphine_Half.Amount += 1 :
               My.Items.Morphine_Half = {
                  Name: "Morphine (half)",
                  Type: "Meds",
                  Effect: 5,
                  Amount: 1,
                  Sprite: "Morphine_Half.png",
                  Icon: "Morphine_Half_icon.png"
               };
         };
      case ("Vitae", "Soma"):
         item1.Amount == 1 ? delete item1 : item1.Amount -= 1;
         item2.Amount == 1 ? delete item2 : item2.Amount -= 1;
         if (check > target) {
            return My.Items.Fetch_Full ?
               My.Items.Fetch_Full.Amount += 1 :
               My.Items.Fetch_Full = {
                  Name: "Fetch (full)",
                  Type: "Drugs",
                  Effect: 10,
                  Amount: 1,
                  Sprite: "Fetch_Full.png",
                  Icon: "Fetch_Full_icon.png"
               };
         } else {
            return My.Items.Fetch_Half ?
               My.Items.Fetch_Half.Amount += 1 :
               My.Items.Fetch_Half = {
                  Name: "Fetch (half)",
                  Type: "Drugs",
                  Effect: 5,
                  Amount: 1,
                  Sprite: "Fetch_Half.png",
                  Icon: "Fetch_Half_icon.png"
               };
         }
      // Items not compatible (add visual effect)
   }
}

// Roll to use healing item by pressing hotkey OR "select" in menu (args: self, Character OR self, "item name")
Heal = (ID1, ID2, itm) => {
   var My = Cast[ID1], Your = Cast[ID2], item = My.Items[itm],
      mine, yours, check, target, effect;

   switch (item.Type) {
      case "Parts": (mine = My.Repair(), yours = Your.Technology()); break;   // Use "Charger" item
      case "Meds": (mine = My.Medicine(), yours = Your.Science()); break;     // Use "Morphine" item
      case "Drugs": (mine = My.Occult(), yours = Your.Survival()); break;     // Use "Fetch" item
   }

   check = mine + roll(10);                                                   // Roll check
   target = mine + roll(20) - yours;
   effect = item.Effect + check - target;

   item.Amount == 1 ? delete item : item.Amount -= 1;                         // Remove item used

   if (check > target) {                                                      // Success: limited stat increase
      switch (item.Type) {
         case "Parts": return Your.SP < Your.SP_max() - effect ?
            Your.SP += effect : Your.SP = Your.SP_max();
         case "Meds": return Your.HP < Your.HP_max() - effect ?
            Your.HP += effect : Your.HP = Your.HP_max();
         case "Drugs": return Your.MP < Your.MP_max() - effect ?
            Your.MP += effect : Your.MP = Your.MP_max();
      }
   } else {                                                                   // Failure: stat decrease
      switch (item.Type) {
         case "Parts": return Your.MP -= item.Effect - (target - check);
         case "Meds": return Your.SP -= item.Effect - (target - check);
         case "Drugs": return Your.HP -= item.Effect - (target - check);
      }
   }
}

// Restore vital stats to maximum by selecting "rest" from menu (args: self)
Rest = (ID) => {
   var My = Cast[ID];
   if (GetStatus(ID) == "idle") {       // Not in dialogue or combat (check distance to NPCs)
      setTimeout(() => (My.HP = My.HP_max(), My.SP = My.SP_max(), My.MP = My.MP_max()), 5000);
   }
}

// Use class ability by pressing "ability" near target (args: self, Character, "ability name")
Ability = (ID1, ID2, ability) => {
   var My = Cast[ID1], Your = Cast[ID2],
      mine, yours, check, target, mine_org, yours_org;

   switch (ability) {
      case "Vengeance": (mine = My.STR, yours = Your.DEX); break;
      case "Defense": (mine = My.DEX, yours = Your.STR); break;
      case "Celerity": (mine = My.DEX, yours = Your.WIL); break;
      case "Obfuscate": (mine = My.WIL, yours = Your.DEX); break;
      case "Redemption": (mine = My.STM, yours = Your.WIT); break;
      case "Martyrdom": (mine = My.WIT, yours = Your.STM); break;
      case "Visionary": (mine = My.INS, yours = Your.WIT); break;
      case "Innocence": (mine = My.WIT, yours = Your.INS); break;
      case "Auspex": (mine = My.INT, yours = Your.CHA); break;
      case "Dominate": (mine = My.CHA, yours = Your.INT); break;
      case "Presence": (mine = My.CHA, yours = Your.HUM); break;
      case "Judgement": (mine = My.HUM, yours = Your.CHA); break;
   }
   mine_org = mine;              // Save original values
   yours_org = yours;

   check = mine + roll(10);      // Roll check
   target = yours + roll(10);

   if (check > target) {         // Temporary attribute increase / decrease
      mine += check - target;
      yours -= check - target;
      setTimeout(() => (mine = mine_org, yours = yours_org), 30000);
   }
}



/*************************************************************************************************************************/
/*                                                     CONSTRUCTORS                                                      */
/*************************************************************************************************************************/


////////////////////////////////// OUTPUTS RANDOMIZED VALUES ////////////////////////////////

// Character constructor function (args: int, "name", "race", "class", int, object list)
function Character(id, nam, rac, cls, lvl, itm) {

   //------------------------------------ Traits ---------------------------------
   // Properties 
   this.ID = id;           // Corresponds to UID of object (engine)
   this.Name = nam;
   this.Race = rac;
   this.Class = cls;
   this.Level = lvl;       // Assign bonus points on level up
   this.EXP = 0;

   // States
   this.Status = "idle";   // Transition to corresponding state (engine)
   this.Mood = 0;
   this.Quests = {};

   // Engine (read only)
   this.Angle = 0;         // Degrees clockwise from right (engine)
   this.Y_pos = 0;         // Position in layout (engine)
   this.X_pos = 0;

   //------------------------------------ Inventory ---------------------------------
   // Starting items
   this.Items = itm;

   // Placeholder item
   this.Items.Empty = {
      Name: "Empty",
      Type: "Empty",
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
   };

   // Currently equipped
   this.Weapon = this.Items.Empty;
   this.Armor = this.Items.Empty;
   this.Deck = this.Items.Empty;
   this.Chip = this.Items.Empty;

   //------------------------------------ Attributes ---------------------------------
   // Physical
   this.STR = 10 + roll(4) + (this.Race == "African" ? 2 : (this.Race == "European" ? 0 : -1));
   this.DEX = 10 + roll(4) + (this.Race == "Asian" ? 2 : 0);
   this.STM = 10 + roll(4) + (this.Race == "European" ? 2 : 0);

   // Mental
   this.INT = 10 + roll(4) + (this.Race == "Asian" ? 2 : (this.Race == "European" ? 1 : -1));
   this.WIT = 10 + roll(4) + (this.Race == "African" ? 2 : 0);
   this.CHA = 10 + roll(4) + (this.Race == "European" ? 1 : 0);

   // Spiritual
   this.WIL = 10 + roll(4) + (this.Race == "African" ? 2 : 0);
   this.INS = 10 + roll(4) + (this.Race == "European" ? 2 : 0);
   this.HUM = 10 + roll(4) + (this.Race == "Asian" ? 2 : 0);

   //------------------------------------ Vital Stats ---------------------------------
   // Base values   
   this.HP_min = roll(10) + roll(10) + roll(10);
   this.SP_min = roll(10) + roll(10) + roll(10);
   this.MP_min = roll(10) + roll(10) + roll(10);

   // Current values
   this.HP = this.HP_max();
   this.SP = this.SP_max();
   this.MP = this.MP_max();

   //------------------------------------ Abilities ---------------------------------
   // Current ability
   this.Abilities = this.Abilities_cls();
}


//////////////////////////////////////// PROTOTYPE FUNCTIONS ////////////////////////////////////////

// Vital stats
Character.prototype.HP_max = function () { return this.HP_min + this.Level + bonus(this.STM) };
Character.prototype.SP_max = function () { return this.SP_min + this.Level + bonus(this.INT) };
Character.prototype.MP_max = function () { return this.MP_min + this.Level + bonus(this.WIL) };

// Combat stats
Character.prototype.ATK = function () {
   switch (this.Weapon.Type) {
      case "Sword": return this.Melee() + bonus(this.INS);
      case "Gun": return this.Firearms() + bonus(this.INS);
      default: return this.Survival();
   }
};
Character.prototype.DMG = function () {                 // Add secondary attribute bonus if weapon / armor equipped
   switch (this.Weapon.Type) {
      case "Sword": return bonus(this.STR);
      case "Gun": return bonus(this.DEX);
      default: return bonus(this.INS);
   }
};
Character.prototype.DEF = function () {
   return this.Armor.Type == "Armor" ? this.Athletics() + bonus(this.STM) : this.Athletics();
};
Character.prototype.EVD = function () {
   return this.Armor.Type == "Armor" ? this.Dodge() + bonus(this.STM) : this.Dodge();
};
Character.prototype.HAX = function () {
   return this.Deck.Type == "Deck" ? this.Computer() + bonus(this.WIT) : this.Computer();
};
Character.prototype.CPU = function () {
   return this.Deck.Type == "Deck" ? this.Technology() + bonus(this.INT) : this.Technology();
};
Character.prototype.SEC = function () {
   return this.Deck.Type == "Deck" ? this.Security() + bonus(this.INT) : this.Security();
};

//------------------------------------ Skills
// Combat spec
Character.prototype.Firearms = function () {
   return 10 + chip(this.ID, "Firearms") + bonus(this.STR) +
      (this.Class == "Soldier" ? 3 : (this.Class == "Guard" ? 1 : 0));
};
Character.prototype.Athletics = function () {
   return 10 + chip(this.ID, "Athletics") + bonus(this.WIL) +
      (this.Class == "Soldier" ? 2 : (this.Class == "Guard" ? 1 : 0));
};
Character.prototype.Melee = function () {
   return 10 + chip(this.ID, "Melee") + bonus(this.STR) +
      (this.Class == "Guard" ? 3 : (this.Class == "Soldier" ? 1 : 0));
};
Character.prototype.Dodge = function () {
   return 10 + chip(this.ID, "Dodge") + bonus(this.WIL) +
      (this.Class == "Guard" ? 2 : (this.Class == "Soldier" ? 1 : 0));
};

// Operations spec
Character.prototype.Computer = function () {
   return 10 + chip(this.ID, "Computer") + bonus(this.DEX) +
      (this.Class == "Hacker" ? 3 : (this.Class == "Thief" ? 1 : 0));
};
Character.prototype.Alertness = function () {
   return 10 + chip(this.ID, "Alertness") + bonus(this.WIL) +
      (this.Class == "Hacker" ? 2 : (this.Class == "Thief" ? 1 : 0));
};
Character.prototype.Stealth = function () {
   return 10 + chip(this.ID, "Stealth") + bonus(this.DEX) +
      (this.Class == "Thief" ? 3 : (this.Class == "Hacker" ? 1 : 0));
};
Character.prototype.Security = function () {
   return 10 + chip(this.ID, "Security") + bonus(this.WIL) +
      (this.Class == "Thief" ? 2 : (this.Class == "Hacker" ? 1 : 0));
};

// Support spec
Character.prototype.Repair = function () {
   return 10 + chip(this.ID, "Repair") + bonus(this.STM) +
      (this.Class == "Tech" ? 3 : (this.Class == "Medic" ? 1 : 0));
};
Character.prototype.Technology = function () {
   return 10 + chip(this.ID, "Technology") + bonus(this.INS) +
      (this.Class == "Tech" ? 2 : (this.Class == "Medic" ? 1 : 0));
};
Character.prototype.Medicine = function () {
   return 10 + chip(this.ID, "Medicine") + bonus(this.STM) +
      (this.Class == "Medic" ? 3 : (this.Class == "Tech" ? 1 : 0));
};
Character.prototype.Survival = function () {
   return 10 + chip(this.ID, "Survival") + bonus(this.INS) +
      (this.Class == "Medic" ? 2 : (this.Class == "Tech" ? 1 : 0));
};

// Unknown spec
Character.prototype.Occult = function () {
   return 10 + chip(this.ID, "Occult") + bonus(this.WIT) +
      (this.Class == "Scholar" ? 3 : (this.Class == "Artisan" ? 1 : 0));
};
Character.prototype.Research = function () {
   return 10 + chip(this.ID, "Research") + bonus(this.INS) +
      (this.Class == "Scholar" ? 2 : (this.Class == "Artisan" ? 1 : 0));
};
Character.prototype.Crafts = function () {
   return 10 + chip(this.ID, "Crafts") + bonus(this.WIT) +
      (this.Class == "Artisan" ? 3 : (this.Class == "Scholar" ? 1 : 0));
};
Character.prototype.Science = function () {
   return 10 + chip(this.ID, "Science") + bonus(this.INS) +
      (this.Class == "Artisan" ? 2 : (this.Class == "Scholar" ? 1 : 0));
};

// Business spec
Character.prototype.Finance = function () {
   return 10 + chip(this.ID, "Finance") + bonus(this.INT) +
      (this.Class == "Trader" ? 3 : (this.Class == "Dealer" ? 1 : 0));
};
Character.prototype.Etiquette = function () {
   return 10 + chip(this.ID, "Etiquette") + bonus(this.HUM) +
      (this.Class == "Trader" ? 2 : (this.Class == "Dealer" ? 1 : 0));
};
Character.prototype.Intimidate = function () {
   return 10 + chip(this.ID, "Intimidate") + bonus(this.INT) +
      (this.Class == "Dealer" ? 3 : (this.Class == "Trader" ? 1 : 0));
};
Character.prototype.Streetwise = function () {
   return 10 + chip(this.ID, "Streetwise") + bonus(this.HUM) +
      (this.Class == "Dealer" ? 2 : (this.Class == "Trader" ? 1 : 0));
};

// Diplomacy spec
Character.prototype.Politics = function () {
   return 10 + chip(this.ID, "Politics") + bonus(this.CHA) +
      (this.Class == "Agent" ? 3 : (this.Class == "Officer" ? 1 : 0));
};
Character.prototype.Subterfuge = function () {
   return 10 + chip(this.ID, "Subterfuge") + bonus(this.HUM) +
      (this.Class == "Agent" ? 2 : (this.Class == "Officer" ? 1 : 0));
};
Character.prototype.Investigate = function () {
   return 10 + chip(this.ID, "Investigate") + bonus(this.CHA) +
      (this.Class == "Officer" ? 3 : (this.Class == "Agent" ? 1 : 0));
};
Character.prototype.Intuition = function () {
   return 10 + chip(this.ID, "Intuition") + bonus(this.HUM) +
      (this.Class == "Officer" ? 2 : (this.Class == "Agent" ? 1 : 0));
};

// Abilities
Character.prototype.Abilities_cls = function () {
   switch (this.Class) {
      case "Soldier": return { Name: "Vengeance", Caption: "Increase your STR by 1d10 and reduce enemy DEX by 1d10 for 30s" };
      case "Guard": return { Name: "Defense", Caption: "Increase your DEX by 1d10 and reduce enemy STR by 1d10 for 30s" };
      case "Hacker": return { Name: "Celerity", Caption: "Increase your DEX by 1d10 and reduce enemy WIL by 1d10 for 30s" };
      case "Thief": return { Name: "Obfuscate", Caption: "Increase your WIL by 1d10 and reduce enemy DEX by 1d10 for 30s" };
      case "Tech": return { Name: "Redemption", Caption: "Increase your STM by 1d10 and reduce enemy WIT by 1d10 for 30s" };
      case "Medic": return { Name: "Martyrdom", Caption: "Increase your WIT by 1d10 and reduce enemy STM by 1d10 for 30s" };
      case "Scholar": return { Name: "Visionary", Caption: "Increase your INS by 1d10 and reduce enemy WIT by 1d10 for 30s" };
      case "Artisan": return { Name: "Innocence", Caption: "Increase your WIT by 1d10 and reduce enemy INS by 1d10 for 30s" };
      case "Trader": return { Name: "Auspex", Caption: "Increase your INT by 1d10 and reduce enemy CHA by 1d10 for 30s" };
      case "Dealer": return { Name: "Dominate", Caption: "Increase your CHA by 1d10 and reduce enemy INT by 1d10 for 30s" };
      case "Agent": return { Name: "Presence", Caption: "Increase your CHA by 1d10 and reduce enemy HUM by 1d10 for 30s" };
      case "Officer": return { Name: "Judgement", Caption: "Increase your by 1d10 HUM and reduce enemy CHA by 1d10 for 30s" };
   }
}

/*************************************************************************************************************************/
/*                                                        OBJECTS                                                        */
/*************************************************************************************************************************/


// STORE CONSTRUCTOR OUTPUT AS JSON & LOAD ON ENGINE START - DO NOT CALL ON STARTUT
// EXPLICIT DECLARATION OF PLAYER FOR TESTING ONLY - store args in local engine variables for Character creation


Props = {                        // Usable and equippable items
   Empty: {                      // Placeholder
      Name: "Empty",
      Type: "Empty",
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
      Credits: 0,
      Amount: 1,
      Sprite: "empty",
      Icon: "empty"
   },
   Credits: {
      Name: "Credits",              // Function reference and in-game display
      Type: "Money",                // Function reference
      Description: "The root of many evils.",
      Amount: 1,                    // Number in inventory (default 1)
      Sprite: "Credits.png",        // Images to display in-game (save in Construct -> Files)
      Icon: "Credits_icon.png"
   },
   Katana: {
      Name: "Katana",
      Type: "Sword",
      ATK: () => roll(12),          // Item stats
      DMG: () => roll(10),
      Attack: "1d12",               // Engine display values
      Damage: "1d10",
      Credits: 500,                   // Sale / purchase value 
      Amount: 1,
      Sprite: "Katana.png",
      Icon: "Katana_icon.png"
   },
   Knife: {
      Name: "Knife",
      Type: "Sword",
      ATK: () => roll(5),
      DMG: () => roll(5),
      Attack: "1d5",
      Damage: "1d5",
      Credits: 10,
      Amount: 1,
      Sprite: "Knife.png",
      Icon: "Knife_icon.png"
   },
   MP6: {
      Name: "MP6",
      Type: "Gun",
      ATK: () => roll(10),
      DMG: () => roll(12),
      Attack: "1d10",
      Damage: "1d12",
      Credits: 700,
      Amount: 1,
      Sprite: "MP6.png",
      Icon: "MP6_icon.png"
   },
   "Leather Coat": {
      Name: "Leather Coat",
      Type: "Armor",
      EVD: () => roll(12),
      DEF: () => roll(10),
      Evade: "1d12",
      Defense: "1d10",
      Credits: 150,
      Amount: 1,
      Sprite: "Leather_Coat.png",
      Icon: "Leather_Coat_icon.png"
   },
   "Street Clothes": {
      Name: "Street Clothes",
      Type: "Armor",
      EVD: () => roll(5),
      DEF: () => roll(5),
      Evade: "1d5",
      Defense: "1d5",
      Credits: 20,
      Amount: 1,
      Sprite: "Street_Clothes.png",
      Icon: "Street_Clothes_icon.png"
   },
   "SynTech 40x": {
      Name: "SynTech 40x",
      Type: "Deck",
      SEC: () => roll(10),
      HAX: () => roll(10),
      CPU: () => roll(12),
      Speed: "1d12",
      Hack: "1d10",
      Cipher: "1d12",
      Credits: 1000,
      Amount: 1,
      Sprite: "SynTech_3000.png",
      Icon: "SynTech_3000_icon.png"
   },
   NiteViz: {
      Name: "NiteViz",
      Type: "Chip",
      SKL: "Alertness",
      BNS: 1,                       // On skill check, add BNS
      Skill: "Alertness",
      Bonus: 1,
      Credits: 250,
      Amount: 1,
      Sprite: "NiteViz.png",
      Icon: "NiteViz_icon.png"
   },
   //Crafting materials / consumables
   Hydrocell: {                     // Source: merchants, NPC computers
      Name: "Hydrocell",
      Type: "Material",
      Description: "Combines with Antenna",
      Amount: 1,
      Sprite: "Hydrocell.png",      // Image: blue box
      Icon: "Hydrocell_icon.png"
   },
   Antenna: {                       // Source: merchants, NPC computers
      Name: "Antenna",
      Type: "Material",
      Description: "Combines with Hydrocell",
      Amount: 1,
      Sprite: "Antenna.png",        // Image: grey cylinder
      Icon: "Antenna_icon.png"
   },
   Opium: {                         // Source: merchants, red flowers
      Name: "Opium",
      Type: "Material",
      Description: "Combines with Bleach",
      Amount: 1,
      Sprite: "Opium.png",          // Image: green pod
      Icon: "Opium_icon.png"
   },
   Bleach: {                        // Source: merchants, enemy NPCs
      Name: "Bleach",
      Type: "Material",
      Description: "Combines with Opium",
      Amount: 1,
      Sprite: "Bleach.png",         // Image: brown bottle
      Icon: "Bleach_icon.png"
   },
   Vitae: {                         // Source: vampires
      Name: "Vitae",
      Type: "Material",
      Description: " Combines with Soma",
      Amount: 1,
      Sprite: "Vitae.png",          // Image: red vial
      Icon: "Vitae_icon.png"
   },
   Soma: {                          // Source: insects
      Name: "Soma",
      Type: "Material",
      Description: "Combines with Vitae",
      Amount: 1,
      Sprite: "Soma.png",           // Image: yellow jar
      Icon: "Soma_icon.png"
   },
   "Charger (full)": {                  // Result of Craft("Hydrocell", "Antenna")
      Name: "Charger (full)",
      Type: "Parts",
      Description: "Restores 10 SP",
      Effect: 10,
      Amount: 1,
      Sprite: "Charger.png",        // Image: green box (black wires)
      Icon: "Charger_icon.png"
   },
   "Morphine (full)": {                 // Result of Craft("Opium", "Bleach")
      Name: "Morphine (full)",
      Type: "Meds",
      Description: "Restores 10 HP",
      Effect: 10,
      Amount: 1,
      Sprite: "Morphine.png",       // Image: orange vial (white label)
      Icon: "Morphine_icon.png"
   },
   "Fetch (full)": {                    // Result of Craft("Vitae", "Soma")
      Name: "Fetch (full)",         // Street version of the "Mead of Poetry"
      Type: "Drugs",
      Description: "Restores 5 MP",
      Effect: 5,
      Amount: 1,
      Sprite: "Fetch.png",          // Image: purple jar (grey cap) 
      Icon: "Fetch_icon.png"
   },
   "Charger (half)": {
      Name: "Charger (half)",
      Type: "Parts",
      Description: "Restores 5 SP",
      Effect: 5,
      Amount: 1,
      Sprite: "Charger_Half.png",
      Icon: "Charger_icon.png"
   },
   "Morphine (half)": {
      Name: "Morphine (half)",
      Type: "Meds",
      Description: "Restores 5 HP",
      Effect: 5,
      Amount: 1,
      Sprite: "Morphine_Half.png",
      Icon: "Morphine_Half_icon.png"
   },
   "Fetch (half)": {
      Name: "Fetch (half)",
      Type: "Drugs",
      Description: "Restores 5 MP",
      Effect: 5,
      Amount: 1,
      Sprite: "Fetch_Half.png",
      Icon: "Fetch_Half_icon.png"
   },
   // Food
   Apple: {
      Name: "Apple",
      Type: "Food",
      Description: "Restores 1 HP",
      Effect: 1,
      Amount: 1,
      Sprite: "Apple.png",
      Icon: "Apple_icon.png"
   }
};

//var Player = new Character(0, "Player", "European", "Guard", 1, {});
var Player = JSON.parse('{"ID":0,"Name":"Oscar Yeager","Race":"European","Class":"Guard","Level":1,"EXP":0,"Status":"idle","Mood":0,"Angle":0,"Y_pos":0,"X_pos":0,"Quests":{},"Items":{},"Weapon":{},"Armor":{},"Deck":{},"Chip":{},"STR":12,"DEX":13,"STM":16,"INT":14,"WIT":14,"CHA":14,"WIL":11,"INS":13,"HUM":13,"HP_min":13,"SP_min":18,"MP_min":13,"HP":17,"SP":16,"MP":14}');
Player.Chip = Player.Deck = Props["Empty"];
Player.Weapon = Player.Items.Knife = Props["Knife"];
Player.Armor = Player.Items["Street Clothes"] = Props["Street Clothes"];
Player.Abilities = { Name: "Defense", Caption: "Increase your DEX by 1d10 and reduce enemy STR by 1d10 for 30s" }
Player.__proto__ = Character.prototype;

var Enemy = new Character(2, "Enemy", "Asian", "Soldier", 1, {});

Cast = {                         // Player and NPC objects
   0: Player,
   2: Enemy                      // NPC key must match UID in engine
};

Bill = {                         // Menu reference lists - call values in engine
   Character: {
      Info: {
         Name: Player.Name, Level: Player.Level, Race: Player.Race, Class: Player.Class, EXP: Player.EXP,
         HP: Player.HP, SP: Player.SP, MP: Player.MP, HP_max: Player.HP_max(), SP_max: Player.SP_max(), MP_max: Player.MP_max(),
         Weapon: Player.Weapon.Name, Armor: Player.Armor.Name, Deck: Player.Deck.Name, Chip: Player.Chip.Name
      },
      Stats: {
         Strength: Player.STR, Dexterity: Player.DEX, Stamina: Player.STM,
         Intelligence: Player.INT, Wits: Player.WIT, Charisma: Player.CHA,
         Willpower: Player.WIL, Insight: Player.INS, Humanity: Player.HUM,
         Attack: Player.ATK(), Damage: Player.DMG(), Defense: Player.DEF(), Evade: Player.EVD(),
         Speed: Player.CPU(), Cipher: Player.SEC(), Hack: Player.HAX(),
      },
      Skills: {
         Firearms: Player.Firearms(), Athletics: Player.Athletics(), Melee: Player.Melee(), Dodge: Player.Dodge(),
         Computer: Player.Computer(), Alertness: Player.Alertness(), Stealth: Player.Stealth(), Security: Player.Security(),
         Repair: Player.Repair(), Technology: Player.Technology(), Medicine: Player.Medicine(), Survival: Player.Survival(),
         Occult: Player.Occult(), Research: Player.Research(), Crafts: Player.Crafts(), Science: Player.Science(),
         Finance: Player.Finance(), Etiquette: Player.Etiquette(), Intimidate: Player.Intimidate(), Streetwise: Player.Streetwise(),
         Politics: Player.Politics(), Subterfuge: Player.Subterfuge(), Investigate: Player.Investigate(), Intuition: Player.Intuition()
      },
      Feats: {
         Ability: Player.Abilities.Name, Description: Player.Abilities.Caption
      }
   },
   Quests: {
      Active: Player.Quests
   }
}

Lines = {                        // NPC dialogue - see GetLines()
   2: {                                                  // NPC engine UID
      0: {                                               // Topic ID
         NPC: "Yes? What do you want?",
         Text: "1. Who are you? \n2. Nothing. ( Leave )",  // User input prompts, with newline before each
         1: "1",                                           // Key = user input, value = next topic
         2: "END",                                         // "END" value exits "talk" state
         Quest: 0                                          // Reset dialogue
      },
      1: {
         NPC: "The name's Goldman. I own this place.",
         Text: "1. Do you have any work for me?",
         1: "2",
      },
      2: {
         Path1: {
            NPC: "As a matter of fact, I do. Get me some apples from that tree over there and I'll pay you a dollar.",
            Text: "1. Okay, I'll be right back with your apples Mr. Goldman.\n2. No, get them yourself.",
            1: "3",
            2: "4"
         },
         Path2: {
            Mute: "yes",
            NPC: "*Goldman ignores you.*",
            Text: "1. ( Leave )",
            1: "END",
            Quest: 0
         },
         Script: function () {
            return Player.Quests.Goldman ? "Path2" : "Path1";  // Display Text1 or Text2 in engine
         },
      },
      3: {                                               // Accept quest = set INSTANCE variable
         NPC: "Very good. And be quick about it, I don't have all day.",
         Text: "1. Yes, sir. ( Leave )",
         Update: "Mission accepted.\n( Press F3 to view )", // Display in-game message
         1: "END",
         Quest: "A0",                                    // Set to NPCs.Topic variable - "END" topic only
         Script: function () {
            return Player.Quests.Goldman = { A0: "Current status: \n\nFetching some apples for Goldman." };    // Key = NPC ID, value = description !!!!!!!!!
         }
      },
      4: {
         NPC: "Fine, I'll just pay someone else to do it.",
         Text: "1. Good luck. ( Leave )",
         1: "END",                                       
         Quest: 0                                        
      },
      // QUEST-SPECIFIC DIALOGUE:
      A0: {
         NPC: "Do you have those apples I asked for?",
         Text: "1. Yes, right here. \n2. No, I don't have them.",
         1: "A1",                                        // Topic = quest "A1"
         2: "A2"
      },
      A1: {                                              // Reset variable and call Trade() 
         Path1: {
            NPC: "Alright, hand them over then.",
            Text: "1. ( Give apples )",
            1: "A3"
         },
         Path2: {
            NPC: "Alright, hand them over then.",
            Text: "1. I don't have them.",
            1: "A2",
         },
         Script: function () {
            return Player.Items.Apple ? "Path1" : "Path2";  // Display Text1 or Text2 in engine
         }
      },
      A2: {                                              // No change to instance variable
         NPC: "Well hurry up and get them!",
         Text: "1. Okay. ( Leave )",
         1: "END",
         Quest: "A0"                                     // Reset dialogue to quest start
      },
      A3: {
         NPC: "Excellent, heres your dollar.",
         Text: "1. Thanks. ( Leave )",
         Update: "Objective added. ( F3 )",
         1: "END",
         Quest: 0,                                       // End quest & reset dialogue
         Script: function () {
            Player.Quests.Goldman = { A0: "Current status: \n\nYour payment is counterfeit. Kill Goldman and take his money."} // Script NPC to attack
            Trade(0, "remove", 1, "Apple");
            return "reward"
         }
      }
   }
};

Stage = {                        // Scripted objects and events
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

