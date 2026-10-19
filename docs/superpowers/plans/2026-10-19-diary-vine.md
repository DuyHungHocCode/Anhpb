# Nhật ký dây leo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public, vintage vine-timeline diary with protected editing and browser image uploads to the existing Letter page.

**Architecture:** Keep `page.tsx` as a Server Component that reads the public diary, then render Letter and Diary in a narrow client tab component. Route Handlers protect writes with a signed, short-lived cookie created from the shared edit secret. Prisma stores metadata in Postgres; the official Vercel Blob client-upload handler stores public image bytes directly from the browser and persists their metadata on completion.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma/Postgres, Zod 4, Bun test runner, `@vercel/blob`, CSS/SVG.

**Spec:** `docs/superpowers/specs/2026-10-19-diary-vine-design.md`

## Global Constraints

- Preserve the current Letter content, paper palette, open-envelope animation, and reduced-motion support.
- Public visitors need no login; only editor operations require the shared-secret cookie.
- Use `POSTGRES_PRISMA_URL`, `BLOB_READ_WRITE_TOKEN`, and `DIARY_EDIT_SECRET` only server-side; never prefix them `NEXT_PUBLIC_`.
- Sort diary records by `occurredAt` ascending, then `createdAt` ascending.
- A memory permits at most 8 public images, each `image/jpeg`, `image/png`, `image/webp`, or `image/gif` at most 10 MiB; title ≤120 characters and note ≤5,000 characters.
- Do not add UI, auth, upload, or test-framework dependencies beyond official `@vercel/blob`; use Bun's built-in test runner.
- Do not reset or delete the SQLite database; export existing data before a production provider migration.

## Review Focus

- A wrong/expired editor cookie must produce `401` and never mint an upload token — Tasks 2 and 4.
- A client upload payload must not attach an image to a missing or arbitrary memory — Task 4.
- Invalid text/date, type, size, or ninth image must be rejected server-side — Tasks 1, 3, and 4.
- Blob/database deletion failures must be visible and never reported as a success — Task 3.
- At 375px and reduced motion, controls remain keyboard-accessible and the vine never overlays text — Task 5.

---

## Target File Structure

- `prisma/schema.prisma` — Postgres datasource and `Memory`/`MemoryImage` relations.
- `.env.example` — names-only configuration template.
- `src/lib/diary.ts` — DTOs, Zod schemas, limits, and Prisma mapping.
- `src/lib/edit-session.ts` — signed editor-cookie primitives.
- `src/lib/memories.ts` — chronological queries, mutations, and Blob deletion coordination.
- `src/app/api/edit-session/route.ts` — create/delete editor session.
- `src/app/api/memories/route.ts` and `src/app/api/memories/[memoryId]/route.ts` — memory CRUD.
- `src/app/api/blob/route.ts` — Vercel Blob client token exchange and completion callback.
- `src/components/Letter.tsx`, `AppTabs.tsx`, `Diary.tsx` — extracted Letter, Dynamic Island, and diary/editor UI.
- `src/lib/*.test.ts`, `src/app/api/blob/route.test.ts`, `src/components/AppTabs.test.tsx`, `src/components/Diary.test.tsx` — Bun checks.

### Task 1: Establish persistent diary data and validation contracts

**Files:**
- Create: `.env.example`, `src/lib/diary.ts`, `src/lib/diary.test.ts`
- Modify: `package.json`, `bun.lock`, `.gitignore`, `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_add_diary_memories/migration.sql` (generated against a disposable Postgres database)

**Interfaces:**
- Produces `MemoryInput`, `DiaryMemory`, `memoryInputSchema`, `uploadPayloadSchema`, `MAX_IMAGES_PER_MEMORY`, `MAX_IMAGE_SIZE_BYTES`, and `toDiaryMemory()` from `src/lib/diary.ts`.
- These contracts are used by routes, the server page, and client components.

- [ ] **Step 1: Write failing validation tests**

In `src/lib/diary.test.ts`, use `bun:test` to verify that `{ title: "Lần đầu gặp", note: "Trời mưa.", occurredAt: "2026-10-16" }` is accepted; blank/121-character titles, 5,001-character notes, and invalid dates fail. Also verify `uploadPayloadSchema` accepts only JSON containing a valid CUID `memoryId`.

- [ ] **Step 2: Verify the test fails**

Run: `bun test src/lib/diary.test.ts`  
Expected: FAIL because `src/lib/diary.ts` does not exist.

- [ ] **Step 3: Implement `src/lib/diary.ts`**

Export exact constants `MAX_IMAGES_PER_MEMORY = 8` and `MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024`. Define `MemoryInput` as title/note/ISO occurred date; define `DiaryMemory` with ISO dates and images `{ id, url, pathname, alt }[]`. `memoryInputSchema` trims text, enforces the documented lengths and accepts only a real `YYYY-MM-DD` date. `uploadPayloadSchema` parses JSON into `{ memoryId: z.string().cuid() }`. `toDiaryMemory()` converts Prisma dates to ISO strings so client props are serializable.

- [ ] **Step 4: Verify the validation contract**

Run: `bun test src/lib/diary.test.ts`  
Expected: PASS.

- [ ] **Step 5: Configure dependencies, environment, and schema**

Run `bun add @vercel/blob`; add `"test": "bun test"` to `package.json`; add `/.superpowers/` to `.gitignore`; and create `.env.example` with blank `POSTGRES_PRISMA_URL`, `BLOB_READ_WRITE_TOKEN`, and `DIARY_EDIT_SECRET` entries only. Keep `.env*` ignored.

Change Prisma to `provider = "postgresql"` with `url = env("POSTGRES_PRISMA_URL")`. Add `Memory` (`id`, `title`, `note`, `occurredAt`, timestamps, images) and `MemoryImage` (`id`, `memoryId`, `url`, unique `pathname`, `alt`, `createdAt`) with cascade deletion and an `occurredAt` index. Export any live SQLite `User`/`Post` rows before migration. Generate, rather than hand-write, the migration with `bunx prisma migrate dev --name add_diary_memories` against disposable Postgres; never run reset or `db push --accept-data-loss` on production.

- [ ] **Step 6: Verify configuration**

Run: `bunx prisma validate && bunx prisma generate && bun test src/lib/diary.test.ts`  
Expected: all exit 0.

- [ ] **Step 7: Commit**

Run: `git add .env.example .gitignore package.json bun.lock prisma src/lib/diary.ts src/lib/diary.test.ts && git commit -m "feat: add diary data contracts"`

### Task 2: Add the shared-secret editor session

**Files:**
- Create: `src/lib/edit-session.ts`, `src/lib/edit-session.test.ts`, `src/app/api/edit-session/route.ts`

**Interfaces:**
- Produces `createEditSession(expiresAt?: number): string`, `isValidEditSession(value: string | undefined, now?: number): boolean`, and `requireEditorSession(): Promise<void>`.
- Mutation routes use `requireEditorSession`; the Diary unlock form calls `POST /api/edit-session`.

- [ ] **Step 1: Write failing session tests**

Test that a `createEditSession(Date.now() + 60_000)` token verifies, while a token with an appended character and a token created for `Date.now() - 1` fail verification.

- [ ] **Step 2: Verify the test fails**

Run: `bun test src/lib/edit-session.test.ts`  
Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement session primitives and route**

Use `node:crypto` HMAC-SHA-256 over a millisecond expiry, with token format `expiry.signature`; guard different signature lengths before `timingSafeEqual`. Missing `DIARY_EDIT_SECRET`, malformed/changed tokens, and expired timestamps are invalid. `requireEditorSession()` obtains `diary-editor` through `await cookies()` and throws a route-safe unauthorized error when invalid.

`POST /api/edit-session` accepts `{ secret: string }`, compares same-length values timing-safely, then sets `diary-editor` for 12 hours with `httpOnly: true`, `sameSite: "strict"`, `secure` in production, and `path: "/"`. It returns `401` for a wrong secret and `500` for missing configuration. `DELETE` removes the same cookie and returns `204`.

- [ ] **Step 4: Verify session behavior**

Run: `bun test src/lib/edit-session.test.ts`  
Expected: PASS.

Run: `bun run dev`, POST bad and good secrets to `/api/edit-session`, then DELETE.  
Expected: `401`, then `204` with an HttpOnly cookie, then cookie removal.

- [ ] **Step 5: Commit**

Run: `git add src/lib/edit-session.ts src/lib/edit-session.test.ts src/app/api/edit-session/route.ts && git commit -m "feat: protect diary editing with a shared secret"`

### Task 3: Implement protected memory CRUD and chronological reads

**Files:**
- Create: `src/lib/memories.ts`, `src/lib/memories.test.ts`, `src/app/api/memories/route.ts`, `src/app/api/memories/[memoryId]/route.ts`
- Modify: `src/lib/db.ts`

**Interfaces:**
- Produces `listMemories(): Promise<DiaryMemory[]>`, `createMemory(input)`, `updateMemory(id, input)`, and `deleteMemory(id)`.
- The server page reads `listMemories`; the UI calls POST/PATCH/DELETE memory routes; the Blob route attaches images through this service.

- [ ] **Step 1: Write failing CRUD tests**

With Bun mocks for `db.memory` and `@vercel/blob`, assert `listMemories` uses `{ occurredAt: "asc" }, { createdAt: "asc" }`; invalid input does not call `db.memory.create`; missing IDs become not-found results; and a rejected `del()` error leaves `db.memory.delete` uncalled and reaches the caller.

- [ ] **Step 2: Verify the test fails**

Run: `bun test src/lib/memories.test.ts`  
Expected: FAIL because the service does not exist.

- [ ] **Step 3: Implement `src/lib/memories.ts`**

`listMemories()` includes images and maps result records with `toDiaryMemory`. `createMemory(input)` and `updateMemory(id, input)` validate with `memoryInputSchema`, return `DiaryMemory`, and distinguish a missing ID. `deleteMemory(id)` first reads image pathnames, calls Blob `del(pathnames)`, then deletes the memory through Prisma cascade; expose any Blob error instead of claiming a delete completed. Add a small `attachImage(memoryId, blob)` operation used only after the upload handler rechecks memory existence and image count.

Keep the Prisma development singleton in `src/lib/db.ts`, but do not enable query logging in production.

- [ ] **Step 4: Implement exact route behavior**

`POST /api/memories` requires the session, validates JSON, creates a memory, and returns `201` JSON. `PATCH` and `DELETE /api/memories/[memoryId]` require the session; PATCH returns the updated DTO and DELETE returns `204`. Convert invalid JSON/input to `400`, missing memory to `404`, missing/expired editor session to `401`, and unexpected failures to `500` with a generic Vietnamese error message.

- [ ] **Step 5: Verify CRUD**

Run: `bun test src/lib/memories.test.ts`  
Expected: PASS.

With local Postgres and a valid cookie, create, update, and delete a record via the routes.  
Expected: reload shows chronological public data; unauthenticated writes return `401`.

- [ ] **Step 6: Commit**

Run: `git add src/lib/db.ts src/lib/memories.ts src/lib/memories.test.ts src/app/api/memories && git commit -m "feat: add protected diary memory CRUD"`

### Task 4: Add authorized direct-to-Blob image upload

**Files:**
- Create: `src/app/api/blob/route.ts`, `src/app/api/blob/route.test.ts`
- Modify: `src/lib/memories.ts`, `src/lib/memories.test.ts`

**Interfaces:**
- Consumes `handleUpload` and `HandleUploadBody` from `@vercel/blob/client`, upload contracts from Task 1, editor session from Task 2, and memory service from Task 3.
- Produces `POST /api/blob`, compatible with `clientUpload()` in Task 5.

- [ ] **Step 1: Write failing Blob authorization/constraint tests**

Test a small route helper that rejects no editor session, malformed payload, a missing memory, and a memory with 8 images before token generation. Assert accepted requests constrain `allowedContentTypes` exactly to JPEG/PNG/WebP/GIF, `maximumSizeInBytes` to `MAX_IMAGE_SIZE_BYTES`, and set `addRandomSuffix: true`.

- [ ] **Step 2: Verify the test fails**

Run: `bun test src/app/api/blob/route.test.ts`  
Expected: FAIL because the helper/route does not exist.

- [ ] **Step 3: Implement `POST /api/blob`**

Read the request body as `HandleUploadBody` and delegate to `handleUpload`. In `onBeforeGenerateToken`, require the editor cookie, parse/validate `clientPayload`, confirm the target memory exists and has fewer than 8 images, and return the exact type/size constraints, random suffix, and a token payload containing only the validated memory ID. Require requested paths to begin `memories/<memoryId>/`.

In `onUploadCompleted`, parse the trusted token payload, recheck that the memory exists and has capacity, and call `attachImage(memoryId, { url: blob.url, pathname: blob.pathname, alt: blob.pathname })`. Do not trust a browser-provided URL/path. Return non-2xx from a callback persistence failure so Vercel retries. Return `401` for authorization failures and `400` for invalid upload input.

- [ ] **Step 4: Verify client upload behavior**

Run: `bun test src/app/api/blob/route.test.ts`  
Expected: PASS.

Deploy a Vercel Preview, unlock the editor, and upload each allowed image type.  
Expected: the metadata is present after refresh; a ninth/oversize/wrong-type file and no-editor-token request are refused.

Note: Blob cannot call localhost for upload completion; use Preview or an HTTPS tunnel with `VERCEL_BLOB_CALLBACK_URL` locally.

- [ ] **Step 5: Commit**

Run: `git add src/app/api/blob/route.ts src/app/api/blob/route.test.ts src/lib/memories.ts src/lib/memories.test.ts && git commit -m "feat: upload diary images to Vercel Blob"`

### Task 5: Build the Dynamic Island and vine diary interface

**Files:**
- Create: `src/components/Letter.tsx`, `src/components/AppTabs.tsx`, `src/components/Diary.tsx`, `src/components/AppTabs.test.tsx`, `src/components/Diary.test.tsx`
- Modify: `src/app/page.tsx`, `src/app/vintage.css`, `src/app/layout.tsx`

**Interfaces:**
- `AppTabs` receives serialized `DiaryMemory[]` and a server-rendered `Letter` child.
- `Diary` calls session/memory/blob routes and `clientUpload` from `@vercel/blob/client`.

- [ ] **Step 1: Write failing accessibility render checks**

Use `renderToStaticMarkup` from installed `react-dom/server` with Bun test. In `AppTabs.test.tsx`, assert labelled tab buttons and initial `aria-pressed` state. In `Diary.test.tsx`, assert timeline articles with dates, image `alt` values, and a labelled password input for editor unlock; do not add a rendering dependency.

- [ ] **Step 2: Verify the UI check fails**

Run: `bun test src/components/AppTabs.test.tsx src/components/Diary.test.tsx`  
Expected: FAIL because the components do not exist.

- [ ] **Step 3: Preserve Letter while adding server/client composition**

Move the current SVG helpers and Letter markup unchanged to `Letter.tsx`. Make `page.tsx` an async Server Component, export `dynamic = "force-dynamic"`, fetch `listMemories()`, and render the existing grain/envelope siblings plus `<AppTabs memories={memories}><Letter /></AppTabs>`. Keep the checkbox/envelope markup in `page.tsx`, so selectors such as `#letter-open:checked ~ .letter-content` still work. Amend metadata to mention the diary.

Make `AppTabs.tsx` a `"use client"` component whose root has the existing `.letter-content` class. It renders fixed `LETTER` and `NHẬT KÝ` buttons in the Dynamic Island, manages selected panel state, retains the supplied server-rendered Letter child, and mounts Diary only in the diary panel. Buttons must work with mouse/touch/Tab/Enter/Space and expose `aria-pressed` plus `aria-controls`; do not add routing or swipe gestures.

- [ ] **Step 4: Implement `Diary.tsx` editor flow**

Render “Những ngày của chúng mình”, an empty-state sentence, and cards in supplied chronological order. Each card has Vietnamese-formatted date, title, note, responsive public images with alt fallback, and a vine node. The editor first POSTs the secret to `/api/edit-session`; only then show one inline create/edit form with title, date, note, file input, save/cancel/delete controls.

On save, call memory APIs then call `clientUpload` per selected file with pathname `memories/<memoryId>/<sanitized-file-name>`, `handleUploadUrl: "/api/blob"`, and `clientPayload: JSON.stringify({ memoryId })`. Mirror file limits in the browser but rely on server enforcement. Refresh server data after mutations/uploads and show API/upload error text beside the form. Never retain the secret beyond the unlock request, localStorage, or URL.

- [ ] **Step 5: Add minimal scoped vintage CSS**

Add `.dynamic-island`, `.diary`, `.vine-timeline`, `.memory-card`, editor-form and image-grid styles. Reuse `--paper`, `--card`, `--ink`, and hairline variables; add only muted vine/leaf green variables. Alternate cards around a centered vine on desktop; under 560px move vine left and stack cards. Extend the existing `prefers-reduced-motion` block for tab indicator and diary transitions. Keep grain/vignette behind controls and text contrast readable.

- [ ] **Step 6: Verify UI and complete flow**

Run: `bun test src/components/AppTabs.test.tsx src/components/Diary.test.tsx && bun run lint && bun run build`  
Expected: all exit 0.

Manually test desktop and 375px screens: envelope open, keyboard/mouse/touch tab changes, empty and multi-memory states, reduced motion, unlock, create/edit/delete, accepted/rejected image uploads.  
Expected: Letter remains visually unchanged, no focus trap occurs, the vine avoids text, and errors are visible.

- [ ] **Step 7: Commit**

Run: `git add src/app/page.tsx src/app/vintage.css src/app/layout.tsx src/components && git commit -m "feat: add vintage diary vine interface"`

### Task 6: Configure Vercel and verify end to end

**Files:**
- Modify: `docs/superpowers/specs/2026-10-19-diary-vine-design.md` only if implementation decisions changed.

**Interfaces:**
- Consumes the completed routes, database, Blob store, and Vercel Preview environment.
- Produces verified deploy configuration; it makes no speculative product changes.

- [ ] **Step 1: Provision the production services**

Create/connect a Vercel Blob store and Postgres database. Set `POSTGRES_PRISMA_URL`, `BLOB_READ_WRITE_TOKEN`, and a long random `DIARY_EDIT_SECRET` in Production and Preview. Enable Vercel system environment variables so completion callbacks target the correct Preview/Production URL. Apply the reviewed Prisma migration only after the SQLite export/backup check from Task 1.

- [ ] **Step 2: Run the full automated suite**

Run: `bun test && bun run lint && bunx prisma validate && bun run build`  
Expected: all exit 0; no newly introduced TypeScript failure is hidden by the existing `ignoreBuildErrors` setting.

- [ ] **Step 3: Verify Preview in an incognito window**

Check public diary access, bad/good edit secrets, CRUD persistence after reload, direct-upload completion, type/size/count rejection, memory deletion, desktop/mobile visual layout, keyboard controls, and reduced motion.  
Expected: all public reads work without cookies; every protected mutation fails without the editor cookie and succeeds only with it.

- [ ] **Step 4: Commit final documentation only when changed**

Run: `git status --short` and, only if the design document changed, `git add docs/superpowers/specs/2026-10-19-diary-vine-design.md && git commit -m "docs: record diary deployment configuration"`.

## Self-Review

- **Spec coverage:** Task 1 covers the data model, limits, Postgres migration and configuration. Tasks 2–4 implement edit protection, public data CRUD, and direct Blob upload persistence. Task 5 preserves Letter and supplies the approved Dynamic Island/vine UI. Task 6 verifies Vercel deployment, backup, and production behavior.
- **Step scan:** Each task begins with a failing check or concrete configuration action, specifies exact files/interfaces, has a passing check, and ends at a reviewable commit. No implementation body is transcribed.
- **Type consistency:** Client boundaries use serialized `DiaryMemory`; all mutation paths share `MemoryInput`, Zod schemas, image constants, and `requireEditorSession`; Blob completion uses the same memory ID payload as the client.
- **Review Focus:** Every listed risk is assigned to test/manual verification in Tasks 1–5, with Preview verification repeated in Task 6.
- **Proportion:** The plan locks product decisions and interfaces without adding unrequested features such as user accounts, private image delivery, drag-and-drop, comments, or a separate admin UI.
