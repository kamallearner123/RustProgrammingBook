# Rust Security Course (BookToStartRust)

Welcome to the **Rust Security Course**, an interactive workshop designed to teach secure systems programming by comparing the legacy pitfalls of C/C++ with the memory-safe guarantees of Rust.

## Overview

This repository contains the full HTML/CSS/JS source for a beautiful, interactive web-based book. It features real-time code editing using Ace Editor, allowing users to compile and run Rust code directly in their browser against the Rust Playground backend.

### Course Sessions

1. **Session 1: Core concepts and C/C++ limitations**
   - Memory structure (Stack vs. Heap)
   - Data sharing and Concurrency risks
   - Real-world vulnerabilities (C/C++ in the wild)
   - Legacy tools and practices (Valgrind, ASan, MISRA)
2. **Session 2: Basics of Rust programming**
   - Variables, Types, and Functions
   - Ownership, Borrowing, and Lifetimes
   - Error Handling
   - Cargo Build System
3. **Session 3: Lab Exercises**
   - 6 Hands-on labs (Hello Rust to Thread-safe Counters)
   - Bonus Lab: Secure Password Generator
4. **Session 4: Future of Rust & Career**
   - Automotive & Software Defined Vehicles (SDVs)
   - Embedded Systems & IoT
   - Linux Kernel & Cloud Computing
   - AI Infrastructure
   - Career Roadmap & Open Source Contributions

## Key Features

- **Single Page Application (SPA) feel:** Smooth navigation between topics without page reloads.
- **Integrated IDE:** Embeds `ace.js` for an authentic IDE experience (syntax highlighting, line numbers).
- **Interactive Execution:** A custom backend bridge compiles and executes Rust code snippets directly inside a styled terminal window.
- **Deep Dives on CVEs:** Detailed breakdowns of massive industry bugs like Heartbleed, Log4Shell, and Baron Samedit, mapped to memory safety issues.

## Getting Started

Because this project relies on standard web technologies, there is no build step required.

1. Clone the repository:
   ```bash
   git clone https://github.com/kamallearner123/RustProgrammingBook.git
   ```
2. Open `index.html` in any modern web browser.
   *(Note: For the best experience, run a local development server like `python3 -m http.server 8000` to avoid browser CORS restrictions on `file:///` URLs when loading fonts or external assets).*

## Author
Created and maintained for the Rust Security Workshop.
