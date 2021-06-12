
////////////////////// COMMENTS = USAGE & ENGINE ACTIVATOR (PARAMETER TYPES) - SEE BELOW FOR NOTES /////////////////////////

// Random number generation (args: maximum value)
roll = (max) => Math.floor(Math.random() * max) + 1;

// Skill bonus from equipment (args: Character, "skill name")
chip = (My, skill) => My.Chip.SKL == skill ? My.Chip.BNS : 0;

// Attribute and skill bonuses (args: Character.ATTRIBUTE)
bonus = (atr) => {
   if (atr - 10 >= 10) return 5;
   if (atr - 10 >= 8) return 4;
   if (atr - 10 >= 6) return 3;
   if (atr - 10 >= 4) return 2;
   if (atr - 10 >= 2) return 1;
   if (atr - 10 < 2) return 0;
}

// Get Character object from "NPC" array based on ID property (args: engine UID)
GetNPC = (UID) => {
   for (var index in NPCs) {
      if (NPCs[index].ID == UID) return NPCs[index];
   }
}

// Get current value of Status property for "NPC" Character object (args: engine UID) 
GetStatus = (ID) => {
   var My = GetNPC(ID);                            // Engine JS: GetStatus(x) -> value = "state" -> set State
   return My.Status[My.Status.length - 1];
}

// Get value of property in "NPC" Character object (args: engine UID, "property name") 
GetValue = (ID, property) => {
   var My = GetNPC(ID);
   return My[property];                            // Eg. GetValue(x, HP) -> value == 0 -> State = "dead"
}

// Get value of item property in "NPC" Character object (args: engine UID, "item name") 
GetItem = (ID, item) => {
   var My = GetNPC(ID);
   return My.Items[item];
}

// Set direction Character faces by pressing arrow keys (args: Character, "direction")
Turn = (ID, angle) => {
   var My = GetNPC(ID);

   switch (angle) {                            // MOVEMENT AND ORIENTATION         SPRITE DISPLAY
      case "D": return My.Angle = 360;         // Down = Y++                       front view sprite
      case "DL": return My.Angle = 45;         // Down + left = Y++ AND X--        left front 3/4 view
      case "L": return My.Angle = 90;          // Left = X--                       left side view
      case "UL": return My.Angle = 135;        // Up + left = Y-- AND X--          left back 3/4 view
      case "U": return My.Angle = 180;         // Up = Y--                         back view
      case "UR": return My.Angle = 225;        // Up + right = My.Y-- AND X++      UL mirrored
      case "R": return My.Angle = 270;         // Right = X++                      L mirrored
      case "DR": return My.Angle = 315;        // Down + right = Y++ AND X++       DL mirrored
   }
}

// Equip item from inventory by selecting "Equip" in menu (args: Character, "item name")
Equip = (ID, item) => {
   var My = GetNPC(ID),
      equipment = My.Items[item];

   switch (equipment.Type) {
      case "sword":
      case "gun": return My.Weapon = equipment;
      case "armor": return My.Armor = equipment;
      case "deck": return My.Deck = equipment;
      case "chip": return My.Chip = equipment;
   }
}

// Roll attack and damage by pressing "attack" near target (args: self, Character, LoS)
Attack = (ID1, ID2) => {
   var My = GetNPC(ID1), Your = GetNPC(ID2);

   hit = () => {
      Your.HP -= (My.DMG + roll(My.Weapon.DMG)) - bonus(Your.STM);
      Your.HP > 0 ? Your.Status.push("hurt") : Your.Status.push("die");
   }

   if (My.Weapon.Type == "sword") {
      My.Status.push("attack");
      if (My.ATK + roll(My.Weapon.ATK) > Your.DEF + roll(Your.Armor.DEF)) hit();       // Hitbox collision
   } else if (My.Weapon.Type == "gun") {
      My.Status.push("attack");
      if ((My.ATK + roll(My.Weapon.ATK) > Your.EVD + roll(Your.Armor.EVD))) hit();     // LoS collision
   } else if (My.Weapon.Type == "deck") {
      My.Status.push("hack");
      if ((My.HAX + roll(My.Deck.HAX) > Your.SEC + roll(Your.Deck.SEC))) {
         Your.SP -= (My.CPU + roll(My.Deck.CPU)) - bonus(Your.INT);
         Your.SP > 0 ? Your.Status.push("short") : Your.Status.push("die");
      }
   }
   My.Status.pop();
   Your.Status.pop();
}

// Roll to avoid detection by holding "sneak" near targets (args: self, Character, line-of-sight)
Sneak = (ID1, ID2, sight) => {
   var My = GetNPC(ID1), Your = GetNPC(ID2);
   My.Status.push("sneak");

   if (sight) {                                                // Only NPCs with LoS to Character (engine)
      var check = My.Stealth + roll(10),                       // Roll check
         target = Your.Alertness + roll(10),
         distance = (Math.abs(My.Y_pos - Your.Y_pos) + Math.abs(My.X_pos - Your.X_pos));

      if (check < target + 100 - distance) {                   // Success - Character is unnoticed
         if (Your.Mood < 0) Your.Status.push("approach");      // Failure - NPC may becomes hostile
      }
   }
}

// Roll dialogue skill checks by selecting options in dialogue menu (args: self, Character, "skill name")
Talk = (ID1, ID2, skill) => {
   var My = GetNPC(ID1), Your = GetNPC(ID2),
      mine, yours, check, target;
   My.Status.push("talk");
   Your.Status.push("talk");

   switch (skill) {
      case "Finance": (mine = My.Finance, yours = Your.Streetwise); break;             // On buying or selling (prices)
      case "Intimidate": (mine = My.Intimidate, yours = Your.Etiquette); break;
      case "Politics": (mine = My.Politics, yours = Your.Intuition); break;
      case "Investigate": (mine = My.Investigate, yours = Your.Subterfuge); break;     // On use of NPC decks (access)
   }

   check = mine + roll(10);                                                            // Roll skill checks
   target = yours + roll(10);
   check > target ? Your.Mood += check - target : Your.Mood -= target - check;         // Increase or decrease Your.Mood

   /* 
   //----------------SET RESPONSE TO DIALOGUE OPTIONS IN ENGINE
   My.Talk = (Your, mood) => {
      if response = politics, My.Skill(Your, "intuition")
      if response = intimidate, My.Skill(Your, "etiquette")
      if Your.Mood > 0
   END -> My.Status = "leave"
 
   }*/
}

// Add or remove items in Character inventory (args: engine UID, object, "add" OR "remove")
Trade = (ID, item, number, trade) => {
   var My = GetNPC(ID), name = item.Name;          // If called from Talk(), ID = Your.ID
   My.Status.push("trade");

   if (trade == "add") {
      return My.Items[name] ? My.Items[name].Amount += number :
         My.Items[name] = item;
   } else if (trade == "remove") {
      return My.Items[name].Amount > number ? My.Items[name].Amount -= number :
         delete My.Items[name];
   }
   My.Status.pop();
}

// Roll craft check to combine items by pressing "craft" at workbench (args: self, "item name", "item name")
Craft = (ID, itemA, itemB) => {
   var My = GetNPC(ID),
      item1 = My.Items[itemA], item2 = My.Items[itemB],
      check = My.Crafts + roll(10),                               // Roll check
      target = My.Crafts + roll(20) - My.Research;
   My.Status.push("craft");

   switch (itemA, itemB) {                                        // Items must be in correct order
      case ("Hydrocell", "Antenna"):
         My.Status.pop();
         item1.Amount == 1 ? delete item1 : item1.Amount -= 1;    // Remove items used
         item2.Amount == 1 ? delete item2 : item2.Amount -= 1;
         if (check > target) {                                    // Success: create superior item
            return My.Items.Charger_Full ?
               My.Items.Charger_Full.Amount += 1 :                // Increase existing item amount, or create new item
               My.Items.Charger_Full = {
                  Name: "Charger (full)",
                  Type: "parts",
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
                  Type: "parts",
                  Effect: 5,
                  Amount: 1,
                  Sprite: "Charger_Half.png",
                  Icon: "Charger_Half_icon.png"
               };
         };
      case ("Opium", "Bleach"):
         My.Status.pop();
         item1.Amount == 1 ? delete item1 : item1.Amount -= 1;
         item2.Amount == 1 ? delete item2 : item2.Amount -= 1;
         if (check > target) {
            return My.Items.Morphine_Full ?
               My.Items.Morphine_Full.Amount += 1 :
               My.Items.Morphine_Full = {
                  Name: "Morphine (full)",
                  Type: "meds",
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
                  Type: "meds",
                  Effect: 5,
                  Amount: 1,
                  Sprite: "Morphine_Half.png",
                  Icon: "Morphine_Half_icon.png"
               };
         };
      case ("Vitae", "Soma"):
         My.Status.pop();
         item1.Amount == 1 ? delete item1 : item1.Amount -= 1;
         item2.Amount == 1 ? delete item2 : item2.Amount -= 1;
         if (check > target) {
            return My.Items.Fetch_Full ?
               My.Items.Fetch_Full.Amount += 1 :
               My.Items.Fetch_Full = {
                  Name: "Fetch (full)",
                  Type: "drugs",
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
                  Type: "drugs",
                  Effect: 5,
                  Amount: 1,
                  Sprite: "Fetch_Half.png",
                  Icon: "Fetch_Half_icon.png"
               };
         }
      default: My.Status.pop();                   // Items not compatible (add visual effect)
   }
}

// Roll to use healing item by pressing hotkey OR "select" in menu (args: self, Character OR self, "item name")
Heal = (ID1, ID2, itm) => {
   var My = GetNPC(ID1), Your = GetNPC(ID2), item = My.Items[itm],
      mine, yours, check, target, effect;
   My.Status.push("heal");

   switch (item.Type) {
      case "parts": (mine = My.Repair, yours = Your.Technology); break;    // Use "Charger" item
      case "meds": (mine = My.Medicine, yours = Your.Science); break;      // Use "Morphine" item
      case "drugs": (mine = My.Occult, yours = Your.Survival); break;      // Use "Fetch" item
   }

   check = mine + roll(10);                                                // Roll check
   target = mine + roll(20) - yours;
   effect = item.Effect + check - target;

   item.Amount == 1 ? delete item : item.Amount -= 1;                      // Remove item used
   My.Status.pop();

   if (check > target) {                                                   // Success: limited stat increase
      switch (item.Type) {
         case "parts": return Your.SP < Your.SP_max() - effect ?
            Your.SP += effect : Your.SP = Your.SP_max();
         case "meds": return Your.HP < Your.HP_max() - effect ?
            Your.HP += effect : Your.HP = Your.HP_max();
         case "drugs": return Your.MP < Your.MP_max() - effect ?
            Your.MP += effect : Your.MP = Your.MP_max();
      }
   } else {                                                                // Failure: stat decrease
      switch (item.Type) {
         case "parts": return Your.MP -= item.Effect - (target - check);
         case "meds": return Your.SP -= item.Effect - (target - check);
         case "drugs": return Your.HP -= item.Effect - (target - check);
      }
   }
}

// Restore vital stats to maximum by selecting "rest" from menu (args: self)
Rest = (ID) => {
   var My = GetNPC(ID);
   if (GetStatus(ID) == "idle") {       // Not in dialogue or combat (check distance to NPCs)
      My.Status.push("rest");
      setTimeout(() => (My.HP = My.HP_max(), My.SP = My.SP_max(), My.MP = My.MP_max(), My.status.pop()), 5000);
   }
}

// Use class ability by pressing "ability" near target (args: self, Character, "ability name")
Ability = (ID1, ID2, ability) => {
   var My = GetNPC(ID1), Your = GetNPC(ID2),
      mine, yours, check, target, mine_org, yours_org;
      My.Status.push("ability");

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
   My.Status.pop();
}

// Change current Status by meeting event condition (args: mine, "new status")
Transfer = (ID, event) => {   // Check Status and set FSM to corresponding state on update (engine) 
   var My = GetNPC(ID);
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
       if (Math.abs(this.X - that.Y) + Math.abs(that.X - this.Y) <= 100) {                        // In range
          switch (this.Faces) {
             case 45: if (this.X > that.X && this.Y < that.Y) hit(); break;                         // Facing target
             case 90: if (this.X > that.X) hit(); break;
             case 135: if (this.X > that.X && this.Y > that.Y) hit(); break;
             case 180: if (this.Y > that.Y) hit(); break;
             case 225: if (this.X < that.X && this.Y > that.Y) hit(); break;
             case 270: if (this.X < that.X) hit(); break;
             case 315: if (this.X < that.X && this.Y < that.Y) hit(); break;
             case 360: if (this.Y < that.Y) hit(); break;
          }
       }
*/