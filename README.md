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
  - Separate high-score records for each track.
- **Multi-Game Modes**:
  - **Solo**: Relaxed play at your own pace.
  - **Time Attack**: Race against a global countdown with a dedicated time-centered UI.
  - **1v1 Mastery**: Battle a friend with a shared coin bank and a **Rebound** system—if they fail, you can swoop in for double points!
- **Power-up System**: Spend your hard-earned coins for high-stakes help:
  - **🌓 50/50**: Eliminates two wrong answers.
  - **💡 Hint**: Provides a contextual clue.
  - **⚡ Solve**: Automatically identifies the correct answer.
- **Dynamic Feedback**: Vibrant on-screen feedback messages and **Win Streaks** (3+ in a row triggers special visual effects).
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
- **Sleek Design**: Modern glassmorphism UI with curated color palettes, vibrant gradients, and micro-animations.

## 💰 Coin Economy

Smarty features a robust rewarding system to keep children engaged:
- **Base Earnings**: Higher difficulty = Higher reward (Level 1: 1🪙, Level 2: 2🪙, Level 3: 3🪙).
- **Streak Bonus**: Answer 3 questions correctly in a row to earn an extra **5🪙**.
- **Survival Bonuses**: 
  - New High Score: **+20🪙**.
  - Course Completion: **+50🪙**.
- **Time Attack Bonus**: Remaining time is converted into coins upon victory (1s = 1🪙).

## 🛠️ Technology Stack

- **React**: Core UI framework.
- **Vite**: Ultra-fast build tool and dev server.
- **Vanilla CSS**: Custom design system for visual excellence.

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
