// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./sUSD.sol";

contract PSM is Ownable {
    using SafeERC20 for IERC20;

    sUSD public susd;
    mapping(address => bool) public reserves;

    event Minted(address indexed user, address indexed reserve, uint256 amount, uint256 susdOut);
    event Redeemed(address indexed user, address indexed reserve, uint256 susdAmount, uint256 reserveOut);

    constructor(address _susd) Ownable(msg.sender) {
        susd = sUSD(_susd);
    }

    function addReserve(address reserve) external onlyOwner {
        reserves[reserve] = true;
    }

    function removeReserve(address reserve) external onlyOwner {
        reserves[reserve] = false;
    }

    function mint(address reserve, uint256 amount) external {
        require(reserves[reserve], "PSM: reserve not allowed");
        require(amount > 0, "PSM: zero amount");
        IERC20(reserve).safeTransferFrom(msg.sender, address(this), amount);
        susd.mint(msg.sender, amount);
        emit Minted(msg.sender, reserve, amount, amount);
    }

    function redeem(address reserve, uint256 susdAmount) external {
        require(reserves[reserve], "PSM: reserve not allowed");
        require(susdAmount > 0, "PSM: zero amount");
        uint256 reserveBalance = IERC20(reserve).balanceOf(address(this));
        require(reserveBalance >= susdAmount, "PSM: insufficient reserve");
        susd.burnFrom(msg.sender, susdAmount);
        IERC20(reserve).safeTransfer(msg.sender, susdAmount);
        emit Redeemed(msg.sender, reserve, susdAmount, susdAmount);
    }
}
