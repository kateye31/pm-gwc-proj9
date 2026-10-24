// ALL GAME CONTENT LIVES HERE. Edit this file to change the story and puzzles.
// Based on Tvishaa's Group 9 design roadmap: a warlock traps you in his dungeon,
// and you escape through 4 chambers. Search for TODO to find open work.
// OOP topics follow Sanjana's research (classes & objects, constructors & methods,
// encapsulation, inheritance, polymorphism as the final boss).

// ---------- Start screen ----------
const KNIGHTS = [
  // TODO (design crew): name your knights and pick their colors
  { name: "Sir Byte", color: "#ffc21a" },
  { name: "Dame Loop", color: "#c2ba52" },
  { name: "Sir Null", color: "#f08a4b" },
];

// Difficulty changes how many hints you get in each chamber
const DIFFICULTIES = [
  { name: "Squire", hints: 3, about: "New to OOP. Lots of help." },
  { name: "Knight", hints: 2, about: "Seen Java before." },
  { name: "Champion", hints: 1, about: "Ready for a challenge." },
];

// ---------- The warlock ----------
const WARLOCK = {
  // TODO (story): give him a name and a personality (see the Council answers)
  name: "The Warlock",
  intro: "Welcome to my dungeon, little knight. Four chambers stand between you and freedom. Each one is locked with code. Good luck... you'll need it.",
  taunts: ["Wrong! Try again, if you dare.", "Ha! My dungeon grows stronger.", "Not quite. Think like a programmer."],
  defeated: "No! You've escaped my dungeon. You truly understand objects...",
};

// ---------- Chamber 1: The Maze ----------
// 5 turns. Each turn is a multiple-choice question; the right answer is the right direction.
const MAZE = {
  title: "The Maze",
  concept: "Classes and objects",
  story: "Stone walls twist in every direction. Choose the right path at each turn.",
  turns: [
    {
      code: "class Knight {\n    String name;\n}\n\nKnight k = new Knight();",
      question: "Which one is the OBJECT?",
      choices: ["⬅️ Knight", "⬆️ k", "➡️ class"],
      answer: 1, // index into choices, 0 = first
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
// 4 steps. Guess what each snippet prints; the printed words join into the spell.
const LAB = {
  title: "The Alchemy Lab",
  concept: "Methods and encapsulation",
  story: "Bubbling potions line the shelves. Each one whispers a word when you read its code.",
  steps: [
    {
      code: 'class Potion {\n    String word() { return "OPEN"; }\n}\n\nSystem.out.println(new Potion().word());',
      choices: ["OPEN", "word", "Potion"],
      answer: 0,
      hint: "What does the word() method return?",
    },
    {
      code: 'String s = "sesame";\nSystem.out.println(s.toUpperCase());',
      choices: ["sesame", "SESAME", "s"],
      answer: 1,
      hint: "toUpperCase() returns a new String in capital letters.",
    },
    // TODO (Leslie): 2 more steps, so the spell has 4 words. Ideas from Sanjana's research:
    //   - Encapsulation: a private field read through a public getter, e.g. getSecret() returns "DOOR"
    //   - Constructor arguments: new Potion("RISE").word() prints what?
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
const FINAL = {
  title: "The Final Door",
  concept: "Polymorphism, the final boss: explain it in your own words",
  story: "A giant door with three keyholes. The warlock appears: 'Answer me, and the keys are yours.'",
  questions: [
    {
      question: "In your own words: what is the difference between a class and an object?",
      model: "A class is a blueprint. An object is one thing built from that blueprint.",
      lookFor: ["blueprint or template", "an object is made from the class"],
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
