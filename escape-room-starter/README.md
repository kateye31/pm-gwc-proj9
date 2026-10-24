# Knight's Escape

A Java OOP escape room for college students. A warlock traps you in his dungeon;
you escape through 4 chambers by reading and reasoning about code.
Design: Tvishaa's Group 9 design roadmap. Demo: Thursday, Nov 12.

## Run it

Open `index.html` in your browser. No installs.

## The game

| Screen | What happens | OOP topic | File section |
| --- | --- | --- | --- |
| Start | Choose your knight and difficulty | Your knight is an object | `KNIGHTS`, `DIFFICULTIES` |
| Intro | The warlock traps you | | `WARLOCK` |
| 1. The Maze | 5 turns, pick the right direction (multiple choice) | Classes and objects | `MAZE` |
| 2. The Alchemy Lab | Guess what the code prints; the words build a spell | Methods and encapsulation | `LAB` |
| 3. Hall of Illusions | 3 look-alike code doors, only one is real | Inheritance | `HALL` |
| 4. The Final Door | Answer the warlock in your own words, earn 3 keys | Polymorphism, the final boss | `FINAL` |
| Escape | You win, play again | | |

Difficulty sets the hints per chamber: Squire 3, Knight 2, Champion 1.

## Who edits what

| File | Owner | What you change |
| --- | --- | --- |
| `rooms.js` | Content (Sanjana, Leslie) | Story text, Java snippets, questions, hints |
| `style.css` | Design (Shirley, Tvishaa) | Colors, fonts, layout, art |
| `game.js` | Build (Leslie, Sanjana) | How screens work, the victory screen |
| `index.html` | Build | Page structure (rarely changes) |

Search for `TODO` to find open work. Every chamber has 1 or 2 examples to copy.

## Where the OOP topics come from

Sanjana's research mapped each concept to a part of the dungeon. The TODOs in `rooms.js` include her ideas.
Learn more: [Programiz Java](https://www.programiz.com/java-programming/class-objects) · [Codecademy Learn Java](https://www.codecademy.com/learn/learn-java) · [dev.java](https://dev.java/learn/classes-objects/)

| Concept | Her idea | Where it goes |
| --- | --- | --- |
| Classes and objects | A `Knight` class is the blueprint; each knight is an object | The Maze |
| Constructors and methods | Pick the right constructor arguments or method call | The Maze, Alchemy Lab |
| Encapsulation | Private fields protected by public methods | Alchemy Lab |
| Inheritance | `Wizard` and `Knight` share properties from a `Character` parent | Hall of Illusions |
| Polymorphism | Different objects answer the same method call: the final boss puzzle | Final Door (first look in the Hall) |

## Question of the week

Each week, every person asks **one student outside the team** one question (5 minutes, tops) and posts the answer in Discord.

| Week | Ask | Why |
| --- | --- | --- |
| Oct 24 – 30 | "When you study OOP, what's hardest to remember?" | Shapes the hints |
| Oct 31 – Nov 6 | "Play the Maze for 5 minutes. Where did you get stuck?" | First playtest |
| Nov 7 – 11 | "After playing: explain class vs. object in your own words." | Proves it teaches |

---

# Contributing

## Git workflow for this repo

Please **do not push directly to `main`**. Every change goes through a pull request (PR), and Katrina merges it.

For each task:

**1. Make sure you're up to date**

```bash
git checkout main
git pull origin main
```

**2. Create a new branch**
Use your name and the task:

```bash
git checkout -b your-name/task-name
```

Example:

```bash
git checkout -b shirley/maze-colors
```

**3. Make your changes**

Open the folder in VS Code, edit, and check `index.html` in your browser.

**4. Commit your changes**

```bash
git add .
git commit -m "Add Maze turns 3-5"
```

**5. Push your branch**

```bash
git push -u origin your-name/task-name
```

**6. Open a pull request**
On GitHub, create a PR from your branch into `main`. Katrina reviews it and merges it.

**7. After your PR is merged, update your local `main`**

```bash
git checkout main
git pull origin main
```

Then create a new branch for your next task.

### Stuck?

- `git status` shows what changed and which branch you're on.
- Pushed to the wrong branch, or saw a merge conflict? Don't force anything. Post in Discord and we'll fix it together.
