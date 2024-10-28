// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;
import {MintBurnOFTAdapter} from "./MintAndBurnAdapter.sol";
import {IMintableBurnable} from "./interfaces/IMintableBurnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LorenzoMintBurnOFTAdapter is MintBurnOFTAdapter {
    constructor(
        address _token,
        IMintableBurnable _minterBurner,
        address _lzEndpoint,
        address _delegate
    )
        MintBurnOFTAdapter(_token, _minterBurner, _lzEndpoint, _delegate)
        Ownable(_delegate)
    {}
}
