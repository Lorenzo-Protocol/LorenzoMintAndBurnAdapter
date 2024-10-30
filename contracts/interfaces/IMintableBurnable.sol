// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

/// @title Interface for mintable and burnable tokens
interface IMintableBurnable {
    /**
     * @notice Mints tokens to a specified account
     * @param _to Address to which tokens will be minted
     * @param _amount Amount of tokens to be minted
     */
    function mint(address _to, uint256 _amount) external;
}
