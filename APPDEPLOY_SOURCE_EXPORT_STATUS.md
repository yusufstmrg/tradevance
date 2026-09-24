# Tradevance Production Source Synchronization

- AppDeploy production app: `tradevance-ai-global-trade-network-3cl0x5`
- AppDeploy production source baseline inspected: 2026-09-22
- GitHub repository: https://github.com/yusufstmrg/tradevance
- Sync branch: `sync/appdeploy-production-2026-09-22`

## Current state

The AppDeploy runtime contains the full React/Vite frontend and backend source, but the GitHub connector available in this session does not provide a bulk source-snapshot export operation, and GitHub's contents API cannot retrieve binary ZIP contents for reconstruction.

The latest repository `main` currently contains the previously generated production packages:
- `Tradevance_Full_Production_Sync_Package_v84.zip`
- `tradevance-deploy.zip`

The live AppDeploy source is therefore **not yet fully mirrored file-by-file into this GitHub repository**.

## Excluded from source control

Production database records, customer/private records, authentication sessions/tokens, API keys, passwords, and secret values must not be committed.

## Latest production changes inspected

The deployed AppDeploy source includes:
- production-mode guards and demo-data cleanup
- returning-user authentication recovery
- Buyer/Seller onboarding
- public discovery layer
- role-based access control
- verification gates
- real user-scoped dashboard data
- controlled introductions
- RFQ / quote / execution flows

Manual email/password signup requested on 2026-09-22 remains an AppDeploy-side implementation item; the available AppDeploy auth SDK only exposes Google, Apple and X identity-provider sign-in.

