/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { Options } from '@layerzerolabs/lz-v2-utilities'

const deployFn: DeployFunction = async (hre) => {
    const signer = (await ethers.getSigners())[0]
    console.log(`Deploying from ${signer.address}`)

    const sepPeerId = 40161
    const sepLorenzoOFTaddress = "0xF0b7c988f1d5F993C9AEa1Ee23F220791f23b645"

    const bscTestnetPeerId = 40102
    const bscLorenzoOFTAddress = "0xC50bfC71BF0bB90E316a3F21CC51826c8FaB192d"

    const stBTCAddress = "0x2a45dE58552F2C5E0597d1FbB8eC83F7E2dDBa0D"
    const stBTCAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "inputs": [], "name": "InvaildAddress", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "InvalidMintor", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "_minter_contract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "receipt", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newMinterContract", "type": "address" }], "name": "setNewMinterContract", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
    const stBTCContract = new ethers.Contract(stBTCAddress, stBTCAbi, signer)
    const tx = await stBTCContract.connect(signer).approve(sepLorenzoOFTaddress, ethers.utils.parseEther('10000'))
    await tx.wait()
    console.log(`Approved ${sepLorenzoOFTaddress} to spend 10000 stBTC`)

    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
    const tokensToSend = ethers.utils.parseEther('0.12')
    const sendParam = [
        bscTestnetPeerId,
        ethers.utils.zeroPad(signer.address, 32),
        tokensToSend,
        tokensToSend,
        options,
        '0x',
        '0x',
    ]
    const lzMBAdapterContract = await ethers.getContractAt('LorenzoMintBurnOFTAdapter', sepLorenzoOFTaddress, signer)
    // Fetching the native fee for the token send operation
    const [nativeFee] = await lzMBAdapterContract.connect(signer).quoteSend(sendParam, false)
    console.log(`Native fee: ${nativeFee}`)

    //send tokens
    const ctx = await lzMBAdapterContract.send(sendParam, [nativeFee, 0], signer.address, { value: nativeFee })
    await ctx.wait()
    console.log(`Tokens sent to ${bscTestnetPeerId}`)
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['SendToken']

export default deployFn
