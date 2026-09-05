# Elder Futhark Runes App

A modern, beautifully crafted web application for exploring the Elder Futhark runes: the 24 ancient symbols once carved into tree, stone, and bone. Draw a rune, if you wish, and let its meaning surface.

## Features

- **Rune Dictionary**: Complete reference of all 24 Elder Futhark runes with their symbols, names, meanings, and detailed descriptions
- **Random Runes**: Pull random runes for guidance and reflection
- **Modern UI**: Beautiful, responsive design with smooth animations and intuitive navigation
- **Mobile Friendly**: Optimized for all device sizes

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── data/
│   └── runes.ts          # Rune data and utilities
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## The Elder Futhark Runes

The Elder Futhark is the oldest form of the runic alphabets, used by Germanic tribes from the 2nd to 8th centuries. Each of the 24 runes carries deep symbolic meaning:

- **Fehu** (ᚠ) - Cattle, Wealth, Prosperity
- **Uruz** (ᚢ) - Aurochs, Strength, Vitality
- **Thurisaz** (ᚦ) - Thorn, Protection, Defense
- **Ansuz** (ᚨ) - God, Communication, Wisdom
- **Raidho** (ᚱ) - Journey, Travel, Movement
- **Kenaz** (ᚲ) - Torch, Knowledge, Creativity
- **Gebo** (ᚷ) - Gift, Exchange, Partnership
- **Wunjo** (ᚹ) - Joy, Harmony, Bliss
- **Hagalaz** (ᚺ) - Hail, Disruption, Change
- **Naudhiz** (ᚾ) - Need, Necessity, Constraint
- **Isa** (ᛁ) - Ice, Stillness, Patience
- **Jera** (ᛃ) - Harvest, Year, Cycle
- **Eihwaz** (ᛇ) - Yew Tree, Endurance, Death
- **Perthro** (ᛈ) - Dice Cup, Mystery, Fate
- **Algiz** (ᛉ) - Elk, Protection, Connection
- **Sowilo** (ᛊ) - Sun, Success, Energy
- **Tiwaz** (ᛏ) - Tyr, Justice, Honor
- **Berkano** (ᛒ) - Birch, Growth, New Beginnings
- **Ehwaz** (ᛖ) - Horse, Partnership, Movement
- **Mannaz** (ᛗ) - Human, Community, Intelligence
- **Laguz** (ᛚ) - Water, Flow, Intuition
- **Ingwaz** (ᛜ) - Ing, Fertility, Completion
- **Dagaz** (ᛞ) - Day, Awakening, Transformation
- **Othala** (ᛟ) - Heritage, Home, Ancestors

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with gradients and animations

## Contributing

Feel free to contribute to this project by:
- Adding new features
- Improving the design
- Fixing bugs
- Adding more rune information or interpretations

## License

This project is open source and available under the MIT License. 
