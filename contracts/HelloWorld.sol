//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Gelatofied} from "./gelato/Gelatofied.sol";

contract HelloWorld is Ownable, Gelatofied {
    uint256 public interval;
    uint256 public lastCallTime;

    event LogHelloWorld();

    // solhint-disable-next-line no-empty-blocks
    constructor(address payable _gelato) Gelatofied(_gelato) {}

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    function setInterval(uint256 _interval) external onlyOwner {
        interval = _interval;
    }

    function helloWorld(uint256 _paymentAmount)
        external
        gelatofy(_paymentAmount, Gelatofied.ETH)
    {
        require(canExec(), "helloWorld: not canExec");
        lastCallTime = block.timestamp; // solhint-disable-line
        emit LogHelloWorld();
    }

    function canExec() public view returns (bool) {
        if (lastCallTime == 0) return true;
        return lastCallTime + interval <= block.timestamp; // solhint-disable-line
    }
}
