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
    // const sepExecutorAddress = '0x718B92b5CB0a5552039B593faF724D182A881eDA'
    // const bscTestnetExecutorAddress = '0x31894b190a8bAbd9A067Ce59fde0BfCFD2B18470'
    const sepEid = 40161; // ethereum sep Chain
    const bscTestEid = 40102 // BSC testnet Chain

    let oappAddress
    let sendLibAddress
    let remoteEid
    let receiveLibAddress
    let dvnAddress1
    let dvnAddress2
    const chainid = await hre.getChainId()
    if (chainid.toString() == "11155111") {
        oappAddress = sepLorenzoOFTaddress
        sendLibAddress = sepSendLibAddress
        remoteEid = bscTestEid
        receiveLibAddress = sepReceiveLibAddress
        dvnAddress1 = '0x8eebf8b423b73bfca51a1db4b7354aa0bfca9193'
        dvnAddress2 = '0xca7a736be0fe968a33af62033b8b36d491f7999b'
    } else {
        oappAddress = bscLorenzoOFTAddress
        sendLibAddress = bscTestnetSendLibAddress
        remoteEid = sepEid
        receiveLibAddress = bscTestnetReceiveLibAddress
        dvnAddress1 = '0x0ee552262f7b562efced6dd4a7e2878ab897d405'
        dvnAddress2 = '0x35fa068ec18631719a7f6253710ba29ab5c5f3b7'
    }

    const ulnConfig = {
        confirmations: 0, // Example value, replace with actual
        requiredDVNCount: 2, // Example value, replace with actual
        optionalDVNCount: 0, // Example value, replace with actual
        optionalDVNThreshold: 0, // Example value, replace with actual
        requiredDVNs: [dvnAddress1, dvnAddress2], // Replace with actual addresses
        optionalDVNs: [], // Replace with actual addresses
    };

    // Encode UlnConfig using defaultAbiCoder
    const configTypeUlnStruct =
    'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';
    const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([configTypeUlnStruct], [ulnConfig]);

    // Define the SetConfigParam structs
    const setConfigParamUln = {
        eid: remoteEid,
        configType: 2, // ULN_CONFIG_TYPE
        config: encodedUlnConfig,
    };

    const tx = await lzEndpointContract.setConfig(
        oappAddress,
        sendLibAddress,
        [setConfigParamUln], // Array of SetConfigParam structs
    );
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Send Library ULN Config Transaction confirmed:', receipt.transactionHash);

    const receiveUlnConfig = {
        confirmations: 0, // Example value, replace with actual
        requiredDVNCount: 2, // Example value, replace with actual
        optionalDVNCount: 0, // Example value, replace with actual
        optionalDVNThreshold: 0, // Example value, replace with actual
        requiredDVNs: [dvnAddress1, dvnAddress2], // Replace with actual addresses
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
    console.log('Receive Library ULN Config Transaction confirmed:', receipt1.transactionHash);
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['SetLZConfig']

export default deployFn