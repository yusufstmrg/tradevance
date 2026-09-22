# Tradevance Production Baseline v84

AppDeploy app: `tradevance-ai-global-trade-network-3cl0x5`
Production version: `1788064173919` (v84)
Canonical repository: `yusufstmrg/tradevance`
Branch: `main`

## Verified production source inventory

Backend: 21 TypeScript modules.
Frontend: React/Vite application with 30+ TSX modules and corresponding CSS modules.
Configuration: Vite, TypeScript, Tailwind, PostCSS, AppDeploy auth configuration.
Public assets: Tradevance logo and robots.txt.
Testing: existing `tests/tests.txt` in AppDeploy v84.

## Runtime boundary

Secrets, credentials, authentication sessions, private customer data, production databases and transactional records are not committed to the public repository.

## Synchronization note

The AppDeploy connector available to this session exposes file listing and file reads but does not expose a bulk remote-snapshot export primitive. This document therefore records the verified production baseline without falsely representing a partial extraction as a complete source mirror.
