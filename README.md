
# Perennial v2.3 contest details

- Join [Sherlock Discord](https://discord.gg/MABEWyASkp)
- Submit findings using the issue page in your private contest repo (label issues as med or high)
- [Read for more details](https://docs.sherlock.xyz/audits/watsons)

# Q&A

### Q: On what chains are the smart contracts going to be deployed?
Currently deployed to Arbitrum and Base. Other EVM L2s are eligible but only Optimism Chains and Arbitrum are currently supported for gas pricing
___

### Q: Which ERC20 tokens do you expect will interact with the smart contracts? 
DSU and USDC (Both USDC/USDC.e on Arbitrum, native USDC on other chains)
___

### Q: Which ERC721 tokens do you expect will interact with the smart contracts? 
None
___

### Q: Do you plan to support ERC1155?
No
___

### Q: Which ERC777 tokens do you expect will interact with the smart contracts? 
None
___

### Q: Are there any FEE-ON-TRANSFER tokens interacting with the smart contracts?

No
___

### Q: Are there any REBASING tokens interacting with the smart contracts?

No
___

### Q: Are the admins of the protocols your contracts integrate with (if any) TRUSTED or RESTRICTED?
DSU - TRUSTED
Pyth (or other oracle providers) - TRUSTED
___

### Q: Is the admin/owner of the protocol/contracts TRUSTED or RESTRICTED?
Protocol admin: TRUSTED

___

### Q: Are there any additional protocol roles? If yes, please explain in detail:
Markets have Coordinators which can update parameters for that specific market - these coordinators have a large amount of flexibility within their own market but should not be able to adversely affect other markets or the overall protocol.
___

### Q: Is the code/contract expected to comply with any EIPs? Are there specific assumptions around adhering to those EIPs that Watsons should be aware of?
No


___

### Q: Please list any known issues/acceptable risks that should not result in a valid finding.
As stated above - market coordinators can do many things within their markets which could adversely affect user funds within those markets. However, they should not be able to affect other markets

Flywheel being down due to external downtime - sequencer downtime does not have special case handling. Perennial also does not provide grace periods for users to cure their positions when these systems do come back up
___

### Q: Please provide links to previous audits (if any).
https://github.com/equilibria-xyz/perennial-v2/tree/main/audits


___

### Q: Are there any off-chain mechanisms or off-chain procedures for the protocol (keeper bots, input validation expectations, etc)?
Yes - there are keepers for oracle updates + settlements, liquidations, and order types


___

### Q: In case of external protocol integrations, are the risks of external contracts pausing or executing an emergency withdrawal acceptable? If not, Watsons will submit issues related to these situations that can harm your protocol's functionality.
We want to be aware of issues that might arise from oracle or DSU integrations


___

### Q: Do you expect to use any of the following tokens with non-standard behaviour with the smart contracts?
USDC


___

### Q: Add links to relevant protocol resources
Migration Guide: https://github.com/equilibria-xyz/perennial-v2/blob/22ba19c323a13c9f02f95db6747d137a3bf1277a/runbooks/MIGRATION_v2.2.md

V2 Docs: https://docs.perennial.finance/

V2 Mechanism 1-pager: https://docs.google.com/document/d/1f-V_byFYkJdJAHMXxN2NiiDqysYhoqKzZXteee8BuIQ/edit
___



# Audit scope


[perennial-v2 @ 22ba19c323a13c9f02f95db6747d137a3bf1277a](https://github.com/equilibria-xyz/perennial-v2/tree/22ba19c323a13c9f02f95db6747d137a3bf1277a)
- [perennial-v2/packages/perennial-extensions/contracts/Coordinator.sol](perennial-v2/packages/perennial-extensions/contracts/Coordinator.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Arbitrum.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Arbitrum.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Optimism.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Optimism.sol)
- [perennial-v2/packages/perennial-extensions/contracts/types/InterfaceFee.sol](perennial-v2/packages/perennial-extensions/contracts/types/InterfaceFee.sol)
- [perennial-v2/packages/perennial-extensions/contracts/types/TriggerOrder.sol](perennial-v2/packages/perennial-extensions/contracts/types/TriggerOrder.sol)
- [perennial-v2/packages/perennial-oracle/contracts/Oracle.sol](perennial-v2/packages/perennial-oracle/contracts/Oracle.sol)
- [perennial-v2/packages/perennial-oracle/contracts/OracleFactory.sol](perennial-v2/packages/perennial-oracle/contracts/OracleFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Optimism.sol)
- [perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol](perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol](perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Optimism.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Optimism.sol)
- [perennial-v2/packages/perennial-vault/contracts/Vault.sol](perennial-v2/packages/perennial-vault/contracts/Vault.sol)
- [perennial-v2/packages/perennial-vault/contracts/VaultFactory.sol](perennial-v2/packages/perennial-vault/contracts/VaultFactory.sol)
- [perennial-v2/packages/perennial-vault/contracts/lib/StrategyLib.sol](perennial-v2/packages/perennial-vault/contracts/lib/StrategyLib.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Account.sol](perennial-v2/packages/perennial-vault/contracts/types/Account.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Checkpoint.sol](perennial-v2/packages/perennial-vault/contracts/types/Checkpoint.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Registration.sol](perennial-v2/packages/perennial-vault/contracts/types/Registration.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/VaultParameter.sol](perennial-v2/packages/perennial-vault/contracts/types/VaultParameter.sol)
- [perennial-v2/packages/perennial/contracts/Market.sol](perennial-v2/packages/perennial/contracts/Market.sol)
- [perennial-v2/packages/perennial/contracts/MarketFactory.sol](perennial-v2/packages/perennial/contracts/MarketFactory.sol)
- [perennial-v2/packages/perennial/contracts/libs/CheckpointLib.sol](perennial-v2/packages/perennial/contracts/libs/CheckpointLib.sol)
- [perennial-v2/packages/perennial/contracts/libs/InvariantLib.sol](perennial-v2/packages/perennial/contracts/libs/InvariantLib.sol)
- [perennial-v2/packages/perennial/contracts/libs/VersionLib.sol](perennial-v2/packages/perennial/contracts/libs/VersionLib.sol)
- [perennial-v2/packages/perennial/contracts/types/Checkpoint.sol](perennial-v2/packages/perennial/contracts/types/Checkpoint.sol)
- [perennial-v2/packages/perennial/contracts/types/Global.sol](perennial-v2/packages/perennial/contracts/types/Global.sol)
- [perennial-v2/packages/perennial/contracts/types/Local.sol](perennial-v2/packages/perennial/contracts/types/Local.sol)
- [perennial-v2/packages/perennial/contracts/types/MarketParameter.sol](perennial-v2/packages/perennial/contracts/types/MarketParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/OracleVersion.sol](perennial-v2/packages/perennial/contracts/types/OracleVersion.sol)
- [perennial-v2/packages/perennial/contracts/types/Order.sol](perennial-v2/packages/perennial/contracts/types/Order.sol)
- [perennial-v2/packages/perennial/contracts/types/Position.sol](perennial-v2/packages/perennial/contracts/types/Position.sol)
- [perennial-v2/packages/perennial/contracts/types/ProtocolParameter.sol](perennial-v2/packages/perennial/contracts/types/ProtocolParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/RiskParameter.sol](perennial-v2/packages/perennial/contracts/types/RiskParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/Version.sol](perennial-v2/packages/perennial/contracts/types/Version.sol)

[root @ 8faa77e920c23b67f12942ec61b2580f0533d161](https://github.com/equilibria-xyz/root/tree/8faa77e920c23b67f12942ec61b2580f0533d161)
- [root/contracts/access/ProxyOwner.sol](root/contracts/access/ProxyOwner.sol)
- [root/contracts/adiabatic/AdiabaticMath6.sol](root/contracts/adiabatic/AdiabaticMath6.sol)
- [root/contracts/adiabatic/types/InverseAdiabatic6.sol](root/contracts/adiabatic/types/InverseAdiabatic6.sol)
- [root/contracts/adiabatic/types/LinearAdiabatic6.sol](root/contracts/adiabatic/types/LinearAdiabatic6.sol)
- [root/contracts/attribute/Kept/Kept.sol](root/contracts/attribute/Kept/Kept.sol)
- [root/contracts/attribute/Kept/Kept_Arbitrum.sol](root/contracts/attribute/Kept/Kept_Arbitrum.sol)
- [root/contracts/attribute/Kept/Kept_Optimism.sol](root/contracts/attribute/Kept/Kept_Optimism.sol)
- [root/contracts/number/types/UFixed18.sol](root/contracts/number/types/UFixed18.sol)
- [root/contracts/number/types/UFixed6.sol](root/contracts/number/types/UFixed6.sol)
- [root/contracts/pid/types/PController6.sol](root/contracts/pid/types/PController6.sol)

[emptyset-mono @ ab24b00bff3d9a3416e036ccb1cad09dfe3f005a](https://github.com/equilibria-xyz/emptyset-mono/tree/ab24b00bff3d9a3416e036ccb1cad09dfe3f005a)
- [emptyset-mono/packages/emptyset-reserve/contracts/reserve/MigrationReserve.sol](emptyset-mono/packages/emptyset-reserve/contracts/reserve/MigrationReserve.sol)




[perennial-v2 @ 22ba19c323a13c9f02f95db6747d137a3bf1277a](https://github.com/equilibria-xyz/perennial-v2/tree/22ba19c323a13c9f02f95db6747d137a3bf1277a)
- [perennial-v2/packages/perennial-extensions/contracts/Coordinator.sol](perennial-v2/packages/perennial-extensions/contracts/Coordinator.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Arbitrum.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Arbitrum.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Optimism.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Optimism.sol)
- [perennial-v2/packages/perennial-extensions/contracts/types/InterfaceFee.sol](perennial-v2/packages/perennial-extensions/contracts/types/InterfaceFee.sol)
- [perennial-v2/packages/perennial-extensions/contracts/types/TriggerOrder.sol](perennial-v2/packages/perennial-extensions/contracts/types/TriggerOrder.sol)
- [perennial-v2/packages/perennial-oracle/contracts/Oracle.sol](perennial-v2/packages/perennial-oracle/contracts/Oracle.sol)
- [perennial-v2/packages/perennial-oracle/contracts/OracleFactory.sol](perennial-v2/packages/perennial-oracle/contracts/OracleFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Optimism.sol)
- [perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol](perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol](perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Optimism.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Optimism.sol)
- [perennial-v2/packages/perennial-vault/contracts/Vault.sol](perennial-v2/packages/perennial-vault/contracts/Vault.sol)
- [perennial-v2/packages/perennial-vault/contracts/VaultFactory.sol](perennial-v2/packages/perennial-vault/contracts/VaultFactory.sol)
- [perennial-v2/packages/perennial-vault/contracts/lib/StrategyLib.sol](perennial-v2/packages/perennial-vault/contracts/lib/StrategyLib.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Account.sol](perennial-v2/packages/perennial-vault/contracts/types/Account.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Checkpoint.sol](perennial-v2/packages/perennial-vault/contracts/types/Checkpoint.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Registration.sol](perennial-v2/packages/perennial-vault/contracts/types/Registration.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/VaultParameter.sol](perennial-v2/packages/perennial-vault/contracts/types/VaultParameter.sol)
- [perennial-v2/packages/perennial/contracts/Market.sol](perennial-v2/packages/perennial/contracts/Market.sol)
- [perennial-v2/packages/perennial/contracts/MarketFactory.sol](perennial-v2/packages/perennial/contracts/MarketFactory.sol)
- [perennial-v2/packages/perennial/contracts/libs/CheckpointLib.sol](perennial-v2/packages/perennial/contracts/libs/CheckpointLib.sol)
- [perennial-v2/packages/perennial/contracts/libs/InvariantLib.sol](perennial-v2/packages/perennial/contracts/libs/InvariantLib.sol)
- [perennial-v2/packages/perennial/contracts/libs/VersionLib.sol](perennial-v2/packages/perennial/contracts/libs/VersionLib.sol)
- [perennial-v2/packages/perennial/contracts/types/Checkpoint.sol](perennial-v2/packages/perennial/contracts/types/Checkpoint.sol)
- [perennial-v2/packages/perennial/contracts/types/Global.sol](perennial-v2/packages/perennial/contracts/types/Global.sol)
- [perennial-v2/packages/perennial/contracts/types/Local.sol](perennial-v2/packages/perennial/contracts/types/Local.sol)
- [perennial-v2/packages/perennial/contracts/types/MarketParameter.sol](perennial-v2/packages/perennial/contracts/types/MarketParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/OracleVersion.sol](perennial-v2/packages/perennial/contracts/types/OracleVersion.sol)
- [perennial-v2/packages/perennial/contracts/types/Order.sol](perennial-v2/packages/perennial/contracts/types/Order.sol)
- [perennial-v2/packages/perennial/contracts/types/Position.sol](perennial-v2/packages/perennial/contracts/types/Position.sol)
- [perennial-v2/packages/perennial/contracts/types/ProtocolParameter.sol](perennial-v2/packages/perennial/contracts/types/ProtocolParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/RiskParameter.sol](perennial-v2/packages/perennial/contracts/types/RiskParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/Version.sol](perennial-v2/packages/perennial/contracts/types/Version.sol)

[root @ 8faa77e920c23b67f12942ec61b2580f0533d161](https://github.com/equilibria-xyz/root/tree/8faa77e920c23b67f12942ec61b2580f0533d161)
- [root/contracts/access/ProxyOwner.sol](root/contracts/access/ProxyOwner.sol)
- [root/contracts/adiabatic/AdiabaticMath6.sol](root/contracts/adiabatic/AdiabaticMath6.sol)
- [root/contracts/adiabatic/types/InverseAdiabatic6.sol](root/contracts/adiabatic/types/InverseAdiabatic6.sol)
- [root/contracts/adiabatic/types/LinearAdiabatic6.sol](root/contracts/adiabatic/types/LinearAdiabatic6.sol)
- [root/contracts/attribute/Kept/Kept.sol](root/contracts/attribute/Kept/Kept.sol)
- [root/contracts/attribute/Kept/Kept_Arbitrum.sol](root/contracts/attribute/Kept/Kept_Arbitrum.sol)
- [root/contracts/attribute/Kept/Kept_Optimism.sol](root/contracts/attribute/Kept/Kept_Optimism.sol)
- [root/contracts/number/types/UFixed18.sol](root/contracts/number/types/UFixed18.sol)
- [root/contracts/number/types/UFixed6.sol](root/contracts/number/types/UFixed6.sol)
- [root/contracts/pid/types/PController6.sol](root/contracts/pid/types/PController6.sol)




[perennial-v2 @ 22ba19c323a13c9f02f95db6747d137a3bf1277a](https://github.com/equilibria-xyz/perennial-v2/tree/22ba19c323a13c9f02f95db6747d137a3bf1277a)
- [perennial-v2/packages/perennial-extensions/contracts/Coordinator.sol](perennial-v2/packages/perennial-extensions/contracts/Coordinator.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Arbitrum.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Arbitrum.sol)
- [perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Optimism.sol](perennial-v2/packages/perennial-extensions/contracts/MultiInvoker_Optimism.sol)
- [perennial-v2/packages/perennial-extensions/contracts/types/InterfaceFee.sol](perennial-v2/packages/perennial-extensions/contracts/types/InterfaceFee.sol)
- [perennial-v2/packages/perennial-extensions/contracts/types/TriggerOrder.sol](perennial-v2/packages/perennial-extensions/contracts/types/TriggerOrder.sol)
- [perennial-v2/packages/perennial-oracle/contracts/Oracle.sol](perennial-v2/packages/perennial-oracle/contracts/Oracle.sol)
- [perennial-v2/packages/perennial-oracle/contracts/OracleFactory.sol](perennial-v2/packages/perennial-oracle/contracts/OracleFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/chainlink/ChainlinkFactory_Optimism.sol)
- [perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol](perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol](perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/metaquants/MetaQuantsFactory_Optimism.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Arbitrum.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Arbitrum.sol)
- [perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Optimism.sol](perennial-v2/packages/perennial-oracle/contracts/pyth/PythFactory_Optimism.sol)
- [perennial-v2/packages/perennial-vault/contracts/Vault.sol](perennial-v2/packages/perennial-vault/contracts/Vault.sol)
- [perennial-v2/packages/perennial-vault/contracts/VaultFactory.sol](perennial-v2/packages/perennial-vault/contracts/VaultFactory.sol)
- [perennial-v2/packages/perennial-vault/contracts/lib/StrategyLib.sol](perennial-v2/packages/perennial-vault/contracts/lib/StrategyLib.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Account.sol](perennial-v2/packages/perennial-vault/contracts/types/Account.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Checkpoint.sol](perennial-v2/packages/perennial-vault/contracts/types/Checkpoint.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/Registration.sol](perennial-v2/packages/perennial-vault/contracts/types/Registration.sol)
- [perennial-v2/packages/perennial-vault/contracts/types/VaultParameter.sol](perennial-v2/packages/perennial-vault/contracts/types/VaultParameter.sol)
- [perennial-v2/packages/perennial/contracts/Market.sol](perennial-v2/packages/perennial/contracts/Market.sol)
- [perennial-v2/packages/perennial/contracts/MarketFactory.sol](perennial-v2/packages/perennial/contracts/MarketFactory.sol)
- [perennial-v2/packages/perennial/contracts/libs/CheckpointLib.sol](perennial-v2/packages/perennial/contracts/libs/CheckpointLib.sol)
- [perennial-v2/packages/perennial/contracts/libs/InvariantLib.sol](perennial-v2/packages/perennial/contracts/libs/InvariantLib.sol)
- [perennial-v2/packages/perennial/contracts/libs/VersionLib.sol](perennial-v2/packages/perennial/contracts/libs/VersionLib.sol)
- [perennial-v2/packages/perennial/contracts/types/Checkpoint.sol](perennial-v2/packages/perennial/contracts/types/Checkpoint.sol)
- [perennial-v2/packages/perennial/contracts/types/Global.sol](perennial-v2/packages/perennial/contracts/types/Global.sol)
- [perennial-v2/packages/perennial/contracts/types/Local.sol](perennial-v2/packages/perennial/contracts/types/Local.sol)
- [perennial-v2/packages/perennial/contracts/types/MarketParameter.sol](perennial-v2/packages/perennial/contracts/types/MarketParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/OracleVersion.sol](perennial-v2/packages/perennial/contracts/types/OracleVersion.sol)
- [perennial-v2/packages/perennial/contracts/types/Order.sol](perennial-v2/packages/perennial/contracts/types/Order.sol)
- [perennial-v2/packages/perennial/contracts/types/Position.sol](perennial-v2/packages/perennial/contracts/types/Position.sol)
- [perennial-v2/packages/perennial/contracts/types/ProtocolParameter.sol](perennial-v2/packages/perennial/contracts/types/ProtocolParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/RiskParameter.sol](perennial-v2/packages/perennial/contracts/types/RiskParameter.sol)
- [perennial-v2/packages/perennial/contracts/types/Version.sol](perennial-v2/packages/perennial/contracts/types/Version.sol)


