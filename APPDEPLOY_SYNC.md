# Tradevance — AppDeploy Production Source Baseline

This repository is being synchronized with the Tradevance application deployed in AppDeploy.

- AppDeploy app: `tradevance-ai-global-trade-network-3cl0x5`
- Verified AppDeploy snapshot: `v84`
- AppDeploy version ID: `1788064173919`
- GitHub repository: `yusufstmrg/tradevance`
- GitHub default branch: `main`

## Synchronization status

The AppDeploy connector available in this environment exposes the remote source for inspection and controlled updates, but does not expose a bulk byte-for-byte remote-snapshot export operation. Therefore this file is a provenance record and **does not claim that the GitHub tree is already a 1:1 mirror of the AppDeploy snapshot**.

The repository must not be treated as the sole production source of truth until the complete source tree has been exported and integrity-verified against AppDeploy.

## Source-control boundary

GitHub is for source code, configuration, tests, documentation, and release metadata. Live customer records, authentication sessions, production database contents, payment records, private documents, API keys, passwords, and other secrets must never be committed to this public repository.

## Required final state

`GitHub main` → canonical source → CI/CD → AppDeploy build → QA → production.

The final 1:1 synchronization must be performed only after a complete AppDeploy source export is available and can be verified file-by-file. Until then, AppDeploy remains the production runtime authority.
