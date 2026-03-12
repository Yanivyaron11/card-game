# Smarty 🧠🦁🌍🎬🍔🍱

A fun, interactive, and educational card game designed for children and trivia lovers. Match cards, answer fun quiz questions, and earn coins!

## 🚀 Features

- **Persistent Global Economy**: A shared "Family Bank" that saves coins across game sessions using local storage.
- **Avatar Shop**: A dedicated storefront to unlock **15+ unique avatars** classified into Free, Premium, and Legendary categories using earned coins.
- **Tiered Earning System**: Higher difficulty questions reward more coins (L1: 1, L2: 2, L3: 3) with a **5-coin bonus** for a streak of 3 correct answers.
- **Survival Mode**: A high-stakes endurance mode with **level-up progression** (Level 1-3), **progress ladder**, and a **Pause** functionality to safely take a break.
- **Multi-Game Modes**:
  - **Solo**: Relaxed play at your own pace.
  - **Time Attack**: Race against a global countdown.
  - **1v1 Mastery**: Battle a friend with a shared coin bank and a **Rebound** system—if they fail, you can swoop in for double points!
- **Power-up System**: Spend your hard-earned coins for high-stakes help:
  - **🌓 50/50**: Eliminates two wrong answers.
  - **💡 Hint**: Provides a contextual clue.
  - **⚡ Solve**: Automatically identifies the correct answer.
- **Dynamic Feedback**: Vibrant on-screen feedback messages and **Win Streaks** (3+ in a row triggers special visual effects).
- **Premium UI Components**: Custom-designed **Alert Modals** and **Quit Confirmations** with glassmorphism, blur effects, and smooth animations.
- **Dynamic Difficulty**: Three levels of challenge with **adaptive timers** (L1: 30s, L2: 25s, L3: 20s).
- **Mobile Optimized**: Home screen shortcut support (PWA) with responsive and RTL-aware layouts.
- **Bilingual Support**: Full support for both **English** and **Hebrew (RTL)**.
- **Sleek Design**: Modern glassmorphism UI with curated color palettes, vibrant gradients, and micro-animations.

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
