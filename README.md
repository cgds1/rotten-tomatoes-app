# CineRank

Mobile app for discovering, rating, and reviewing movies and series — with separate scoring between regular users and critics.

Built with **Ionic 8 · Angular 20 · Capacitor 8 · TypeScript 5.9**

> **Backend:** [rotten-tomatoes-app-back](https://github.com/betomartinez13/rotten-tomatoes-app-back) — NestJS 11 + Prisma + PostgreSQL + TMDB API, deployed on Railway.

---

## Features

- **Movie & series discovery** via TMDB integration — search by title, genre, release date, and score
- **Dual rating system** — user ratings and critic ratings calculated and displayed separately
- **Comment system** — one review per user per title, with score (1–10) and edit/delete
- **Sorting & filtering** — by user rating, critic rating, release date, popularity, and title
- **Full detail view** — synopsis, release date, cast, poster, and both rating scores
- **User CRUD** — register, update profile, delete account
- **Role-based access** — `USER` and `CRITIC` roles with separate weighted averages
- **JWT authentication** — access + refresh token flow with automatic renewal

---

## Tech Stack

| Technology | Role |
|---|---|
| Ionic 8 | UI components and mobile shell |
| Angular 20 | Framework (NgModules) |
| Capacitor 8 | Native bridge for iOS/Android |
| TypeScript 5.9 | Language |
| Angular Signals | Reactive state management |
| RxJS | Async streams and HTTP |

---

## Architecture

```
src/app/
├── core/               # App-wide singletons: interceptors, guards, tokens
├── shared/             # Reusable components and pipes
├── state/              # Angular Signals-based state slices
└── features/
    ├── auth/           # Login, register
    ├── movies/         # List, search, detail, filters
    ├── comments/       # Review form and display
    └── profile/        # User settings and account management
```

Notable patterns:
- **Injection tokens** to abstract service dependencies
- **Functional interceptors** for auth headers and token refresh
- **Optimistic updates with rollback** on comment operations
- **Token refresh deduplication** — concurrent requests queue behind a single refresh call
- **`trackBy`** on all list renderings for performance

---

## Getting Started

### Prerequisites

- Node.js 20+
- Ionic CLI: `npm install -g @ionic/cli`
- Backend running locally or pointing to the Railway deployment

### Installation

```bash
git clone https://github.com/cgds1/CineRank-app.git
cd CineRank-app
npm install
```

### Environment Setup

Copy `environment.example.ts` and fill in the values:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',   // or Railway URL
};
```

### Running

```bash
# Web (browser)
ionic serve

# Android
ionic cap run android

# iOS
ionic cap run ios
```

---

## Related Repository

The backend is maintained separately:

| | |
|---|---|
| **Repo** | [betomartinez13/rotten-tomatoes-app-back](https://github.com/betomartinez13/rotten-tomatoes-app-back) |
| **Stack** | NestJS 11 · Prisma 7 · PostgreSQL 16 · TMDB API |
| **Deployment** | Railway |
| **Docs** | `/docs` (Swagger) |

---

## Academic Context

Developed as a university project at Universidad Rafael Urdaneta for the Mobile Development course (Móviles 2026C).

Team:
- [Carlos Díaz](https://github.com/cgds1) — Frontend (Ionic + Angular)
- [Beto Martinez](https://github.com/betomartinez13) — Backend (NestJS + Prisma)
