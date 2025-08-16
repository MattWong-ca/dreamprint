// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PYUSDPayment is Ownable {
    IERC20 public pyusd;
    uint256 public constant MINIMUM_PRICE = 1_000_000; // 1 PYUSD minimum (6 decimals)

    event Paid(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(address _pyusdAddress) Ownable(0xB68918211aD90462FbCf75b77a30bF76515422CE) {
        require(_pyusdAddress != address(0), "Invalid PYUSD address");
        pyusd = IERC20(_pyusdAddress);
    }

    /// @notice User pays PYUSD into this contract (minimum 1 PYUSD)
    function pay(uint256 amount) external {
        require(amount >= MINIMUM_PRICE, "Amount must be at least 1 PYUSD");
        bool success = pyusd.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");
        emit Paid(msg.sender, amount);
    }

    /// @notice Owner withdraws PYUSD from this contract
    function withdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        bool success = pyusd.transfer(msg.sender, amount);
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Check how much PYUSD is in the contract
    function balanceOfContract() external view returns (uint256) {
        return pyusd.balanceOf(address(this));
    }
}
