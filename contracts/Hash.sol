// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Hasher} from "maci-contracts/contracts/crypto/Hasher.sol";

contract Hash is Hasher {
    error PoseidonHashLibrariesNotLinked();

    constructor() {
        if (hash2([uint256(1), uint256(1)]) == 0)
            revert PoseidonHashLibrariesNotLinked();
    }

    function testPoseidonHash(
        uint256[2] memory values
    ) public returns (uint256 result) {
        result = hash2(values);
    }
}
