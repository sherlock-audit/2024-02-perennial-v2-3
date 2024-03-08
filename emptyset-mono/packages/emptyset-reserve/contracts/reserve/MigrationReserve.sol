// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.17;

import "@equilibria/root/number/types/UFixed18.sol";
import "../interfaces/IMigrationReserve.sol";
import "./SimpleReserve.sol";

contract MigrationReserve is IMigrationReserve, SimpleReserve {
    Token6 public immutable USDC_BRIDGED; // solhint-disable-line var-name-mixedcase

    constructor(Token18 dsu_, Token6 usdc_, Token6 usdcBridged_) SimpleReserve(dsu_, usdc_) {
        USDC_BRIDGED = usdcBridged_;
    }

    function migrate(UFixed18 amount) external {
        USDC.pull(msg.sender, amount);
        USDC_BRIDGED.push(msg.sender, amount);

        emit Migrate(msg.sender, amount);
    }
}
