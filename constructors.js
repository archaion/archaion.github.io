
////////////////////////////////// CALL FOR EACH NEW NPC (EG. MOBS) ////////////////////////////////

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
      case "sword": return this.Melee() + bonus(this.INS);
      case "gun": return this.Firearms() + bonus(this.INS);
      default: return this.Survival();
   }
};
Character.prototype.DMG = function () {                 // Add secondary attribute bonus if weapon / armor equipped
   switch (this.Weapon.Type) {
      case "sword": return bonus(this.STR);
      case "gun": return bonus(this.DEX);
      default: return bonus(this.INS);
   }
};
Character.prototype.DEF = function () {
   return this.Armor.Type == "armor" ? this.Athletics() + bonus(this.STM) : this.Athletics();
};
Character.prototype.EVD = function () {
   return this.Armor.Type == "armor" ? this.Dodge() + bonus(this.STM) : this.Dodge();
};
Character.prototype.HAX = function () {
   return this.Deck.Type == "deck" ? this.Computer() + bonus(this.WIT) : this.Computer();
};
Character.prototype.CPU = function () {
   return this.Deck.Type == "deck" ? this.Technology() + bonus(this.INT) : this.Technology();
};
Character.prototype.SEC = function () {
   return this.Deck.Type == "deck" ? this.Security() + bonus(this.INT) : this.Security();
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




/*
Skill = (My, skill) => {
   var perk;
      switch (skill) {
         case "Firearms": My.Class == "Soldier" ? perk = 3 : (My.Class == "Guard" ? perk = 1 : perk = 0);
         case "Athletics": My.Class == "Soldier" ? perk = 2 : (My.Class == "Guard" ? perk = 1 : perk = 0);
         case "Melee": My.Class == "Guard" ? perk = 3 : (My.Class == "Soldier" ? perk = 1 : perk = 0);
         case "Dodge": My.Class == "Guard" ? perk = 2 : (My.Class == "Soldier" ? perk = 1 : perk = 0);
         case "Computer": My.Class == "Hacker" ? perk = 3 : (My.Class == "Thief" ? perk = 1 : perk = 0);
         case "Alertness": My.Class == "Hacker" ? perk = 2 : (My.Class == "Thief" ? perk = 1 : perk = 0);
         case "Stealth": My.Class == "Thief" ? perk = 3 : (My.Class == "Hacker" ? perk = 1 : perk = 0);
         case "Security": My.Class == "Thief" ? perk = 2 : (My.Class == "Hacker" ? perk = 1 : perk = 0);
         case "Repair":
         case "Technology": perk =
         case "Medicine": perk =
         case "Survival": perk =
         case "Crafts": perk =
         case "Research": perk =
         case "Occult": perk =
         case "Science": perk =
         case "Finance": perk =
         case "Streetwise": perk =
         case "Intimidate": perk =
         case "Etiquette": perk =
         case "Politics": perk =
         case "Intuition": perk =
         case "Investigate": perk =
         case "Subterfuge": perk =
      }
      return My[skill] = 10 + perk() + chip(My, skill) + bonus(My[stat])
   };



   // Racial starting bonuses
   STR_rac = rac == "African" ? 2 : rac == "European" ? 0 : -1;
   DEX_rac = rac == "Asian" ? 2 : 0;
   STM_rac = rac == "European" ? 2 : 0;
   INT_rac = rac == "Asian" ? 2 : rac == "European" ? 1 : -1;
   WIT_rac = rac == "African" ? 2 : 0;
   CHA_rac = rac == "European" ? 1 : 0;
   WIL_rac = rac == "African" ? 2 : 0;
   INS_rac = rac == "European" ? 2 : 0;
   HUM_rac = rac == "Asian" ? 2 : 0;

   */