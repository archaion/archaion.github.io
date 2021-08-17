
////////////////////// COMMENTS = USAGE & ENGINE ACTIVATOR (PARAMETER TYPES) - SEE BELOW FOR NOTES /////////////////////////

var context = new AudioContext();

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
   } else if (property)  {
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

/*
// Change current Status by meeting event condition (args: mine, "new status")
Transfer = (ID, event) => {   // Check Status and set FSM to corresponding state on update (engine)
   var My = Cast[ID];
   switch (GetStatus(ID)) {

      // PLAYER STATES
      case "walk":                     // Move by holding arrow keys (engine)
         switch (event) {
            case "stop": return My.Status.push("idle");
            case "hit": return My.Status.push("fight");
            case "drop": return My.Status.push("fall");
         } break;
      case "run":                      // Move faster by holding "run" and arrow keys (engine)
         switch (event) {
            case "slow": return My.Status.push("walk");
            case "stop": return My.Status.push("idle");
            case "hit": return My.Status.push("fight");
         } break;
      case "jump":                     // Jump animation when "jump" pressed (engine: "jump-through")
         switch (event) {
            case "land": return My.Status.push("idle");
            case "drop": return My.Status.push("fall");     // Jump from higher level
         } break;
      case "sneak":                    // Sneak animation when holding "sneak" (My.Sneak())
         switch (event) {
            case "show": return My.Status.push("idle");
            case "seen": return My.Status.push("sneak");    // No interruption on failed My.Sneak() check
            case "hit": return My.Status.push("fight");
         } break;
      case "fight":                    // Combat animation when "draw" pressed, or "hurt" (My.Mood < 0)
         switch (event) {
            case "escape": return My.Status.push("run");
            case "lose": return My.Status.push("hunt");    // NPC on successful My.Sneak()
            case "kill": return My.Status.push("idle");
            case "killed": return My.Status.push("die");
            case "done": return My.Status.push("idle");    // "draw" pressed AND drawn == true
         } break;
      case "ability":                  // Ability animation when "ability" pressed (My.Ability())
         switch (event) {
            case "done": return My.Status.push("last");    // REPLACE "last" WITH My.Stack.pop() !!!!!!!
         } break;
      case "heal":                     // Consume Morphine or Fetch animation when hotkey pressed (My.Heal())
         switch (event) {
            case "done": return My.Status.push("last");
         } break;
      case "repair":                   // Use Charger animation when hotkey pressed (My.Heal())
         switch (event) {
            case "done": return My.Status.push("last");
         } break;
      case "craft":                    // Craft animation when "craft" pressed at workbench (My.Craft())
         switch (event) {
            case "done": return My.Status.push("idle");
         } break;
      case "talk":                     // Show dialogue menu when "talk" pressed near NPC (engine, My.Talk())
         switch (event) {
            case "leave": return My.Status.push("idle");
            case "anger": return My.Status.push("idle");   // My.Mood < 0
            case "shop": return My.Status.push("trade");
         } break;
      case "trade":                    // Show trade menu when "trade" selected in dialogue (My.Talk())
         switch (event) {
            case "leave": return My.Status.push("talk");
         } break;
      case "rest":                     // Rest animation when "rest" selected in menu (My.Rest())
         switch (event) {
            case "done": return My.Status.push("idle");
         } break;
      case "equip":                    // Equip animation when hotkey pressed (My.Equip())
         switch (event) {
            case "done": return My.Status.push("last");
         } break;

      // NPC-ONLY STATES (ENGINE)
      case "wander":                   // Patrol area randomly (My.Mood > 0)
         switch (event) {
            case "stop": return My.Status.push("idle");
            case "greet": return My.Status.push("talk");   // Character presses "talk"
         } break;
      case "chase":                    // Move toward Character on "run" OR "fight" OR "find" (stack, My.Mood < 0)
         switch (event) {
            case "catch": return My.Status.push("fight");
            case "lose": return My.Status.push("hunt");
            case "kill": return My.Status.push("idle");
         } break;
      case "hunt":                     // Search for Character (Your.Sneak() success AND last was "chase" OR when "hit")
         switch (event) {
            case "find": return My.Status.push("chase");
            case "lose": return My.Status.push("wander");
            case "kill": return My.Status.push("idle");
         } break;
      case "evade":                    // Temporarily move away from Character (random on My.Attack())
         switch (event) {
            case "return": return My.Status.push("approach");
         } break;
      case "retreat":                  // Move away from Character
         switch (event) {              // (My.HP < 10 AND !My.Items.Morphine OR My.Weapon.Type == "gun" AND range < 10)
            case "die": return My.Status.push("dead");
            case "heal": return My.Status.push("approach");
         } break;
      case "approach":                 // Move slowly toward Character
         switch (event) {
            case "meet": return My.Status.push("fight");   // IF My.Weapon.Type == "sword" AND My.Mood < 0 (OR "talk")
         } break;

      // ANIMATION TRIGGERS
      case "climb":                    // Climb animation when "jump" pressed under "obstacle" (engine)
         switch (event) {
            case "done": return My.Status.push("last");    // "idle" OR "fight"
         } break;
      case "fall":                     // Fall animation when moving beyond top of "obstacle" (engine)
         switch (event) {
            case "done": return My.Status.push("hurt");    // Character.Y = obstacle.Y
         } break;
      case "attack":                   // Attack animation when "attack" pressed (My.Attack())
         switch (event) {
            case "done": return My.Status.push("fight");
         } break;
      case "hack":                     // Hack animation when "attack" pressed AND weapon.Type == "deck" (My.Attack())
         switch (event) {
            case "done": return My.Status.push("last");
         } break;
      case "block":                    // Block animation on My.Attack() failure IF weapon.Type == "sword"
         switch (event) {
            case "done": return My.Status.push("fight");
         } break;
      case "dodge":                    // Dodge animation on My.Attack() failure IF weapon.Type == "gun"
         switch (event) {
            case "done": return My.Status.push("fight");
         } break;
      case "hurt":                     // Hurt animation on successful My.Attack()
         switch (event) {
            case "killed": return My.Status.push("die");     // My.HP <= 0
         } break;
      case "short":                    // Short animation on successful My.Attack() with weapon.Type == "deck"
         switch (event) {
            case "break": return My.Status.push("die");   // My.SP <= 0
         } break;
      case "die":                      // Short animation on successful My.Attack() with weapon.Type == "deck"
         switch (event) {
            case "done": return My.Status.push("dead");   // My.SP <= 0
         } break;

      // IDLE STATE
      case "idle":                     // Idle animation when no input given
         switch (event) {
            case "find": return My.Status.push("chase");   // NPC: Character fails Your.Sneak() check (My.Mood < 0)
         } break;
      default: "idle";
   }
}
*/

/* Check My.Status to call associated function (args: mine, My.Status)
State = (My, status) => {
   switch (status) {
      case "walk": Move(My);
      case "ability": Ability(My);
      case "sneak": Sneak(My);
      case "craft": Craft(My);
      case "heal": Heal(My);
      case "repair": Heal(My);
      case "talk": Talk(My);
      case "attack": Attack(My);
      case "hack": Attack(My);
      case "rest": Rest(My);
      case "equip": Equip(My);
   }

   // Stack-based state machine (args: arrary of "states")
   My.Stack = (states) => {
      /*
      STATES = FUNCTIONS WITH BEHAVIORS AND CONDITIONS TO TRANSITION
      TRANSITIONS = CONDITIONAL STATEMENTS CALLING yours STATE FUNCTIONS
      STATE MACHINE = INTERFACE BETWEEN ENGINE & BACKEND (CONTROLLER)

      1. FOR EACH STATE, DEFINE GAME EVENTS & ANIMATIONS - MUST BE DONE IN ENGINE
      eg. state = "see player" ->  if (Mood < 0) -> move to player.x/y & attack()
      eg. My.State("climb") ->  compare jump / cliff height -> set Y pos -> idle animation

      2. FOR EACH TRANSITION, CHECK IN ENGINE, CALL TRANSITION FUNCTION & REPEAT STEP 1

      "GAME LOOP" (on update) !!!!!!!!!!
      - CHECK My.State IN ENGINE
      - FOR RETURNED VALUE (eg. My.Status = "walk")
         - RUN ENGINE BEHAVIORS (keyboard input)
         - CALL JS FUNCTION (eg. My.Attack())
      states;
   }
}


/* LINE OF SIGHT
       if (Math.abs(this.X - that.Y) + Math.abs(that.X - this.Y) <= 100) {          // In range
          switch (this.Faces) {
             case 0: if (this.X > that.X) hit(); break;                             // walk L, set angle 0
             case 45: if (this.X > that.X && this.Y > that.Y) hit(); break;         // walk LD, set angle 45
             case 90: if (this.Y > that.Y) hit(); break;
             case 135: if (this.X < that.X && this.Y > that.Y) hit(); break;
             case 180: if (this.X < that.X) hit(); break;                           // additional check required
             case 225: if (this.X < that.X && this.Y < that.Y) hit(); break;
             case 270: if (this.Y < that.Y) hit(); break;
             case 315: if (this.X > that.X && this.Y < that.Y) hit(); break;
          }
       }
*/