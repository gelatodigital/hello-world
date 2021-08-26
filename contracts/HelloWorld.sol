//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Gelatofied} from "./gelato/Gelatofied.sol";
import {console} from "hardhat/console.sol";

contract HelloWorld is Ownable, Gelatofied {
    uint256 public interval;
    uint256 public lastCallTime;

    event LogHelloWorld();

    constructor(address payable _gelato) Gelatofied(_gelato) {
        lastCallTime = block.timestamp; // solhint-disable-line
    }

    function setInterval(uint256 _interval) external onlyOwner {
        interval = _interval;
    }

    function helloWorld(uint256 _paymentAmount)
        external
        payable
        gelatofy(_paymentAmount, Gelatofied.ETH)
    {
        require(canExec(), "helloWorld: not canExec");
        console.log("%d", _paymentAmount);
        lastCallTime = block.timestamp; // solhint-disable-line
        emit LogHelloWorld();
    }

    function canExec() public view returns (bool) {
        return (lastCallTime + interval) <= block.timestamp; // solhint-disable-line
    }
}
