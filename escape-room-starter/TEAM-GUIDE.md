# 🏰 Knight's Escape · Team Guide

Everything you need for Project 9, step by step. Bookmark this page!

**Demo day: Thursday, November 12.** Feature freeze (no new features after this): Monday, November 9.

| | Link |
| --- | --- |
| 🏰 Team board (your tasks, check-ins, game plan) | https://kateye31.github.io/pm-gwc-proj9/ |
| 🎮 Council game (on your phone) | https://kateye31.github.io/pm-gwc-proj9/party/ |
| 💬 Questions? | Discord, or message Katrina |

---

## Part 1 · What we're building

A **Java OOP escape room** for college students. A warlock traps you in his dungeon, and you escape through 4 chambers by reading Java code.
**The design is Tvishaa's** (Group 9 design roadmap). **The OOP plan is Sanjana's** (her research).

| Order | Screen | How it plays | What it teaches |
| --- | --- | --- | --- |
| Start | Choose your knight + difficulty | Squire 3 hints, Knight 2, Champion 1 | Your knight is an object |
| 1 | The Maze | 5 multiple-choice turns; the right answer is the right direction | Classes, objects, constructors, methods |
| 2 | The Alchemy Lab | Guess what the code prints; the words build a spell | Methods, return values, encapsulation |
| 3 | Hall of Illusions | 3 look-alike code doors, only one is real | Inheritance |
| 4 | The Final Door | Answer the warlock in your own words, earn 3 keys | Polymorphism, the final boss |
| End | Escape | You win, play again | |

**What the Council decided at Meeting 1:**
- The warlock is a **sly trickster** who lies in the Hall of Illusions
- Maze turns are **"follow the code"**: trace a snippet, and each answer is a direction
- A **weak-spot scroll** at the end shows which chamber tripped you up
- Ideas to keep: replay the dungeon after escaping, a Maze called **"LabyrinthLearn"** (Leslie), escape on a **pegasus** if you score well (Sanjana)
- Still open (Shirley + Tvishaa break the ties): how players remember, and what kind of hints

---

## Part 2 · Get set up (do this once, about 20 minutes)

### Step 1 · Make a GitHub account
1. Go to **github.com** and click **Sign up**. It's free.
2. **Send Katrina your username** so she can add you to the team repo.
3. Check your email and **accept the invite**.

### Step 2 · Install the tools
1. **VS Code** (where you edit code): code.visualstudio.com → Download → install.
2. **Git** (saves and shares your work): git-scm.com → Download → install with the default options.
   *Easier option:* **GitHub Desktop** (desktop.github.com) does the same thing with buttons instead of typing.

### Step 3 · Get the code on your computer ("clone")
1. Open the team repo on GitHub, click the green **Code** button, and copy the link.
2. In VS Code: **View → Command Palette** → type **Git: Clone** → paste the link → choose a folder.
3. Click **Open** when VS Code asks.

### Step 4 · Play the game
Find **`index.html`** in the folder and double-click it. It opens in your browser. No installs needed.

### Step 5 · Sign in to the team board
1. Open **your own link** from Katrina's DM (it ends in your name, like `#shirley`).
2. Enter your **4-digit PIN** (from the DM). You only do this once per device.
3. Don't share your PIN. Forgot it? Message Katrina.

---

## Part 3 · How to make a change (every task)

**Never push straight to `main`.** You work on your own branch, then Katrina checks it and merges it.

### Step 1 · Get the newest code
```bash
git checkout main
git pull origin main
```

### Step 2 · Make your own branch
Name it **your-name/what-you're-doing**:
```bash
git checkout -b shirley/maze-colors
```

### Step 3 · Edit and test
- Make your change in VS Code and **save** (Ctrl+S).
- Refresh `index.html` in your browser and **play to your part** to check it works.

### Step 4 · Save your work ("commit")
```bash
git add .
git commit -m "Add Maze turns 3-5"
```
Write a short message about **what** you changed.

### Step 5 · Upload it ("push")
```bash
git push -u origin shirley/maze-colors
```

### Step 6 · Ask for a review ("pull request")
On GitHub, click **Compare & pull request**, then **Create pull request**. Katrina reviews it and merges it.

### Step 7 · After it's merged
```bash
git checkout main
git pull origin main
```
Then start your next task with a **new** branch (Step 2).

> 🚨 **Stuck, merge conflict, or pushed to the wrong place?** Stop. Don't force anything. Post in Discord and we'll fix it together.

---

## Part 4 · Which file do I edit?

| File | What's in it | Who |
| --- | --- | --- |
| `rooms.js` | **All the content:** knights, warlock lines, every puzzle, hints | Sanjana, Leslie |
| `game.js` | **How screens work** (one function per screen) | Leslie, Sanjana |
| `style.css` | **Colors, fonts, layout.** Colors live at the top in `:root` | Shirley, Tvishaa |
| `index.html` | The page shell (rarely changes) | Build crew |

**Find your work:** in VS Code press **Ctrl+Shift+F** and search **`TODO`**.

### How a puzzle is written (copy this shape)
```js
{
  code: "Knight a = new Knight();\nKnight b = new Knight();",
  question: "How many Knight objects exist?",
  choices: ["⬅️ 1", "⬆️ 2", "➡️ 0"],
  answer: 1,            // which choice is right, counting from 0
  hint: "Count how many times you see the word new.",
  explain: "Each new creates one object, so there are 2.",
},
```

### A good puzzle has
- [ ] Java that is **actually correct** (test it, or ask a teammate)
- [ ] One clear question
- [ ] 3 choices, with `answer` pointing to the right one (**counting starts at 0!**)
- [ ] A **hint that teaches a step**, not one that gives the answer away
- [ ] A one-sentence **explanation** of why the answer is right

---

## Part 5 · Every week

| When | What | Where | Time |
| --- | --- | --- | --- |
| Each meeting | **Check in:** your mood + how comfy you are with GitHub, VS Code and OOP (1–5) | Team board | 20 sec |
| Each meeting | **Council game:** vote on game decisions | Phone, party link | ~10 min |
| By Wednesday 8pm | **Check-in post:** Did / Next / Stuck on | Discord #general | 2 min |
| By Wednesday | **Question of the week:** ask 1 student outside the team, post their answer | Discord #research | 5 min |
| By Wednesday night | **When2meet:** fill in your free times for next weekend's meeting | Discord #polls | 1 min |
| Anytime | **Tick your tasks** as you go: to do → doing → done | Team board | 5 sec |

**Question of the week:**

| Week | Ask someone outside the team |
| --- | --- |
| Oct 24 – 30 | "When you study OOP, what's hardest to remember?" |
| Oct 31 – Nov 6 | "Play the Maze for 5 minutes. Where did you get stuck?" |
| Nov 7 – 11 | "After playing: explain class vs. object in your own words." |

**Missed a meeting?** Open the party link on your phone. It walks you through the questions you missed (catch-up mode), with no timer.

---

## Part 6 · Asking AI for help (the right way)

AI (ChatGPT, Claude, Copilot) is great for **learning**, but **you** should write your part. On demo day you'll explain what you built!

### Ask with this shape
> **I'm working on:** [file + chamber, e.g. "rooms.js, the Maze"]
> **I'm trying to:** [your goal]
> **What I tried:** [paste your code]
> **What happened:** [paste the error, or describe what you saw]
> **Please:** give me a hint / explain the idea / check my answer (don't just write it for me)

### Copy-and-paste starters
- 📘 **Learn a concept:** "Explain the difference between a class and an object in Java with an example that's NOT about knights. Then quiz me with one question."
- ✅ **Check your puzzle:** "Here's my Maze turn: [paste]. Is the Java correct, and is my answer index right? Tell me what to fix, don't rewrite it."
- 🐛 **Fix a bug:** "My game shows a blank screen after the Maze. Code: [paste]. Error: [paste]. Give me a hint, not the full fix."
- 💡 **Better hint:** "My hint is 'Look at the code.' How can I make it teach a step without giving away the answer?"
- 🎨 **Design:** "In style.css, how do I change the button color using the `--torch` variable?"
- 🌿 **Git:** "I'm on branch shirley/maze-colors. How do I commit and open a pull request?"

### Paste this at the start of a new AI chat
It gives the AI the context so its answers fit our project:
```
I'm on a Girls Who Code team building "Knight's Escape," a Java OOP escape room
for college students. The game itself is plain HTML/CSS/JavaScript (no frameworks):
rooms.js holds the puzzles as data, game.js runs the screens, style.css is the look.
The puzzles show Java snippets. A warlock traps you; you escape through 4 chambers:
the Maze (classes/objects), Alchemy Lab (methods/encapsulation), Hall of Illusions
(inheritance), Final Door (polymorphism). I'm a student learning Java, so please
explain simply, give hints before full answers, and don't write my whole task for me.
```

### Rules for AI
- **Paste real code and real errors.** "It doesn't work" can't be answered.
- **Hints first.** Ask for the full answer only after you've tried.
- **Double-check Java answers.** AI makes mistakes. Test it or ask a teammate.
- **Never paste** your PIN, passwords or anyone's personal info.
- **Images:** use only human-made or public-domain art (like Wikimedia Commons), and credit it. No AI-generated images.
- **Stuck more than 15 minutes?** Post in Discord with what you tried. Asking is part of the job 💛

---

## Part 7 · Learn the concepts (from Sanjana's research)

- **Programiz:** [classes and objects](https://www.programiz.com/java-programming/class-objects) · [encapsulation](https://www.programiz.com/java-programming/encapsulation) · [inheritance](https://www.programiz.com/java-programming/inheritance) · [polymorphism](https://www.programiz.com/java-programming/polymorphism)
- **Practice:** [Codecademy: Learn Java](https://www.codecademy.com/learn/learn-java) · [Programiz PRO](https://programiz.pro/)
- **Official tutorials:** [dev.java](https://dev.java/learn/classes-objects/)
- **Puzzle ideas:** [Escape The Website](https://escapethewebsite.com/)

---

## Part 8 · Road to demo day

| When | Goal |
| --- | --- |
| Oct 24 – 30 | **The Maze is playable.** Starter running on everyone's laptop, knight select sketched |
| Oct 31 – Nov 6 | **All 4 chambers playable.** Styled screens, one playtest each |
| Nov 7 – 11 | **Polish + practice.** Fix playtest problems, freeze Nov 9, record a backup video |
| **Thu Nov 12** | **🎉 Demo day: escape, live!** |
