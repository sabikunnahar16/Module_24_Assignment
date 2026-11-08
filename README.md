# PeopleHub

A responsive user management app built with React, Zustand, and the JSONPlaceholder API.

## Features

- Fetches users from `https://jsonplaceholder.typicode.com/users` with `useEffect`
- Displays user name, email, phone, and detailed profile information
- Includes Bangla names with Bangladesh, Australia, UK, USA, Pakistan, and Singapore addresses
- Add or remove users from a favorites list
- Persists favorites in browser Local Storage
- Zustand store manages favorite state
- Responsive layout for mobile and desktop

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

This project can be deployed to [Vercel](https://vercel.com/) by importing this GitHub repository. Use the default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`

Add the deployed Vercel URL here after deployment:

**Live demo:** _Add your Vercel deployment link_
