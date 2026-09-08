# Tradevance — AppDeploy Production Source Baseline

This repository is being synchronized with the live Tradevance application deployed in AppDeploy.

- AppDeploy app: `tradevance-ai-global-trade-network-3cl0x5`
- AppDeploy production snapshot: `v84`
- AppDeploy version ID: `1788064173919`
- Baseline date: 2026-08-30
- GitHub repository: `yusufstmrg/tradevance`
- GitHub default branch: `main`

## Source inventory

The AppDeploy v84 snapshot contains the following source files:

```text
appdeploy.auth-login.json
backend/adaptive-workspace.ts
backend/admin-access.ts
backend/admin-scoped.ts
backend/compliance.ts
backend/deal-risk.ts
backend/decision-mesh.ts
backend/execution-intelligence.ts
backend/index.ts
backend/ingestion.ts
backend/localization.ts
backend/negotiation.ts
backend/official-sanctions.ts
backend/opportunity-autopilot.ts
backend/payment.ts
backend/predictive-alerts.ts
backend/production.ts
backend/realtime-subscribers.ts
backend/realtime.ts
backend/risk.ts
backend/trade-memory.ts
backend/trade-room.ts
backend/verification.ts
index.html
package.json
postcss.config.js
public/resources/tradevance-original-logo.png
public/robots.txt
src/AccessCenter.tsx
src/AdaptiveWorkspace.tsx
src/AdminIntelligence.tsx
src/AgentControlCenter.tsx
src/App.tsx
src/CommercialGuardrails.tsx
src/DataFabric.tsx
src/DealOrigination.tsx
src/DecisionMesh.tsx
src/EntityIntelligence.tsx
src/ExecutionCenter.tsx
src/GlobalDataConnectivity.tsx
src/IntelligenceCenter.tsx
src/InternalOperationsCenter.tsx
src/LegalCenter.tsx
src/NetworkView.tsx
src/OpportunityAutopilot.tsx
src/PredictiveAlerts.tsx
src/ProfileCenter.tsx
src/PublicExplorer.tsx
src/QuoteIntelligence.tsx
src/RBACCenter.tsx
src/TradeDeskCopilot.tsx
src/TradeMemory.tsx
src/TradeOSFlow.tsx
src/TrustCompliance.tsx
src/access.css
src/adaptive-workspace.css
src/admin.css
src/auth-landing.css
src/data-fabric.css
src/deal-origination.css
src/decision-mesh.css
src/entity.css
src/global-data-connectivity.css
src/i18n.css
src/i18n.ts
src/index.css
src/intelligence.css
src/light-theme.css
src/main.tsx
src/opportunity-autopilot.css
src/original-logo-overrides.css
src/predictive-alerts.css
src/profile-premium.css
src/public-explorer.css
src/quote.css
src/rbac.css
src/sales-engine.css
src/trade-memory.css
src/trade-os-flow.css
src/trust-compliance.css
src/ux-friendly.css
tailwind.config.js
tests/tests.txt
tsconfig.json
vite.config.ts
```

## Important source-control boundary

GitHub is the durable source-control layer for code and configuration. Live customer records, authentication sessions, production database contents, payment records, private documents, secrets, and other runtime data must **not** be copied into a public source repository.

The AppDeploy production snapshot remains the runtime authority until the full source export is synchronized and validated against this repository. No production deployment should be considered GitHub-controlled solely from the presence of this manifest.

## Synchronization rule

Before each production release, the canonical source must be reconciled between AppDeploy and this repository. Secrets are injected through the deployment secret manager and must never be committed.
