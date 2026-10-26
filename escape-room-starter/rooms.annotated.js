// ============================================================
// 📖 THIS IS A HELPER FILE, NOT THE REAL GAME FILE.
// It's rooms.js with extra explaining comments added, so it's easier to
// read while you're still learning the codebase. It's not loaded by
// index.html — it does nothing on its own, it's just for reading.
//
// 🔍 Search "LESLIE NOTE" (Ctrl+F) to jump straight to the parts about
// your task. Everything else is general "what does this do" comments
// for anyone on the team.
//
// 🗑️ Safe to delete this whole file once you don't need it anymore.
// It won't break the game either way.
// ============================================================

// ALL GAME CONTENT LIVES HERE. Edit rooms.js (the real file) to change the story and puzzles.
// Based on Tvishaa's Group 9 design roadmap: a warlock traps you in his dungeon,
// and you escape through 4 chambers. Search for TODO to find open work.
// OOP topics follow Sanjana's research (classes & objects, constructors & methods,
// encapsulation, inheritance, polymorphism as the final boss).

// ---------- Start screen ----------
// This is just a list (an array) of knight choices shown on the first screen.
// Each knight is one { } block with a name and a color.
const KNIGHTS = [
  // TODO (design crew): name your knights and pick their colors
  { name: "Sir Byte", color: "#ffc21a" },
  { name: "Dame Loop", color: "#c2ba52" },
  { name: "Sir Null", color: "#f08a4b" },
];

// Difficulty changes how many hints you get in each chamber.
// "hints: 3" = 3 hint-button clicks allowed before she runs out, per chamber.
const DIFFICULTIES = [
  { name: "Squire", hints: 3, about: "New to OOP. Lots of help." },
  { name: "Knight", hints: 2, about: "Seen Java before." },
  { name: "Champion", hints: 1, about: "Ready for a challenge." },
];

// ---------- The warlock ----------
// One object holding everything the warlock "says" at different moments.
const WARLOCK = {
  // TODO (story): give him a name and a personality (see the Council answers)
  name: "The Warlock",
  intro: "Welcome to my dungeon, little knight. Four chambers stand between you and freedom. Each one is locked with code. Good luck... you'll need it.",
  taunts: ["Wrong! Try again, if you dare.", "Ha! My dungeon grows stronger.", "Not quite. Think like a programmer."], // shown on a wrong answer, picked at random
  defeated: "No! You've escaped my dungeon. You truly understand objects...",
};

// ---------- Chamber 1: The Maze ----------
// 5 turns. Each turn is a multiple-choice question; the right answer is the right direction.
const MAZE = {
  title: "The Maze",
  concept: "Classes and objects",
  story: "Stone walls twist in every direction. Choose the right path at each turn.",
  turns: [
    // 👉 Every turn has the SAME shape (a "template"): code, question, choices, answer, hint, explain.
    // Once you get how turn 1 works, turns 2, 3, 4... all work the same way.
    {
      code: "class Knight {\n    String name;\n}\n\nKnight k = new Knight();",
      question: "Which one is the OBJECT?",
      choices: ["⬅️ Knight", "⬆️ k", "➡️ class"],
      answer: 1, // index into choices, 0 = first. So answer: 1 means choices[1], which is "⬆️ k".
      hint: "A class is the blueprint. What gets built FROM the blueprint?",
      explain: "Knight is the class. k is an object made from it with new.",
    },
    {
      code: "Knight a = new Knight();\nKnight b = new Knight();",
      question: "How many Knight objects exist?",
      choices: ["⬅️ 1", "⬆️ 2", "➡️ 0"],
      answer: 1,
      hint: "Count how many times you see the word new.",
      explain: "Each new creates one object, so there are 2.",
    },
    // TODO (Sanjana): write turns 3, 4 and 5. Ideas from your research:
    //   - Constructors: "Which line creates a Knight named Ava?"  new Knight("Ava") vs Knight("Ava") vs new Knight
    //   - Methods: which method call makes the knight attack?  k.attack() vs attack(k) vs Knight.attack
    //   - Fields: after k.level = 3, what is k.level?
  ],
};

// ---------- Chamber 2: The Alchemy Lab ----------
// 4 steps. Guess what each snippet PRINTS to the screen (System.out.println does the printing).
// Whatever the right choice's TEXT says gets added as one word of the final spell.
// So the 4 right-choice texts, in order, spell out the magic words.
const LAB = {
  title: "The Alchemy Lab",
  concept: "Methods and encapsulation",
  story: "Bubbling potions line the shelves. Each one whispers a word when you read its code.",
  steps: [
    // Step 1: calls a method, the method returns "OPEN", so that prints.
    {
      code: 'class Potion {\n    String word() { return "OPEN"; }\n}\n\nSystem.out.println(new Potion().word());',
      choices: ["OPEN", "word", "Potion"],
      answer: 0,
      hint: "What does the word() method return?",
    },
    // Step 2: .toUpperCase() makes a new ALL-CAPS copy of the string. "sesame" -> "SESAME".
    {
      code: 'String s = "sesame";\nSystem.out.println(s.toUpperCase());',
      choices: ["sesame", "SESAME", "s"],
      answer: 1,
      hint: "toUpperCase() returns a new String in capital letters.",
    },

    // ---- LESLIE NOTE: your 2 steps start here ----
    // 👀 Before anything else: open index.html and actually PLAY through to the Lab (or in
    //    VS Code, tell Copilot "open preview" so you can see it live). Katrina's note: she
    //    tried it and the spell that printed might not be the one you were going for —
    //    seeing it on screen is faster than tracing it in your head.

    // Step 3: "Key: " + 42 glues together into "Key: 42". Then we substring it.
    {
      code: 'int num = 42;\nString magic = "Key: " + num;\nSystem.out.println(magic.substring(5));',
      choices: ["42", "Key: ", "magic"],
      answer: 0,
      hint: "substring(5) extracts the part of the string after the first 5 characters.",
    },

    // Step 4 — Katrina's note: "this might be a bug here
    //   System.out.println("Al" + "chemy".substring(2)); only prints out chemy"
    {
      code: 'System.out.println("Al" + "chemy".substring(2));',
      choices: ["Alchemy", "chemy", "Al"],
      answer: 1,
      hint: "substring(2) extracts the part of the string starting from index 2.",
    },
    // 🔎 LESLIE NOTE: run it (see the "open preview" note above) and check what actually
    //    prints against the 3 choices here. Once that's sorted you should be good.
    //
    // 🪄 Then: make sure this is the spell YOU want. You could keep it close to the
    //    original idea — "OPEN SESAME 42 Alchemy" — or go full knight-themed with an
    //    idiom or phrase instead, like "Squire doing king's work" or "Sword stuck in
    //    stone." Totally your creative call. Katrina already looked a few up if you'd
    //    rather have exact text to copy-paste into the code than invent your own —
    //    just ask her for the list.
    // ---- end LESLIE NOTE ----
  ],
};

// ---------- Chamber 3: The Hall of Illusions ----------
// 3 doors per round. They look alike, but only one has correct code.
const HALL = {
  title: "The Hall of Illusions",
  concept: "Inheritance (plus a first look at polymorphism)",
  story: "Three doors shimmer before you. Two are illusions. Only one is real.",
  rounds: [
    {
      question: "Which door makes Wizard a child class of Character?",
      doors: [
        "class Wizard implements Character { }",
        "class Wizard extends Character { }",
        "class Wizard inherits Character { }",
      ],
      answer: 1,
      hint: "Java uses one keyword to inherit from a class.",
      explain: "extends is how a class inherits from another class.",
    },
    {
      question: 'Wizard overrides speak() to say "Abracadabra". Which door prints Abracadabra?',
      doors: [
        "Character c = new Character();\nc.speak();",
        "Character c = new Wizard();\nc.speak();",
        "Wizard w = null;\nw.speak();",
      ],
      answer: 1,
      hint: "Java runs the method of the real object, not the variable's type.",
      explain: "c is declared as Character but holds a Wizard, so Wizard's speak() runs. That's polymorphism.",
    },
    // TODO (team): one more round. Sanjana's research saves polymorphism for the boss:
    //   three doors call the same method on different objects; which one prints the right line?
  ],
};

// ---------- Chamber 4: The Final Door ----------
// Answer the warlock in your own words. Each answer earns a key (3 keys open the door).
// No multiple choice here — the player TYPES an answer and compares it to "lookFor" themselves.
const FINAL = {
  title: "The Final Door",
  concept: "Polymorphism, the final boss: explain it in your own words",
  story: "A giant door with three keyholes. The warlock appears: 'Answer me, and the keys are yours.'",
  questions: [
    {
      question: "In your own words: what is the difference between a class and an object?",
      model: "A class is a blueprint. An object is one thing built from that blueprint.",
      lookFor: ["blueprint or template", "an object is made from the class"], // what a good answer should mention
    },
    {
      question: "Why would a Wizard class extend a Character class?",
      model: "So Wizard gets everything Character has without rewriting it, and can add its own abilities.",
      lookFor: ["reuse code", "Wizard gets Character's fields and methods"],
    },
    {
      question: "What does polymorphism mean?",
      model: "The same method call can do different things depending on the real object.",
      lookFor: ["same call, different behavior", "depends on the actual object"],
    },
  ],
};
