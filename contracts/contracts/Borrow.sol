// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./sUSD.sol";
import "./MockPriceFeed.sol";

contract Borrow is Ownable {
    using SafeERC20 for IERC20;

    sUSD public susd;

    struct AssetParams {
        bool allowed;
        uint256 maxLTV;       // basis points, e.g. 7000 = 70%
        uint256 liqThreshold; // basis points, e.g. 8000 = 80%
    }

    // Keep a list of allowed assets for iteration
    address[] public allowedAssets;
    mapping(address => AssetParams) public assetParams;
    mapping(address => address) public priceFeeds;
    mapping(address => mapping(address => uint256)) public collateral;
    mapping(address => uint256) public debt;

    event CollateralDeposited(address indexed user, address indexed asset, uint256 amount);
    event CollateralWithdrawn(address indexed user, address indexed asset, uint256 amount);
    event StableMinted(address indexed user, uint256 amount);
    event DebtRepaid(address indexed user, uint256 amount);

    constructor(address _susd) Ownable(msg.sender) {
        susd = sUSD(_susd);
    }

    function setAsset(
        address asset,
        uint256 maxLTV,
        uint256 liqThreshold,
        address feed
    ) external onlyOwner {
        require(maxLTV <= 10000 && liqThreshold <= 10000, "Borrow: invalid ratio");
        if (!assetParams[asset].allowed) {
            allowedAssets.push(asset);
        }
        assetParams[asset] = AssetParams({
            allowed: true,
            maxLTV: maxLTV,
            liqThreshold: liqThreshold
        });
        priceFeeds[asset] = feed;
    }

    function getAssetPrice(address asset) public view returns (uint256) {
        address feed = priceFeeds[asset];
        require(feed != address(0), "Borrow: no feed");
        (, int256 price,,,) = MockPriceFeed(feed).latestRoundData();
        require(price > 0, "Borrow: invalid price");
        return uint256(price); // 8 decimals
    }

    function getCollateralValue(address user) public view returns (uint256 totalValue) {
        // Collateral tokens are assumed 18 decimals, price is 8 decimals.
        for (uint256 i = 0; i < allowedAssets.length; i++) {
            address asset = allowedAssets[i];
            uint256 amount = collateral[user][asset];
            if (amount == 0) continue;
            uint256 price = getAssetPrice(asset);
            totalValue += (amount * price) / 1e8;
        }
    }

    function getMaxDebt(address user) public view returns (uint256 maxDebt) {
        for (uint256 i = 0; i < allowedAssets.length; i++) {
            address asset = allowedAssets[i];
            uint256 amount = collateral[user][asset];
            if (amount == 0) continue;
            uint256 price = getAssetPrice(asset);
            uint256 value = (amount * price) / 1e8;
            AssetParams memory p = assetParams[asset];
            maxDebt += (value * p.maxLTV) / 10000;
        }
    }

    function healthFactor(address user) public view returns (uint256) {
        uint256 d = debt[user];
        if (d == 0) return type(uint256).max;
        uint256 safeCollateral = getSafeCollateralValue(user);
        return (safeCollateral * 1e18) / d;
    }

    function getSafeCollateralValue(address user) public view returns (uint256 safeValue) {
        for (uint256 i = 0; i < allowedAssets.length; i++) {
            address asset = allowedAssets[i];
            uint256 amount = collateral[user][asset];
            if (amount == 0) continue;
            uint256 price = getAssetPrice(asset);
            uint256 value = (amount * price) / 1e8;
            AssetParams memory p = assetParams[asset];
            safeValue += (value * p.liqThreshold) / 10000;
        }
    }

    function isHealthy(address user) public view returns (bool) {
        uint256 d = debt[user];
        if (d == 0) return true;
        return healthFactor(user) >= 1e18;
    }

    function depositCollateral(address asset, uint256 amount) external {
        require(assetParams[asset].allowed, "Borrow: asset not allowed");
        require(amount > 0, "Borrow: zero amount");
        collateral[msg.sender][asset] += amount;
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        emit CollateralDeposited(msg.sender, asset, amount);
    }

    function withdrawCollateral(address asset, uint256 amount) external {
        require(collateral[msg.sender][asset] >= amount, "Borrow: insufficient collateral");
        collateral[msg.sender][asset] -= amount;
        require(isHealthy(msg.sender), "Borrow: would become unhealthy");
        IERC20(asset).safeTransfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, asset, amount);
    }

    function mintStable(uint256 amount) external {
        require(amount > 0, "Borrow: zero amount");
        debt[msg.sender] += amount;
        require(debt[msg.sender] <= getMaxDebt(msg.sender), "Borrow: exceeds LTV");
        susd.mint(msg.sender, amount);
        emit StableMinted(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        require(amount > 0, "Borrow: zero amount");
        uint256 repayAmount = amount > debt[msg.sender] ? debt[msg.sender] : amount;
        debt[msg.sender] -= repayAmount;
        susd.burnFrom(msg.sender, repayAmount);
        emit DebtRepaid(msg.sender, repayAmount);
    }
}
