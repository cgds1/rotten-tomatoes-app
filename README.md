# CineRank

A mobile app for movie reviews and discovery. Search, rate, and find out what regular users and critics think about the movies you care about.

## What is CineRank

CineRank is a platform where movie lovers can explore a catalog of films, write reviews with scores, and check what the community thinks. What sets it apart is its **dual rating system**: ratings from regular users and critics are displayed separately, allowing you to compare both perspectives — similar to how Rotten Tomatoes works.

The movie catalog comes from **TMDB (The Movie Database)**, including synopses, cast, images, and release dates. All of this is complemented by reviews and ratings from the CineRank community.

## Features

### Explore movies
- Movie catalog with poster, title, and ratings at a glance
- Filter by category: action, drama, comedy, horror, sci-fi, mystery, romance, animation
- Sort by top rated (users), top rated (critics), or most recent
- Search by name with recent search history

### Movie detail
- Cover image, synopsis, and release date
- Cast with photos and character names
- User rating and critic rating displayed separately
- All community reviews with a visual indicator of who is a user and who is a critic

### Reviews and ratings
- Write a review with a score from 1 to 10 for any movie
- Edit or delete your own review
- One review per movie per user
- Ratings are recalculated automatically when a review is published, edited, or deleted

### Two types of users
- **User**: anyone who signs up. Their score contributes to the user rating
- **Critic**: a user with a special role. Their score contributes to the critic rating, visually distinguished with a gold color

### Profile
- View your info, role, and stats (number of reviews, average score given)
- List of all your reviews with direct access to each movie
- Edit name and account details
- Delete account with double confirmation

### Onboarding
- Welcome screen with three slides introducing the app on first launch

## Visual identity

CineRank follows a design direction called **"Cineteca Editorial"**: a dense dark theme with display typography that gives it personality, moving away from generic app aesthetics.

- Deep black background (`#0D0D0D`) with dark gray surfaces
- Gold (`#C8A96E`) for everything related to critics
- Steel blue (`#6E9CC8`) for everything related to users
- Red (`#FF3D2E`) reserved exclusively for action buttons
- Serif typography for titles, monospace for numbers and ratings
- Subtle animations: cards with entrance effect, animated count on ratings, golden shimmer on loading states

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Ionic 8 + Angular 18 (Standalone Components) |
| Backend | NestJS + Prisma + PostgreSQL |
| External API | TMDB (The Movie Database) |
| Platform | Android (Capacitor) + Web |
| Backend deploy | Railway |

## Prerequisites

- Node.js 18+
- Ionic CLI (`npm install -g @ionic/cli`)
- Android Studio (for device builds)
- An Android device with USB debugging enabled (for native testing)

## Installation

```bash
# Clone the repository
git clone https://github.com/cgds1/rotten-tomatoes-app.git
cd rotten-tomatoes-app

# Install dependencies
npm install

# Run in browser
ionic serve

# Run on Android device
ionic build
ionic cap sync android
ionic cap run android --livereload --external
```

## Project structure

```
src/app/
├── core/           Services, interceptors, guards, and models
├── shared/         Reusable components and pipes
├── state/          Global state with Angular Signals
└── features/       Screens organized by functionality
    ├── auth/       Login and registration
    ├── movies/     List, search, and movie detail
    ├── comments/   Review form
    ├── profile/    Profile and editing
    └── onboarding/ Welcome screen
```

## Authors

Project developed for the **Mobile Development 2026C** course — Professor Mario González.
