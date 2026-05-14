# IronClad Banking System — JavaScript Array Methods Project

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-No_Framework-green?style=flat)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen?style=flat)

IronClad is a fictional banking system built entirely in vanilla JavaScript, HTML, and CSS. It was created as a CS101 assignment to demonstrate practical use of JavaScript array methods, string operations, loops, and conditional logic — all brought to life through a real, interactive banking UI with five functional modules.

**Live Demo:** [https://ironclad-banking-mmtk.vercel.app/](https://ironclad-banking-mmtk.vercel.app/) &nbsp;|&nbsp; **Assignment:** CS101 — JavaScript Array Methods

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Modules Covered](#modules-covered)
- [Array Methods Used](#array-methods-used)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Assignment Compliance](#assignment-compliance)
- [Known Differences from Spec](#known-differences-from-spec)
- [What I Learned](#what-i-learned)

---

## Overview

The assignment asked us to build functional modules for a fictional bank called **IronClad**, applying JavaScript basics including loops, conditionals, and every major array method. Instead of just writing functions in isolation, I built a fully styled interactive web app that lets you actually *use* each method and see the results in real time.

Each of the five tabs corresponds to one question in the assignment. You can interact with every feature — make ATM transactions, process loan applications, run fraud audits, merge branch databases, and validate passwords — and watch the underlying array operations happen live on screen.

---

## Features

- **Smart ATM Terminal** — process deposits, withdrawals, fees, undo operations, and oldest-record removal using mutation array methods
- **Loan Processing Engine** — input any credit scores and run all seven iterating array methods at once, with color-coded results
- **Fraud Detection System** — step-by-step audit using accessor and search methods, with live splice removal and forEach output
- **Bank Merger Operations** — merge, flatten, sort, reverse, join, and fill two branch databases in sequential steps
- **Security System** — live password validator with strength bar and checklist, plus a yearly report generator with leap year and FizzBuzz logic
- Responsive two-column layout that collapses to single column on small screens
- Real-time feedback — balance flashes green/red/amber on transactions, checklist updates on every keystroke
- Raw array output panel showing the actual JavaScript array state at all times

---

## Modules Covered

| # | Module | Scenario |
|---|--------|----------|
| 1 | Smart ATM & Transaction History | Array mutation using push, pop, unshift, shift |
| 2 | Loan Application Processing | Iterating methods — no for/while loops allowed |
| 3 | Fraud Detection & Ledger Auditing | Accessor and search methods on transaction IDs |
| 4 | Bank Mergers & Data Cleanup | Formatting and structuring methods |
| 5 | Security & Reporting System | String methods, regex, loops, and conditions |

---

## Array Methods Used

### Mutation Methods (Question 1)
| Method | Used For |
|--------|----------|
| `.push()` | Appending deposits and withdrawals to the end of history |
| `.pop()` | Undo — removes the last transaction and reverts balance |
| `.unshift()` | Prepends maintenance fees to the front of history |
| `.shift()` | Removes the oldest record when history gets too long |

### Iterating Methods (Question 2)
| Method | Used For |
|--------|----------|
| `.filter()` | Returns only scores strictly above 700 |
| `.map()` | Adds 20 points to every score in a new array |
| `.reduce()` | Calculates the total sum of all credit scores |
| `.some()` | Checks if at least one score is 900 or above |
| `.every()` | Checks if all scores are above the 400 minimum |
| `.find()` | Returns the first score below 500 |
| `.findIndex()` | Returns the index of that first high-risk score |

### Accessor & Search Methods (Question 3)
| Method | Used For |
|--------|----------|
| `.includes()` | Checks whether the fraud ID exists in the array |
| `.indexOf()` | Finds the exact position of the fraud ID |
| `.slice()` | Extracts the last 3 transactions without mutating the original |
| `.splice()` | Permanently removes the fraud ID from the array |
| `.forEach()` | Logs a cleared message for each remaining safe transaction |

### Formatting & Structuring Methods (Question 4)
| Method | Used For |
|--------|----------|
| `.concat()` | Merges branchA and branchB into a single allCustomers array |
| `.flat()` | Flattens the nested messyData array one level deep |
| `.sort()` | Sorts the flattened names alphabetically A to Z |
| `.reverse()` | Flips the sorted array to Z to A order |
| `.join()` | Converts allCustomers into a single banner string |
| `.fill()` | Initializes 5 teller windows all pre-set to "Closed" |

---

## Tech Stack

- **HTML5** — semantic structure, accessible markup with aria labels
- **CSS3** — custom properties, CSS Grid, flexbox, keyframe animations, responsive media queries
- **JavaScript (ES6+)** — all logic written in vanilla JS, no libraries or frameworks
- **Google Fonts** — Orbitron (brand/logo), IBM Plex Sans (UI), IBM Plex Mono (code output)
- **No build tools** — opens directly in the browser, no npm or bundler needed

---

## Project Structure

```
ironclad-banking/
├── index.html          # Main HTML file — all five section layouts
├── css/
│   └── styles.css      # All styles — variables, layout, components, section-specific
└── js/
    └── main.js         # All JavaScript — array methods, validation, UI rendering
```

The project was originally a single HTML file. It was refactored to separate CSS and JS into their own folders for better organisation and readability, while keeping it runnable without any build step.

---

## Local Setup

No installation needed. Just clone and open.

```bash
# Clone the repository
git clone https://github.com/your-username/ironclad-banking.git

# Navigate into the folder
cd ironclad-banking

# Open in browser (or just double-click index.html)
open index.html
```

That's it — no `npm install`, no build step, no server required. It runs entirely in the browser.

---

## Assignment Compliance

| Question | Requirement | Status |
|----------|-------------|--------|
| Q1 | Starting balance of $1000 and empty transactionHistory array | ✅ |
| Q1 | push() on valid deposit/withdrawal | ✅ |
| Q1 | pop() for Undo operation | ✅ |
| Q1 | unshift() for maintenance fees | ✅ |
| Q1 | shift() to remove oldest record | ✅ |
| Q2 | filter() — scores above 700 | ✅ |
| Q2 | map() — add 20 to every score | ✅ |
| Q2 | reduce() — total sum | ✅ |
| Q2 | some() and every() boolean checks | ✅ |
| Q2 | find() and findIndex() for high-risk score | ✅ |
| Q2 | No for or while loops used | ✅ |
| Q3 | includes() to detect fraud ID | ✅ |
| Q3 | indexOf() to find exact position | ✅ |
| Q3 | slice(-3) for last 3 transactions | ✅ |
| Q3 | splice() to permanently remove fraud | ✅ |
| Q3 | forEach() to log cleared transactions | ✅ |
| Q4 | concat() to merge two branch arrays | ✅ |
| Q4 | flat() to flatten messyData | ✅ |
| Q4 | sort() then reverse() for Z to A order | ✅ |
| Q4 | join(" - ") for banner string | ✅ |
| Q4 | new Array(5).fill("Closed") for tellers | ✅ |
| Q5 | Password at least 8 characters | ✅ |
| Q5 | Password must not contain the word "password" | ✅ |
| Q5 | Password must contain at least one vowel | ✅ |
| Q5 | Returns "Access Granted" or "Access Denied" | ✅ |
| Q5 | Loop from startYear to endYear | ✅ |
| Q5 | Leap year detection and audit label | ✅ |
| Q5 | FizzBuzz — divisible by 10 prints Decade Anniversary | ✅ |
| Q5 | FizzBuzz — divisible by 5 prints 5 Year Anniversary | ✅ |

---

## Known Differences from Spec

The original submission had a few places where the implementation went beyond (or slightly off from) what the assignment asked. These were corrected in the final version:

- **Q5 — validateBankPassword()** originally checked for uppercase letters, numbers, and special characters instead of the required vowel check and "password" word check. This has been fixed to match the spec exactly.
- **Q5 — Return type** originally returned an object `{valid, reason}` instead of the plain string `"Access Granted"` / `"Access Denied"`. Fixed.
- **Q5 — generateYearlyReport()** originally calculated anniversaries based on years since a founding date instead of using the FizzBuzz modulo logic the assignment specified. Fixed to use `year % 10` and `year % 5`.

---

## What I Learned

- **Array mutation vs. non-mutation** — push/pop/splice change the original array, while slice/filter/map always return a new one. I kept confusing slice and splice before this assignment.
- **The FizzBuzz order matters** — checking `% 10` before `% 5` is essential, otherwise years like 2020 would match the 5-year check and never reach the decade check.
- **reduce() is more useful than it looks** — at first it seemed like it only added numbers, but once you understand the accumulator pattern it can do almost anything.
- **Separating files makes a difference** — refactoring from one big HTML file into `index.html`, `css/styles.css`, and `js/main.js` made everything easier to read, debug, and explain.
- **Comments should explain why, not just what** — going back through the code and rewriting comments to sound like actual thinking rather than documentation labels made the code genuinely easier to follow.

---

## Author

**Honnete Nishimwe** — CS101 Assignment  
GitHub: [@honnete-1](https://github.com/honnete-1)
