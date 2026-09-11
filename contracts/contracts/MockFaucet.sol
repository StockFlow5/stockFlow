// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./MockERC20.sol";

contract MockFaucet {
    mapping(address => uint256) public lastDrip;
    uint256 public constant COOLDOWN = 1 hours;

    MockERC20[] public tokens;

    event Dripped(address indexed user);

    constructor(MockERC20[] memory _tokens) {
        for (uint256 i = 0; i < _tokens.length; i++) {
            tokens.push(_tokens[i]);
        }
    }

    function drip() external {
        require(block.timestamp >= lastDrip[msg.sender] + COOLDOWN, "Faucet: cooldown");
        lastDrip[msg.sender] = block.timestamp;
        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i].mint(msg.sender, 10_000 * 10 ** tokens[i].decimals());
        }
        emit Dripped(msg.sender);
    }
}
