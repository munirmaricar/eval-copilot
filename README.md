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

## Commands

- `npm run dev` - Start the development server
- `npm run build` - Build production version of the app
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run ts` - Run TypeScript checks

## Resetting the App

To reset the app, you can clear the local storage and cookies by visiting the `/debug/clear-storage` page.

## Technologies

The project uses the following technologies:

- [Next.js](https://nextjs.org/docs) as the React framework
- [React](https://reactjs.org/docs/getting-started.html)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [react-query](https://tanstack.com/query/v5/docs/framework/react/overview) for data fetching
- [Vercel's AI Tools](https://vercel.com/ai) for integration with OpenAI
- [Vercel](https://vercel.com/docs) for deployment
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for storing user data

## Directories

- `src/app/api/`: contains Next.JS API routes, currently used for setting cookies and streaming GPT responses
- `src/app/components/`: contains React components
- `src/app/db/`: contains the logic for storing and retrieving data from `localStorage`
- `src/app/lib/api/`: contains the logic for the mock API
- `src/lib/open-ai/`: contains the logic for interacting with the OpenAI API
- `src/app/lib/queries/`: contains the [react-query](https://tanstack.com/query/v5/docs/framework/react/overview) queries that fetch data from the API
- `src/app/utils/`: contains utility functions

## General Info

### Adding initial data for when a user first visits the app

When the user first visits the app data is preloaded into local storage (for example base metrics).

To update this data or add more data to be preloaded, update the file `src/app/db/setInitialMetric.ts`.

### Data Structure

The mocked backend data structure (found in `/app/types/index.ts`) was set up before we fully understood how this data would eventually be stored.

As a result, there are a few bits of data that are linked to the `Prompt` data type that should in fact be linked to the `Metric` data type (e.g. `Prompt.inputVariables` and `Prompt.criteria` should be linked to `Metric`).

This should be noted when implementing the real backend, or making changes to the app.

### Cookies

We set and unset a single cookie in the app, `has-loaded`. This cookie is used to determine whether the user has visited the app before. If the cookie is set, the user is taken to the `/metric/create` page on first load, otherwise they are taken to the `/` page.

A cookie is used here as we are able to read it on the server side, and redirect the user based on its value. This avoids the `/` page being briefly displayed before the redirect.

The relevant code can be found in the following files:

- `src/app/api/set-has-loaded-cookie/route.ts`: sets the cookie
- `src/app/api/unset-has-loaded-cookie/route.ts`: unsets the cookie
- `app/layout.tsx`: reads the cookie and redirects the user
- `app/LayoutWrapper.tsx`: calls `/api/set-has-loaded-cookie` to set the cookie on intial page load
- `app/debug/clear-storage/page.tsx`: calls `/api/unset-has-loaded-cookie` to unset the cookie (and clear local storage for a clean app restart)

### Test Cases Data Sync

The test case data is stored in React state while the user is creating, updating and deleting test cases.

It is then synced to the DB after a 1-second delay from the last user interaction with test cases.

This is to prevent the app from making too many requests to the DB while the user is interacting with the test cases.

The code for this syncing logic can be found in `src/app/generate/useSyncTestCasesData.ts`.

### Cohen's Kappa

The Cohen's Kappa calculation is done in the `src/app/lib/maths/cohensKappa.ts` file.

This was copied directly from the [cohens-kappa-js](https://github.com/aaronnorby/cohens-kappa-JS) repository.
