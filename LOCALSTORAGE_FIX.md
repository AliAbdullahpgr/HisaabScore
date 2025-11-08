# localStorage Error Fix

## Problem

The application was throwing `localStorage.getItem is not a function` errors during development on localhost, even though it worked fine on Vercel. This was happening because:

1. Firebase Auth SDK tries to access `localStorage` during initialization
2. Next.js 15 with Turbopack performs server-side rendering (SSR) even for client components
3. `localStorage` is a browser API and doesn't exist in Node.js during SSR
4. Node.js v25 has a `--localstorage-file` flag that was being triggered incorrectly

## Solution

The fix involved three main changes:

### 1. Added localStorage Polyfill for SSR (`src/instrumentation.ts`)

Created a server-side polyfill that provides a mock `localStorage` implementation during SSR:

```typescript
export async function register() {
  if (typeof window === "undefined") {
    // Polyfill localStorage for server-side rendering
    const storage = new Map<string, string>();

    (global as any).localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      get length() {
        return storage.size;
      },
      key: (index: number) => {
        const keys = Array.from(storage.keys());
        return keys[index] ?? null;
      },
    };
  }
}
```

### 2. Made Root Layout a Client Component (`src/app/layout.tsx`)

Added `'use client'` directive to the root layout and moved metadata to HTML meta tags:

```typescript
"use client";

// ... imports ...

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>HisaabScore</title>
        <meta
          name="description"
          content="Your financial passport for the informal economy."
        />
        {/* ... other head content ... */}
      </head>
      {/* ... body content ... */}
    </html>
  );
}
```

### 3. Made Root Page a Client Component (`src/app/page.tsx`)

Added `'use client'` directive to the landing page.

### 4. Fixed API Routes for Build-Time Execution

Added `export const dynamic = 'force-dynamic'` to all API routes and used dynamic imports to prevent Firebase Admin SDK from being initialized during build:

- `src/app/api/create-user-profile/route.ts`
- `src/app/api/generate-pdf/route.ts`
- `src/app/api/generate-report/route.ts`

### 5. Updated Firebase Admin Initialization (`src/lib/firebase/admin.ts`)

Changed from module-level initialization to lazy initialization using getter functions to prevent build-time errors.

## Why It Works on Vercel But Not Locally

Vercel's build environment handles SSR differently and may have built-in polyfills or different Node.js versions. The local development environment with Node.js v25.1.0 and Turbopack was more strict about browser API access during SSR.

## Testing

- ✅ Build succeeds: `npm run build`
- ✅ Dev server runs without errors: `npm run dev`
- ✅ No localStorage errors in console
- ✅ Pages load successfully (GET / 200)

## Files Modified

1. `src/instrumentation.ts` (created)
2. `src/app/layout.tsx`
3. `src/app/page.tsx`
4. `src/lib/firebase/admin.ts`
5. `src/app/api/create-user-profile/route.ts`
6. `src/app/api/generate-pdf/route.ts`
7. `src/app/api/generate-report/route.ts`
8. `src/firebase/index.ts`
9. `src/lib/firebase/config.ts` (deprecated)
10. `next.config.ts` (added webpack config)
