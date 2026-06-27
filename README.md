# MukulMBR Portfolio & Developer Hub

A premium, interactive developer portfolio, command-line hub, and showcase portal representing my engineering journey and shipped products.

## 📝 Overview

MukulMBR Developer Hub is my central digital showcase, custom-built to highlight product-focused engineering. It includes interactive widgets, detailed case study breakdowns for major repositories, a fully functional mock terminal CLI, and theme state management, providing recruiters and tech leads with a premium, hands-on user experience.

## ❌ Problem

Most portfolio websites are static resumes that fail to demonstrate actual technical depth or interactive capability. Recruiters are overwhelmed with identical lists of skills and links, but want to see how an engineer designs systems, resolves challenges, and writes clean code.

## 🛠️ Solution

A responsive single-page web app implementing high-end aesthetics, custom widgets, and detailed technical walk-throughs:
- **Interactive Profile CLI**: A simulated terminal allowing users to run console queries about skills, bio, and repositories.
- **Detailed Case Studies**: Modal overlays for projects highlighting the specific **Technical Challenge**, **Implemented Solution**, and **Shipped Outcome**.
- **State Synchronization**: Custom React state structures with local storage integrations persisting styling configurations.

## ✨ Features

- **Interactive Terminal Simulator**: Run custom commands like `skills`, `about`, and `projects` in a retro CLI interface.
- **Recruiter-Friendly Case Studies**: Slide-over overlay panels showing detailed engineering choices for 7 shipped projects.
- **Persistent Theme Switcher**: Instant Dark/Light mode toggle synchronized via `localStorage` and `document.documentElement` styles.
- **High-End Glassmorphism UX**: Clean layouts, glowing radial gradients, and responsive layouts powered by Tailwind CSS v4.
- **Embedded Performance Practices**: Minimal bundle weights, lightweight inline SVGs, and zero-latency transition timings.

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite
- **Icons**: Lucide React, Custom Inline SVGs
- **Deployment**: Lovable App Service

## 📐 Architecture

The portal leverages single-component layout management with local storage and state management:

```text
               ┌────────────────────────┐
               │    Local Storage Sync  │
               └───────────┬────────────┘
                           │
               ┌───────────▼────────────┐
               │     React Theme State  │
               └───────────┬────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      Document Style            Tailwind Selectors
  - colorScheme = 'dark/light'  - custom variable mappings
  - classList = ['dark']        - dynamic background filters
```

## 📂 Folder Structure

```text
mukulmbr-hub/
├── public/                # Favicon and static assets
├── src/
│   ├── assets/            # Additional graphic assets
│   ├── App.tsx            # Global UI component and terminal state
│   ├── index.css          # Styling entry point and pulse keyframes
│   └── main.tsx           # React bootstrap script
├── package.json
└── vite.config.ts
```

## 📸 Screenshots

*Screenshots placeholder: Please add screenshots of the home view, the CLI terminal simulator, and the projects grid here.*

## ⚙️ Installation

Ensure you have Node.js (v18+) installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/MukulMBR/mukulmbr.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mukulmbr
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## 💻 Running Locally

Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

## 🔮 Future Improvements

- **Interactive Blog**: Add a markdown-powered sandbox playground blog showing recent engineering experiments.
- **CLI Terminal Additions**: Expand CLI commands to let users download my physical resume PDF directly through a `download` command.
- **Telemetry Dashboard**: Dynamic analytics tracking tab clicks and popular project views.

## 🧠 Lessons Learned

- **Decoupled DOM Side-effects**: Triggering viewport changes or smooth scroll within small scrollable boxes using `scrollTop` avoids breaking parent layout scrolls.
- **Tailwind CSS v4 Configuration**: Eliminating local configuration files in favor of the Vite integration increases compile and build efficiency.

## 👤 Author

- **Mukul Bushi Reddy M** - *Product Engineer* - [@MukulMBR](https://github.com/MukulMBR)

## 📄 License

This project is licensed under the MIT License.
