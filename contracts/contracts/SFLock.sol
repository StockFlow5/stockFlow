// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SFLock is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public sfToken;

    mapping(address => uint256) public locked;
    uint256 public totalLocked;

    event Locked(address indexed user, uint256 amount);
    event Unlocked(address indexed user, uint256 amount);

    constructor(address _sfToken) Ownable(msg.sender) {
        sfToken = IERC20(_sfToken);
    }

    function lock(uint256 amount) external {
        require(amount > 0, "SFLock: zero amount");
        locked[msg.sender] += amount;
        totalLocked += amount;
        sfToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Locked(msg.sender, amount);
    }

    function unlock(uint256 amount) external {
        require(locked[msg.sender] >= amount, "SFLock: insufficient locked");
        locked[msg.sender] -= amount;
        totalLocked -= amount;
        sfToken.safeTransfer(msg.sender, amount);
        emit Unlocked(msg.sender, amount);
    }

    function votingPower(address user) external view returns (uint256) {
        return locked[user];
    }
}
