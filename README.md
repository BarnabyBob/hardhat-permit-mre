# hardhat-permit-mre

MRE for Hardhat >2.7.1 permit behavior

## Setup

-   create a `.env` config file and populate at least one of the RPC endpoints
-   update `HARDHAT_BLOCKCHAIN_FORK` accordingly (located in `lib/config.ts`)

### Bug

To reproduce:
1. `npm i && npm run build`
2. `npm run test`
3. observe the behavior on the two different branches:
    - `main` branch runs with `hardhat@2.9.1` and manifests the bug (`vanilla permit` test suite fails with `"ERC20Permit: invalid signature"`)
    - `2.7.1` branch runs with `hardhat@2.7.1` and the test suite passes, the other parameters are exactly the same
