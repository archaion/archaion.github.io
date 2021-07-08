
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

   // Engine (read only)
   this.Angle = 360;       // Degrees clockwise from bottom (engine)
   this.Y_pos = 0;
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
   // Racial starting bonuses
   STR_rac = () => rac == "African" ? 2 : rac == "European" ? 0 : -1;
   DEX_rac = () => rac == "Asian" ? 2 : 0;
   STM_rac = () => rac == "European" ? 2 : 0;
   INT_rac = () => rac == "Asian" ? 2 : rac == "European" ? 1 : -1;
   WIT_rac = () => rac == "African" ? 2 : 0;
   CHA_rac = () => rac == "European" ? 1 : 0;
   WIL_rac = () => rac == "African" ? 2 : 0;
   INS_rac = () => rac == "European" ? 2 : 0;
   HUM_rac = () => rac == "Asian" ? 2 : 0;

   // Totals
   this.STR = 10 + STR_rac() + roll(4);      // Physical
   this.DEX = 10 + DEX_rac() + roll(4);
   this.STM = 10 + STM_rac() + roll(4);

   this.INT = 10 + INT_rac() + roll(4);      // Mental
   this.WIT = 10 + WIT_rac() + roll(4);
   this.CHA = 10 + CHA_rac() + roll(4);

   this.WIL = 10 + WIL_rac() + roll(4);      // Spiritual
   this.INS = 10 + INS_rac() + roll(4);
   this.HUM = 10 + HUM_rac() + roll(4);

   //------------------------------------ Skills ---------------------------------
   // Class starting bonuses
   Firearms_cls = cls == "Soldier" ? 3 : (cls == "Guard" ? 1 : 0);     // Combat spec
   Athletics_cls = cls == "Soldier" ? 2 : (cls == "Guard" ? 1 : 0);
   Melee_cls = cls == "Guard" ? 3 : (cls == "Soldier" ? 1 : 0);
   Dodge_cls = cls == "Guard" ? 2 : (cls == "Soldier" ? 1 : 0);

   Computer_cls = cls == "Hacker" ? 3 : (cls == "Thief" ? 1 : 0);      // Operations spec
   Alertness_cls = cls == "Hacker" ? 2 : (cls == "Thief" ? 1 : 0);
   Stealth_cls = cls == "Thief" ? 3 : (cls == "Hacker" ? 1 : 0);
   Security_cls = cls == "Thief" ? 2 : (cls == "Hacker" ? 1 : 0);

   Repair_cls = cls == "Tech" ? 3 : (cls == "Medic" ? 1 : 0);          // Support spec
   Technology_cls = cls == "Tech" ? 2 : (cls == "Medic" ? 1 : 0);
   Medicine_cls = cls == "Medic" ? 3 : (cls == "Tech" ? 1 : 0);
   Survival_cls = cls = "Medic" ? 2 : (cls == "Tech" ? 1 : 0);

   Occult_cls = cls == "Scholar" ? 3 : (cls == "Artisan" ? 1 : 0);     // Unknown spec
   Research_cls = cls == "Scholar" ? 2 : (cls == "Artisan" ? 1 : 0);
   Crafts_cls = cls == "Artisan" ? 3 : (cls == "Scholar" ? 1 : 0);
   Science_cls = cls == "Artisan" ? 2 : (cls == "Scholar" ? 1 : 0);

   Finance_cls = cls == "Trader" ? 3 : (cls == "Dealer" ? 1 : 0);      // Business spec
   Etiquette_cls = cls == "Trader" ? 2 : (cls == "Dealer" ? 1 : 0);
   Intimidate_cls = cls == "Dealer" ? 3 : (cls == "Trader" ? 1 : 0);
   Streetwise_cls = cls == "Dealer" ? 2 : (cls == "Trader" ? 1 : 0);

   Politics_cls = cls == "Agent" ? 3 : (cls == "Officer" ? 1 : 0);     // Diplomacy spec
   Subterfuge_cls = cls == "Agent" ? 2 : (cls == "Officer" ? 1 : 0);
   Investigate_cls = cls == "Officer" ? 3 : (cls == "Agent" ? 1 : 0);
   Intuition_cls = cls == "Officer" ? 2 : (cls == "Agent" ? 1 : 0);

   // Totals
   this.Firearms = () => 10 + Firearms_cls + chip(this, "Firearms") + bonus(this.STR);        // Combat
   this.Athletics = () => 10 + Athletics_cls + chip(this, "Athletics") + bonus(this.WIL);
   this.Melee = () => 10 + Melee_cls + chip(this, "Melee") + bonus(this.STR);
   this.Dodge = () => 10 + Dodge_cls + chip(this, "Dodge") + bonus(this.WIL);

   this.Computer = () => 10 + Computer_cls + chip(this, "Computer") + bonus(this.DEX);        // Operations
   this.Alertness = () => 10 + Alertness_cls + chip(this, "Alertness") + bonus(this.WIL);
   this.Stealth = () => 10 + Stealth_cls + chip(this, "Stealth") + bonus(this.DEX);
   this.Security = () => 10 + Security_cls + chip(this, "Security") + bonus(this.WIL);

   this.Repair = () => 10 + Repair_cls + chip(this, "Repair") + bonus(this.STM);              // Support
   this.Technology = () => 10 + Technology_cls + chip(this, "Technology") + bonus(this.INS);
   this.Medicine = () => 10 + Medicine_cls + chip(this, "Medicine") + bonus(this.STM);
   this.Survival = () => 10 + Survival_cls + chip(this, "Survival") + bonus(this.INS);

   this.Crafts = () => 10 + Crafts_cls + chip(this, "Crafts") + bonus(this.WIT);              // Unknown
   this.Research = () => 10 + Research_cls + chip(this, "Research") + bonus(this.INS);
   this.Occult = () => 10 + Occult_cls + chip(this, "Occult") + bonus(this.WIT);
   this.Science = () => 10 + Science_cls + chip(this, "Science") + bonus(this.INS);

   this.Finance = () => 10 + Finance_cls + chip(this, "Finance") + bonus(this.INT);           // Business
   this.Streetwise = () => 10 + Streetwise_cls + chip(this, "Streetwise") + bonus(this.HUM);
   this.Intimidate = () => 10 + Intimidate_cls + chip(this, "Intimidate") + bonus(this.INT);
   this.Etiquette = () => 10 + Etiquette_cls + chip(this, "Etiquette") + bonus(this.HUM);

   this.Politics = () => 10 + Politics_cls + chip(this, "Politics") + bonus(this.CHA);        // Diplomacy
   this.Intuition = () => 10 + Intuition_cls + chip(this, "Intuition") + bonus(this.HUM);
   this.Investigate = () => 10 + Investigate_cls + chip(this, "Investigate") + bonus(this.CHA);
   this.Subterfuge = () => 10 + Subterfuge_cls + chip(this, "Subterfuge") + bonus(this.HUM);

   //------------------------------------ Stats ---------------------------------
   // Vitals   
   this.HP_min = roll(10) + roll(10) + roll(10);
   this.SP_min = roll(10) + roll(10) + roll(10);
   this.MP_min = roll(10) + roll(10) + roll(10);

   this.HP_max = () => this.HP_min + this.Level + bonus(this.STM);
   this.SP_max = () => this.HP_min + this.Level + bonus(this.INT);
   this.MP_max = () => this.HP_min + this.Level + bonus(this.WIL);

   this.HP = this.HP_max();         // Current values
   this.SP = this.SP_max();
   this.MP = this.MP_max();

   // Combat stats
   this.ATK = () => {
      switch (this.Weapon.Type) {
         case "sword": return this.Melee() + bonus(this.INS);
         case "gun": return this.Firearms() + bonus(this.INS);
         default: return this.Survival();
      }
   };
   this.DMG = () => {                // Add secondary attribute bonus if weapon / armor equipped
      switch (this.Weapon.Type) {
         case "sword": return bonus(this.STR);
         case "gun": return bonus(this.DEX);
         default: return bonus(this.INS);
      }
   };
   this.DEF = () => this.Armor.Type == "armor" ? this.Athletics() + bonus(this.STM) : this.Athletics();
   this.EVD = () => this.Armor.Type == "armor" ? this.Dodge() + bonus(this.STM) : this.Dodge();
   this.HAX = () => this.Deck.Type == "deck" ? this.Computer() + bonus(this.WIT) : this.Computer();
   this.CPU = () => this.Deck.Type == "deck" ? this.Technology() + bonus(this.INT) : this.Technology();
   this.SEC = () => this.Deck.Type == "deck" ? this.Security() + bonus(this.INT) : this.Security();

   //------------------------------------ Abilities ---------------------------------
   // Class starting ability 
   Abilities_cls = () => {
      switch (this.Class) {
         case "Soldier": return "Vengeance";
         case "Guard": return "Defense";
         case "Hacker": return "Celerity";
         case "Thief": return "Obfuscate";
         case "Tech": return "Redemption";
         case "Medic": return "Martyrdom";
         case "Scholar": return "Visionary";
         case "Artisan": return "Innocence";
         case "Trader": return "Auspex";
         case "Dealer": return "Dominate";
         case "Agent": return "Presence";
         case "Officer": return "Judgement";
      }
   }
   // Current ability
   this.Abilities = Abilities_cls();
}

