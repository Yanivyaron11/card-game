# Smarty 🦁🌍🎬➕🐒

A fun, interactive, and educational card game designed for children. Match cards, answer fun quiz questions, and earn coins!

## 🚀 Features

- **Multi-topic Experience**: Choose from **Animals**, **Countries**, **Movies**, **Math**, and the new **Monkeys** category.
- **Vast Question Library**: Each category now features 60+ questions (20 per difficulty level).
- **Mathematical Challenge**: 70+ math questions, with Level 3 featuring order of operations, percentages, and larger numbers.
- **Dynamic Difficulty**: Three levels of challenge with **adaptive timers**:
  - **Level 1**: 30 seconds
  - **Level 2**: 20 seconds
  - **Level 3**: 10 seconds
- **Adaptive Deck Generation**: Ensures a full board every time by intelligently falling back to other difficulty levels or allowing repetitions as a last resort.
- **Bilingual Support**: Full support for both **English** and **Hebrew (RTL)**.
- **Interactive Audio**: Choose between three calming background music tracks or play in silence.
- **Power-ups**: Use earned coins for "50/50" eliminations or "Solve" hints.
- **Sleek Design**: Modern glassmorphism UI with vibrant colors and smooth animations, optimized for mobile viewports.

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
