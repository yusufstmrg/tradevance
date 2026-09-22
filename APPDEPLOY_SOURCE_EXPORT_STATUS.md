# Tradevance Production Source Synchronization

- AppDeploy production baseline: v84 / 1788064173919
- AppDeploy app: tradevance-ai-global-trade-network-3cl0x5
- Canonical repository: https://github.com/yusufstmrg/tradevance
- Target branch: main

The current AppDeploy connector exposes source listing/reading but not a bulk remote-snapshot export API. Therefore the connector cannot safely perform a byte-for-byte 1:1 export of every AppDeploy file into GitHub in one atomic operation. This repository records the verified production baseline and package while avoiding secrets and runtime customer data.

Excluded from source control by design: production database contents, customer/private records, authentication sessions/tokens, API keys, passwords, and secret values.

See Tradevance_Full_Production_Sync_Package_v84.zip for the generated production synchronization package.
