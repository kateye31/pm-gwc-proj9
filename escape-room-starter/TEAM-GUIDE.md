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
3. **Extensions** (free add-ons for VS Code). When you open our folder, VS Code pops up **"install recommended extensions?"** Click **Install**. You get:

   | Extension | What it does for you |
   | --- | --- |
   | **Live Preview** | Right-click `index.html` → **Show Preview** to play the game inside VS Code. It refreshes every time you save. |
   | **GitHub Copilot Chat** | The AI chat in VS Code (free plan, see Part 6) |
   | **Error Lens** | Shows mistakes in red right on the line, so you don't have to hunt for them |
   | **Code Spell Checker** | Underlines typos, like in spell words or the warlock's lines |
   | **GitHub Pull Requests** | Open and check pull requests without leaving VS Code |

   Missed the pop-up? Click the Extensions icon on the left (four squares), search each name, click **Install**.

### Step 3 · Get the code on your computer ("clone")
1. Open the team repo on GitHub, click the green **Code** button, and copy the link.
2. In VS Code: **View → Command Palette** → type **Git: Clone** → paste the link → choose a folder.
3. Click **Open** when VS Code asks.

### Step 4 · Play the game (do this a lot!)
Find **`index.html`** in the folder and double-click it. It opens in your browser. No installs needed.
Play it **all the way through** at least once: pick a knight, the Maze, the Lab, the Hall, the Final Door, escape. Get one answer wrong on purpose and click **Hint** so you see those too. You can't fix what you haven't seen.

### Step 5 · Sign in to the team board
1. Open **your own link** from Katrina's DM (it ends in your name, like `#shirley`).
2. Enter your **4-digit PIN** (from the DM). You only do this once per device.
3. Don't share your PIN. Forgot it? Message Katrina.

---

## Part 3 · How to make a change (every task)

**Never push straight to `1.0`** (our main branch). You work on your own branch, then Katrina checks it and merges it.

### Step 1 · Get the newest code
```bash
git checkout 1.0
git pull origin 1.0
```

### Step 2 · Make your own branch
Name it **your-name/what-you're-doing**:
```bash
git checkout -b shirley/maze-colors
```

### Step 3 · Edit and test
- Make your change in VS Code and **save** (Ctrl+S).
- Refresh `index.html` in your browser (**F5**), or use **Live Preview**, and **play to your part** to check it works.
- **Test after every small change**, not just at the end. If something breaks, you'll know it was the last thing you did.

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
git checkout 1.0
git pull origin 1.0
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

### New to AI chat? Start here (1 minute)
- ▶️ **Watch:** [Get started with Copilot Free in VS Code](https://www.youtube.com/watch?v=X_Aet9ndh_Y) (63 seconds, from the official VS Code channel). Want more? [Getting started with GitHub Copilot](https://www.youtube.com/watch?v=n0NlxUyA7FI) (11 minutes, from GitHub).
- **Turn it on:** in VS Code, hover the **Copilot icon** in the bottom bar → **Use AI Features** → sign in with GitHub. No Copilot plan yet? You're put on **Copilot Free** automatically. (The videos are from late 2024, so the buttons may look a little different.)
- **Open the chat:** press **Ctrl+Alt+I** and type your question. Copilot can see our files, so you can say "look at rooms.js".

### The easy way: the board's helper
On the team board, tap **Ask for help** (bottom right on every screen), or **Ask about this task** under any of your tasks. It already knows our code and your task, so you only type your question. Then pick:
- **Ask in ChatGPT** or **Ask in Claude:** opens the chat with your question filled in.
- **Ask in VS Code:** copies your question for Copilot. In VS Code press **Ctrl+Alt+I** and paste (**Ctrl+V**).

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

## Part 8 · Free tools and resources

### Free AI, and who can get it
Check your age and school before signing up for anything.

| Tool | Free for | How |
| --- | --- | --- |
| **GitHub Copilot Free** | Anyone with a GitHub account | Built into VS Code (see Part 6). **Start here.** |
| **GitHub Copilot for students** | Students 13+ who can prove they're enrolled (high school counts) | Apply for the [GitHub Student Developer Pack](https://education.github.com/pack). Sign-ups may be paused, so check the page. |
| **Gemini** | Free plan for everyone with a Google account | [gemini.google.com](https://gemini.google.com). A free year of Google AI Pro is for **college students 18+** in the US only. |
| **ChatGPT / Codex** | Free plan | [chatgpt.com](https://chatgpt.com). Extra Codex credits are for **US and Canada university students** only. |
| **Claude** | Free plan, **18+ only** | [claude.ai](https://claude.ai) |

### Test your Java
Our puzzles are Java, but the game itself is JavaScript, so the game can't run Java. Before you add a puzzle, check that it really prints what you think:
- [Programiz online Java compiler](https://www.programiz.com/java-programming/online-compiler/): paste the snippet, press **Run**, compare the output to your answer.
- [Java Tutor](https://pythontutor.com/java.html): steps through Java **one line at a time** and shows every variable. Great for tracing.

### Learn web stuff
- [MDN: Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development): the most trusted guide for HTML, CSS and JavaScript
- [W3Schools JavaScript](https://www.w3schools.com/js/): short examples you can try in the browser
- [Google Fonts](https://fonts.google.com/): free fonts (see Shirley's style task for how to add one)

### Cool JavaScript libraries (optional, only after your part works)
A library is someone else's code you can use with one line. **Ask Katrina before adding one.**

| Library | What it adds | Good spot in our game |
| --- | --- | --- |
| [canvas-confetti](https://www.kirilv.com/canvas-confetti/) | Confetti in 1 line of code | The escape screen 🎉 |
| [Animate.css](https://animate.style/) | Animations by just adding a class name, no JavaScript | A door shaking on a wrong answer |
| [GSAP](https://gsap.com/docs/v3/) | Smooth animations (free, used by pro sites) | The warlock appearing |

**Demo day tip:** libraries load from the internet. Download the library file into our folder instead, so the game still works if the Wi-Fi is bad.

**Not for this project:** React, Next.js and other frameworks. They're great to learn after demo day, but they'd mean rebuilding our game from scratch.

---

## Part 9 · Road to demo day

| When | Goal |
| --- | --- |
| Oct 24 – 30 | **The Maze is playable.** Starter running on everyone's laptop, knight select sketched |
| Oct 31 – Nov 6 | **All 4 chambers playable.** Styled screens, one playtest each |
| Nov 7 – 11 | **Polish + practice.** Fix playtest problems, freeze Nov 9, record a backup video |
| **Thu Nov 12** | **🎉 Demo day: escape, live!** |
