# The Ledger — Verifiable Profile Badges (Primus)

A web app that lets users generate zkTLS-verified badges — X follower
counts, GitHub contributions, Spotify stats, exchange KYC level, event
attendance, etc. — using [Primus](https://primuslabs.xyz)'s zkTLS SDK, then
collect them into a shareable "Verifiable Profile."

Each badge is rendered as a wax-seal style certificate showing the verified
value, the issuer, and a fragment of the cryptographic proof's signature.

## What's already built

- Landing page + template picker (8 starter templates across social, dev,
  exchange, music, and events categories)
- Full Primus zkTLS integration wrapper (`src/lib/primus.ts`) using the
  real `@primuslabs/zktls-js-sdk` API: `init → generateRequestParams →
  setAttMode → startAttestation → verifyAttestation`
- A **demo mode** that runs automatically for any template without a real
  Primus Template ID (or if the extension/app credentials aren't set up
  yet), so you can click through the whole flow immediately
- A "Verifiable Profile" page that persists collected badges to
  `localStorage` and lets users share each one to X or copy a proof link
- A distinct visual identity: parchment-and-brass "official seal" badges on
  a deep ink background, rather than a generic dashboard look

## Running it locally

```bash
npm install
npm run dev
```

Open the printed local URL. Everything works in demo mode out of the box —
no Primus account needed to try the UI.

## Wiring up real, live proofs

To generate actual zkTLS attestations instead of demo ones:

1. **Create a Primus account & project.** Go to the
   [Primus Developer Hub](https://dev.primuslabs.xyz), sign up, and create
   a project to get an `appId` and `appSecret`.
2. **Set your credentials.** Copy `.env.example` to `.env` and fill in:
   ```
   VITE_PRIMUS_APP_ID=your_app_id
   VITE_PRIMUS_APP_SECRET=your_app_secret
   ```
   Warning: `appSecret` is exposed to the browser in this prototype setup,
   which is fine for a demo but **not for production**. Before launch, move
   request-signing to a small backend (Primus's Core SDK is meant for
   exactly this — see their Backend Integration docs) so the secret never
   ships to the client.
3. **Pick real Template IDs.** In the Developer Hub, search the template
   market for the data sources you want (X followers, GitHub, Spotify,
   Binance KYC, etc. are common pre-built templates) or create your own.
   Copy each Template ID into `src/lib/templates.ts`, replacing the
   `YOUR_..._TEMPLATE_ID` placeholders. Templates without a real ID keep
   running in demo mode automatically — nothing breaks if you only wire up
   a few to start.
4. **Install the Primus Chrome extension.** Live attestations require the
   user (and you, while testing) to have the Primus browser extension
   installed — it's what actually captures and signs the TLS session data.
   Users without it installed get a friendly error with a fallback to demo
   mode.
5. **Adjust `displayField` per template** in `src/lib/templates.ts` to
   match the actual JSON field each template's response resolves to (this
   depends on how you configure the template's `responseResolves` in the
   Developer Hub).

## Where to go from here

- **On-chain soulbound badges:** Primus ships Solidity contracts
  (`@primuslabs/zktls-contracts`) with a `verifyAttestation` function you
  can call from your own contract to mint a badge only after checking the
  proof on-chain. Right now this app verifies proofs client-side and
  stores them locally — swap in a contract call in `src/lib/primus.ts`
  once you're ready.
- **Public proof pages:** `ShareBar` currently links to `/proof/:id`,
  which doesn't exist yet. Stand up a small backend (or serverless
  function) that stores attestations by ID and renders a public,
  re-verifiable page — that's what turns "screenshot of a badge" into
  "actually verifiable by anyone."
- **More templates:** the template registry is just a typed array —
  duplicate an entry in `src/lib/templates.ts` to add more sources.
- **Credit scores / agent reputation / airdrop eligibility:** these are
  really just new templates plus a scoring layer that reads several
  `ProofRecord`s from a user's profile — the data model in
  `src/lib/types.ts` already supports composing multiple proofs per
  person.

## Project structure

```
src/
  lib/
    types.ts         # ProofRecord, BadgeTemplate types
    templates.ts      # the registry of provable data sources
    primus.ts          # Primus SDK wrapper (live + demo attestation)
    storage.ts          # localStorage persistence for collected proofs
  components/
    Header.tsx, Hero.tsx, TemplateGrid.tsx,
    ProofModal.tsx, BadgeSeal.tsx, ProfileView.tsx, ShareBar.tsx
  App.tsx
```
