# Turing Machine Simulator

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Author](#author)
- [License](#license)

## Features

- **Interactive Tape Visualization** - Real-time visualization of the Turing machine tape with state tracking
- **Custom Program Input** - Define states, transitions, and tape alphabet programmatically
- **Step-by-Step Execution** - Execute machine operations step-by-step with detailed state information
- **Syntax Validation** - Built-in parser with comprehensive error detection and reporting
- **Web-Based Interface** - Modern React UI with responsive design and dark mode support

## Tech Stack

**Core Simulator:**

- TypeScript - Type-safe implementation
- Jest - Unit testing

**Web Interface:**

- React 18+ - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Vite - Build tool

## Project Structure

```
TuringMachineSimulator/
├── core/                    # Simulator engine
│   ├── src/
│   │   ├── parser/         # Syntax parsing & graph building
│   │   ├── simulator/      # Core simulation logic
│   │   ├── error/          # Error definitions
│   │   └── enum/           # Tape configuration
│   └── test/               # Unit tests
└── web/                     # React frontend
    ├── src/
    │   ├── components/     # React UI components
    │   ├── provider/       # Context providers
    │   ├── layout/         # Layout components
    │   └── programs.ts     # Sample programs
    └── public/             # Static assets
```

## Getting Started

**Prerequisites:**

- Node.js (v16+)
- npm or yarn

**Installation:**

```bash
# Install dependencies
npm install

# Install core dependencies
cd core && npm install

# Install web dependencies
cd ../web && npm install
```

**Running:**

```bash
# Development server
cd web && npm run dev

# Run tests
cd core && npm run test

# Build for production
cd web && npm run build
```

## How It Works

1. **Define Program** - Create a Turing machine program with states, transitions, and tape symbols
2. **Parse & Validate** - The parser checks syntax and builds a state transition graph
3. **Initialize Tape** - Set initial tape content and head position
4. **Execute Steps** - Run transitions step-by-step, updating tape and state
5. **Visualize** - Watch the tape and state changes in real-time

## Architecture

The project is divided into two main parts:

**Core (`/core`)** - Pure TypeScript implementation:

- `parser/` - Builds state graphs from program definitions
- `simulator/` - Executes transitions and manages tape state
- Fully testable and framework-independent

**Web (`/web`)** - React frontend:

- Interactive UI with live code editor
- Real-time tape visualization
- Program examples and documentation
- Responsive design with Tailwind CSS

## Author

Developed by Yağız Erdem

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
