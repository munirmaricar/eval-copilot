# Eval Copilot

## Requirements

- Node.js v20.11.1 (can be installed with [nvm](https://github.com/nvm-sh/nvm))
- npm (installed when Node is installed)

## Installation

Run the following command to install the required dependencies:

```bash
npm install
```

## Getting Started

Create a `.env.local` file with `cp .env.local.example .env.local` and fill in both values with the Atla OpenAI API key.

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Resetting the App

To reset the app, you can clear the local storage and cookies by visiting the `/debug/clear-storage` page.
