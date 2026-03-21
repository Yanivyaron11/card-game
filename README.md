# Smarty 🧠🦁🌍🎬🍔🍱

A fun, interactive, and educational card game designed for children and trivia lovers. Match cards, answer fun quiz questions, and earn coins!

## 🚀 Features

- **Persistent Global Economy**: A shared "Family Bank" that saves coins across game sessions using local storage.
- **Advanced Shop System**:
  - **Tabs**: Organized into **Avatars** and **Themes**.
  - **Purchasable Topics**: Unlock entire question categories (like **Judaism**) for a premium coin price.
  - **Persistent Unlocks**: Everything you buy is saved to your local storage.
- **Survival Mode (Junior & Master)**:
  - Two distinct tracks: **Junior** (🟢) and **Master** (🔴) to cater to different age groups and skill levels.
  - **Topic Selection**: Choose specific categories even in Survival mode for a tailored challenge.
  - Separate high-score records for each track.
- **Enhanced Avatars & Skins**:
  - **Professor Owl (3D)**: High-quality 3D animations for University Professor, Researcher, and Friendly Inventor skins.
  - **Dynamic Shop**: Unlock premium skins and avatars using your earned coins.
- **Endless Mode ("Smarty Crush")**:
  - A fast-paced, continuously falling avalanche of cards similar to classic arcade match games.
  - **Real-Time Score**: Watch your active session points climb with every match, distinctly separated from your global coin bank.
  - **Dynamic Obstacles & Bosses**: Battle against multi-hit Bosses and Gladiator enemies with custom graphical animations.
  - **Special Blocks**: Encounter uncrackable stone blocks, explosive power-up bombs, and a strict gravity-based layout matrix beautifully adapted for both desktop and mobile.
- **Multi-Game Modes**:
  - **Solo**: Relaxed play at your own pace.
  - **Time Attack**: Race against a global countdown with a dedicated time-centered UI.
  - **1v1 Mastery**: Battle a friend with a shared coin bank and a **Rebound** system—if they fail, you can swoop in for double points!
- **Power-up System**: Spend your hard-earned coins for high-stakes help:
  - **🌓 50/50**: Eliminates two wrong answers.
  - **💡 Hint**: Provides a contextual clue.
  - **⚡ Solve**: Automatically identifies the correct answer.
- **Dynamic Feedback**: Vibrant on-screen feedback messages and **Win Streaks** (Special bonuses awarded at hits of exactly 3 and 5 correct answers in a row, once per game per player).
- **Settings & Control**: 
  - Toggle sound, music, and language.
  - **Fine-grained Category Control**: Choose exactly which topics appear in your game.
  - **Locked Content Visibility**: Locked themes appear with a 🔒 icon in settings until purchased.
- **Premium UI Components**: Custom-designed **Alert Modals** and **Quit Confirmations** with glassmorphism, blur effects, and smooth animations.
- **Detailed Session Summary**: A comprehensive post-game breakdown showing base coins, streak bonuses, and special rewards (records, completion, time). It also tracks and deducts coins spent on power-ups.
- **Smart Record Tracking**: 
  - **Survival**: Saves the longest correct-answer streak.
  - **Time Attack**: Tracks and displays the best remaining time for each grid size.
- **Improved Quit Logic**: Manual exits via the "X" button are treated as an "End of Run" in Survival and Time Attack, ensuring high scores are saved and a friendly "See you next round!" summary is displayed.
- **Dynamic Difficulty**: Three levels of challenge with **adaptive timers** (L1: 30s, L2: 25s, L3: 20s).
- **Mobile Optimized**: Home screen shortcut support (PWA) with responsive and RTL-aware layouts.
- **Bilingual Support**: Full support for both **English** and **Hebrew (RTL)**.
- **Expansive Educational Categories**: Dozens of topic areas including Math, Science, Nature, Judaism, World Geography, Flags, English basics, and more.
- **Sleek Design**: Modern glassmorphism UI with curated color palettes, vibrant gradients, and micro-animations.

## 💰 Coin Economy

Smarty features a robust rewarding system to keep children engaged:
- **Base Earnings**: Higher difficulty = Higher reward (Level 1: 1🪙, Level 2: 2🪙, Level 3: 3🪙).
- **Streak Bonus**: Awarded at exactly **3** and **5** correct answers in a row (once each per game, total 10🪙 if you reach 5) to earn extra rewards.
- **Survival Bonuses**: 
  - New High Score: **+20🪙**.
  - Course Completion: Junior (**+30🪙**) / Master (**+50🪙**).
- **Avalanche / Smarty Crush Bonuses**:
  - Stage 2 (Reached at 15 Pops): **+50🪙**
  - Stage 3 (Reached at 30 Pops): **+100🪙**
  - Ultimate WIN State (Complete at 50 Pops): **+200🪙** !!
  - *Note: Power-up Bombs (Row/Col/Cross) actively defend the board against the avalanche, but they do **not** award bonus coins or contribute to stage progression skips. Players must manually answer 50 total questions.*
- **Completion Bonuses**:
  - Grid 3x3: **+10🪙**
  - Grid 4x4: **+20🪙**
  - Grid 5x5: **+30🪙**
- **Time Attack Bonus**: Remaining time is converted into coins upon victory (1s = 1🪙).
- **Daily Bonus**: Log in daily to receive a **+20🪙** login gift.

## 🛠️ Technology Stack

- **React**: Core UI framework.
- **Vite**: Ultra-fast build tool and dev server.
- **Vanilla CSS**: Custom design system for visual excellence.
- **Vitest & React Testing Library**: Robust integration testing for core game logic and UI components.

## 🌍 Hebrew Localization Fixes

Special attention was given to Hebrew rendering, ensuring that:
- Right-to-Left (RTL) layout is consistent across all components.
- Math expressions (e.g., "3 x 3", "5 + 7") maintain their correct mathematical order (LTR) within the RTL context, avoiding common BiDi reordering issues.

## 🏃 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Yanivyaron11/card-game.git
    cd card-game
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run locally**:
    ```bash
    npm run dev
    ```

## 📜 License

MIT License - feel free to use and adapt!
