//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract Greeter {
    string private _greeting;

    constructor(string memory __greeting) {
        _greeting = __greeting;
    }

    function setGreeting(string memory __greeting) public {
        _greeting = __greeting;
    }

    function greet() public view returns (string memory) {
        return _greeting;
    }
}
