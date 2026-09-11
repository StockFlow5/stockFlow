// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract MockPriceFeed {
    uint8 public constant decimals = 8;
    int256 public price;

    function setPrice(int256 _price) external {
        price = _price;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, price, 0, block.timestamp, 0);
    }
}
