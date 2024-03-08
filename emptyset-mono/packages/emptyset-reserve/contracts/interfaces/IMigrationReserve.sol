// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.13;

import "@equilibria/root/number/types/UFixed18.sol";
import "@equilibria/root/token/types/Token18.sol";
import "@equilibria/root/token/types/Token6.sol";
import "./IReserve.sol";

/**
 * @title IMigrationReserve
 * @notice Interface for the migration reserve
 */
interface IMigrationReserve is IReserve {
    event Migrate(address indexed account, UFixed18 amount);

    function migrate(UFixed18 amount) external;
}
