# ⚡ EnergySync: Smart Electricity Calculator

EnergySync is a modern, high-performance web application built with **Next.js 15** and **Tailwind CSS**. It helps users monitor and calculate electricity consumption using a professional, component-driven architecture.

## 🚀 Key Features

- **Real-time Monitoring**: Track device-specific energy usage.
- **Monthly Records**: Detailed breakdown of electricity costs and consumption trends.
- **Smart Analytics**: Automated calculations for kWh to Baht conversion.
- **Unified UI**: Consistent experience using our Atomic Design system.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **State Management**: React Server Components & Client Hooks

## 🏗️ Development & Standards

This project follows strict UI and performance standards to ensure a premium user experience.

- **[UI Standards](docs/ui-standards.md)**: Detailed documentation of our Atomic Component library (`Button`, `Dropdown`, `Badge`, `Input`) and performance best practices.
- **[Design Philosophy](GEMINI.md)**: Our core "Everything is a Component" approach.

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Directory Structure

- `/app`: Next.js pages and layouts (Server-first).
- `/components/ui`: Highly reusable Atomic components.
- `/components/features`: Complex domain-specific logic.
- `/docs`: Technical standards and AI context.
- `/lib`: Shared utilities and helper functions.
