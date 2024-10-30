/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'

const deployFn: DeployFunction = async (hre) => {

    const signer = (await ethers.getSigners())[0]
    const lzEndpointAddress = '0x6EDCE65403992e310A62460808c4b910D972f10f';
    const lzEndpointABI = [
        'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
    ];

    const lzEndpointContract = new ethers.Contract(lzEndpointAddress, lzEndpointABI, signer);
    // Define the addresses and parameters
    const sepLorenzoOFTaddress = "0xF0b7c988f1d5F993C9AEa1Ee23F220791f23b645"
    const bscLorenzoOFTAddress = "0xC50bfC71BF0bB90E316a3F21CC51826c8FaB192d"
    
    const sepSendLibAddress = '0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE';
    const sepReceiveLibAddress = '0xdAf00F5eE2158dD58E0d3857851c432E34A3A851';
    const bscTestnetSendLibAddress = '0x55f16c442907e86D764AFdc2a07C2de3BdAc8BB7'
    const bscTestnetReceiveLibAddress = '0x188d4bbCeD671A7aA2b5055937F79510A32e9683'
    const sepEid = 40161; // ethereum sep Chain
    const bscTestEid = 40102 // BSC testnet Chain

    let oappAddress
    let sendLibAddress
    let remoteEid
    let receiveLibAddress
    const chainid = await hre.getChainId()
    if (chainid.toString() == "11155111") {
        oappAddress = sepLorenzoOFTaddress
        sendLibAddress = sepSendLibAddress
        remoteEid = bscTestEid
        receiveLibAddress = sepReceiveLibAddress
    } else {
        oappAddress = bscLorenzoOFTAddress
        sendLibAddress = bscTestnetSendLibAddress
        remoteEid = sepEid
        receiveLibAddress = bscTestnetReceiveLibAddress
    }

    const ulnConfig = {
        confirmations: 0, // Example value, replace with actual
        requiredDVNCount: 0, // Example value, replace with actual
        optionalDVNCount: 0, // Example value, replace with actual
        optionalDVNThreshold: 0, // Example value, replace with actual
        requiredDVNs: [], // Replace with actual addresses
        optionalDVNs: [], // Replace with actual addresses
    };
    const executorAddress1 = '0x0000000000000000000000000000000000000000';
    const executorConfig = {
        maxMessageSize: 0, // Example value, replace with actual
        executorAddress: executorAddress1, // Replace with the actual executor address
    };

    // Encode UlnConfig using defaultAbiCoder
    const configTypeUlnStruct =
    'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';
    const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([configTypeUlnStruct], [ulnConfig]);

    // Encode ExecutorConfig using defaultAbiCoder
    const configTypeExecutorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)';
    const encodedExecutorConfig = ethers.utils.defaultAbiCoder.encode(
        [configTypeExecutorStruct],
        [executorConfig],
    );

    // Define the SetConfigParam structs
    const setConfigParamUln = {
        eid: remoteEid,
        configType: 2, // ULN_CONFIG_TYPE
        config: encodedUlnConfig,
    };

    const setConfigParamExecutor = {
        eid: remoteEid,
        configType: 1, // EXECUTOR_CONFIG_TYPE
        config: encodedExecutorConfig,
    };
    const tx = await lzEndpointContract.setConfig(
        oappAddress,
        sendLibAddress,
        [setConfigParamUln, setConfigParamExecutor], // Array of SetConfigParam structs
    );
    const receipt = await tx.wait();
    console.log('Reset Send Library ULN Config Transaction confirmed:', receipt.transactionHash);

    const receiveUlnConfig = {
        confirmations: 0, // Example value, replace with actual
        requiredDVNCount: 0, // Example value, replace with actual
        optionalDVNCount: 0, // Example value, replace with actual
        optionalDVNThreshold: 0, // Example value, replace with actual
        requiredDVNs: [], // Replace with actual addresses
        optionalDVNs: [], // Replace with actual addresses
    };
    const receiveEncodedUlnConfig = ethers.utils.defaultAbiCoder.encode([configTypeUlnStruct], [receiveUlnConfig]);
    const setReceiveConfigParam = {
        eid: remoteEid,
        configType: 2, // RECEIVE_CONFIG_TYPE
        config: receiveEncodedUlnConfig,
    };
    const tx1 = await lzEndpointContract.setConfig(
        oappAddress,
        receiveLibAddress,
        [setReceiveConfigParam], // This should be an array of SetConfigParam structs
    );

    const receipt1 = await tx1.wait();
    console.log('Reset Receive Library ULN Config Transaction confirmed:', receipt1.transactionHash);
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['ResetLZConfig']

export default deployFn