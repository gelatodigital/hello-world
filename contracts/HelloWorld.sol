// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Proxied} from "./vendor/hardhat-deploy/Proxied.sol";
import {
    AddressUpgradeable
} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

contract HelloWorld is Proxied {
    // Best practice to always use Upgradeable pkg for Proxies
    using AddressUpgradeable for address payable;

    address public immutable gelato;

    uint256 public interval;
    uint256 public lastCallTime;

    event LogHelloWorld();

    modifier onlyGelato() {
        require(msg.sender == gelato, "HelloWorld::onlyGelato");
        _;
    }

    constructor(address payable _gelato) {
        gelato = _gelato;
    }

    function setInterval(uint256 _interval) external onlyProxyAdmin {
        interval = _interval;
    }

    function helloWorld(uint256 _paymentAmount) external onlyGelato {
        require(canExec(), "helloWorld: not canExec");

        lastCallTime = block.timestamp; // solhint-disable-line

        payable(gelato).sendValue(_paymentAmount);

        emit LogHelloWorld();
    }

    function canExec() public view returns (bool) {
        if (lastCallTime == 0) return true;
        return lastCallTime + interval <= block.timestamp; // solhint-disable-line
    }
}
