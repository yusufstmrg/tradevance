# Tradevance — AppDeploy Production Source Manifest

- AppDeploy app: `tradevance-ai-global-trade-network-3cl0x5`
- Production snapshot: `1788064173919` (v84)
- Sync branch: `appdeploy-v84-sync`
- GitHub repository: `yusufstmrg/tradevance`

## Verified AppDeploy source inventory

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

## Sync boundary

This manifest records the exact AppDeploy production snapshot inventory. Runtime databases, customer records, authentication sessions, payment credentials, API secrets, and private documents are intentionally excluded from Git source control.

The current AppDeploy connector does not expose a bulk remote-snapshot-to-GitHub operation; therefore this branch is a controlled synchronization branch and must not be represented as a byte-for-byte mirror until every listed source blob has been exported and verified.
