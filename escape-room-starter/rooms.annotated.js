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
//
// ✅ LESLIE NOTE: this chamber's done! She redid all 4 steps as one knight-themed run
//    (not just her assigned 2) so the spell reads as a real phrase: "Squire doing king's
//    work" — matches the idiom Katrina suggested, and hand-traced correct, no bugs.
//    Matches her PR on the team repo (branch "leslie"). Nothing left to do here.
const LAB = {
  title: "The Alchemy Lab",
  concept: "Methods and return values",
  story: "Bubbling potions line the shelves. Each one whispers a word when you read its code.",
  steps: [
    // Step 1: calls a method, the method returns "Squire", so that prints.
    {
      code: 'class Knight {\n    String title() { return "Squire"; }\n}\n\nSystem.out.println(new Knight().title());',
      choices: ["Squire", "title", "Knight"],
      answer: 0,
      hint: "What does the title() method return?",
    },
    // Step 2: the variable action holds "doing", and printing it prints its value.
    {
      code: 'String action = "doing";\nSystem.out.println(action);',
      choices: ["do", "doing", "action"],
      answer: 1,
      hint: "The variable 'action' holds the string 'doing'.",
    },
    // Step 3: + glues strings together. "king" + "'s" -> "king's".
    {
      code: 'String possessive = "king";\nSystem.out.println(possessive + "\'s");',
      choices: ["king", "king's", "possessive"],
      answer: 1,
      hint: "Adding '\\'s' to 'king' makes it possessive.",
    },
    // Step 4: same idea as step 2, a plain variable print.
    {
      code: 'String task = "work";\nSystem.out.println(task);',
      choices: ["work", "task", "task."],
      answer: 0,
      hint: "The variable 'task' holds the string 'work'.",
    },
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
