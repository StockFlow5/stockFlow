// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./sUSD.sol";
import "./ssUSD.sol";

contract StakingVault is Ownable {
    using SafeERC20 for IERC20;

    sUSD public susd;
    ssUSD public shareToken;

    uint256 public totalDeposited;

    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event Withdrawn(address indexed user, uint256 shares, uint256 assets);

    constructor(address _susd, address _shareToken) Ownable(msg.sender) {
        susd = sUSD(_susd);
        shareToken = ssUSD(_shareToken);
    }

    function deposit(uint256 assets) external {
        require(assets > 0, "Vault: zero amount");
        totalDeposited += assets;
        IERC20(address(susd)).safeTransferFrom(msg.sender, address(this), assets);
        shareToken.mint(msg.sender, assets);
        emit Deposited(msg.sender, assets, assets);
    }

    function withdraw(uint256 shares) external {
        require(shares > 0, "Vault: zero amount");
        totalDeposited -= shares;
        shareToken.burnFrom(msg.sender, shares);
        IERC20(address(susd)).safeTransfer(msg.sender, shares);
        emit Withdrawn(msg.sender, shares, shares);
    }

    function rewardsOf(address) external pure returns (uint256) {
        // Testnet mock: rewards are not accrued on-chain.
        return 0;
    }
}
