# Architecture and Data Handling Implementation

## Overview
This project is a Next.js web application designed for the Dräxlmaier Production Quality Monitoring System. Currently, it primarily operates as a **client-side application** with **local persistence**, while containing the structural setup for a full-stack implementation with MongoDB.

## Architecture

### Frontend (Client-Side)
- **Framework:** Next.js (App Router) with React.
- **Main Component:** `src/components/DraexlmaierApp.tsx` serves as the core orchestrator.
- **State Management:**
    - **React `useState`:** Manages immediate UI state such as:
        - `isLoggedIn`: Authentication status.
        - `controlData`: List of quality controls (currently stored in memory, lost on refresh).
        - `formData`: Input state for new controls.
        - `dashboardImages`: Images for the dashboard.
    - **`localStorage` (via `src/lib/storage.ts`):** Used for persisting settings and some shared state across browser sessions on the same device.

### Backend (Server-Side) & Database
- **Structure:** The project is set up with Next.js API routes (`src/app/api/...`) and Mongoose (`src/lib/mongoose.ts`) for MongoDB connectivity.
- **Current Status:**
    - The API routes (e.g., `src/app/api/brds/route.ts`) are currently **disabled** (returning "API Disabled").
    - There are no active network calls (`fetch`) from the main component to these APIs.
    - Database models like `SystemState` exist but are not currently actively utilized by the frontend for data synchronization.

## Data Handling Flow

### 1. Authentication
- **Logic:** Client-side verification in `DraexlmaierApp.tsx`.
- **Credential Check:** Checks against a hardcoded password (`drax123`) and allows any non-empty username.
- **Session:** Session state is volatile (in-memory) and resets upon page reload.

### 2. persistence Strategy
The application currently relies on the browser's `localStorage` for data persistence. This is handled by `src/lib/storage.ts`.

- **Persisted Data:**
    - `draexlmaier_language`: User's language preference (FR/EN/AR).
    - `draexlmaier_shared_image`: Stores the path or base64 data of uploaded images.
    - `draexlmaier_dashboard_images`: Stores dashboard images.
    - `draexlmaier_partier_resolved`: Tracks the validation status of different parties.

- **Volatile Data:**
    - `controlData`: The arrays of recorded defects and controls are currently stored in React state (`useState`), meaning they are **lost when the page is refreshed** or the browser is closed.

## Future Scalability (Ready to Implement)
The codebase includes the necessary scaffolding to switch to a robust full-stack model:
1.  **Database Connection:** `connectToDatabase` in `mongoose.ts` is ready to connect to a MongoDB instance.
2.  **API Routes:** Files like `src/app/api/brds/route.ts` are placeholders that can be enabled to perform CRUD operations.
3.  **Frontend Integration:** The `saveControl` and `useEffect` hooks in `DraexlmaierApp.tsx` can be updated to `fetch` data from these APIs instead of just setting local state.
