# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Popodoro** - A joyful, lightly gamified Pomodoro timer that randomizes session types and integrates with a todo list. Every interaction should spark dopamine through delightful animations, sounds, and micro-rewards.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens on http://localhost:3000)
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 + Framer Motion (animations)
- **Audio**: Tone.js or Web Audio API for satisfying sounds
- **State Management**: Zustand for global state
- **Animations**: React Spring for advanced spring-based animations
- **TypeScript**: Strict mode with path aliases (`@/*` maps to `./src/*`)

## Core Features

### 🎲 Randomization System
- Random Pomodoro session types (work, creative, deep focus, quick burst)
- Random break activity suggestions
- Random motivational messages and quotes
- Surprise bonus sessions and rewards

### 🎮 Light Gamification
- XP system for completed sessions
- Achievement badges (streaks, milestones, combos)
- Progress bars with satisfying fill animations
- Level-up celebrations with confetti
- Daily/weekly challenges

### ✅ Todo Integration
- Drag-and-drop task assignment to Pomodoros
- Task completion celebrations
- Visual progress indicators on todo items
- Smart task suggestions based on session type

### 📊 Joyful Analytics
- Animated progress charts and visualizations
- Streak counters with flame animations
- Time-spent breakdowns
- Personal records with celebration effects

### 🎵 Audio & Visual Delight
- Satisfying button click sounds
- Gentle timer tick (toggleable)
- Success chimes and fanfares
- Smooth 60fps transitions
- Spring-based animations
- Particle effects for achievements

## Design Principles

1. **Joyful First**: Every interaction should feel delightful
2. **Subtle Gamification**: Enhance motivation without overwhelming
3. **Smooth Animations**: 60fps spring-based transitions
4. **Satisfying Feedback**: Visual and audio confirmation for all actions
5. **Progressive Disclosure**: Reveal features as users engage more

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── timer/          # Timer components (countdown, controls, session types)
│   ├── todo/           # Todo list components
│   ├── gamification/   # XP, badges, achievements
│   ├── audio/          # Sound system components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
│   ├── useTimer.ts     # Timer logic and state
│   ├── useAudio.ts     # Sound effects management
│   ├── useGameification.ts # XP, levels, achievements
│   └── useTodos.ts     # Todo list management
├── lib/                # Utilities and helpers
│   ├── sounds.ts       # Audio generation and management
│   ├── animations.ts   # Animation presets and utilities
│   ├── gamification.ts # XP calculations, badge logic
│   └── storage.ts      # Local storage management
├── store/              # Zustand stores
│   ├── timer.ts        # Timer state
│   ├── todos.ts        # Todo state
│   ├── user.ts         # User progress, XP, achievements
│   └── settings.ts     # App settings and preferences
└── types/              # TypeScript definitions
    ├── timer.ts        # Timer-related types
    ├── todo.ts         # Todo item types
    ├── gamification.ts # Achievement, XP types
    └── audio.ts        # Sound-related types
```

## Implementation Notes

- Use Framer Motion for smooth, spring-based animations
- Implement Web Audio API for crisp, satisfying sound effects
- Store user progress in localStorage with periodic cloud sync option
- Use CSS custom properties for theme consistency
- Implement proper accessibility with screen reader support
- Add haptic feedback for mobile devices
- Use intersection observer for performance with long todo lists