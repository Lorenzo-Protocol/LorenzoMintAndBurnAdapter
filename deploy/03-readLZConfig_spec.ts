/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'

const deployFn: DeployFunction = async (hre) => {

    const signer = (await ethers.getSigners())[0]
    const lzEndpointAddress = '0x6EDCE65403992e310A62460808c4b910D972f10f';
    const lzEndpointABI = [
        'function getConfig(address _oapp, address _lib, uint32 _eid, uint32 _configType) external view returns (bytes memory config)',
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

    const executorConfigType = 1; // 1 for executor
    const ulnConfigType = 2; // 2 for UlnConfig

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
    const sendExecutorConfigBytes = await lzEndpointContract.getConfig(
        oappAddress,
        sendLibAddress,
        remoteEid,
        executorConfigType,
    );
    const executorConfigAbi = ['tuple(uint32 maxMessageSize, address executorAddress)'];
    const executorConfigArray = ethers.utils.defaultAbiCoder.decode(
      executorConfigAbi,
      sendExecutorConfigBytes,
    );
    console.log('Send Library Executor Config:', executorConfigArray);

    const sendUlnConfigBytes = await lzEndpointContract.getConfig(
        oappAddress,
        sendLibAddress,
        remoteEid,
        ulnConfigType,
    );
    const ulnConfigStructType = [
        'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)',
    ];
    const sendUlnConfigArray = ethers.utils.defaultAbiCoder.decode(
        ulnConfigStructType,
        sendUlnConfigBytes,
    );
    console.log('Send Library ULN Config:', sendUlnConfigArray);

    const receiveUlnConfigBytes = await lzEndpointContract.getConfig(
        oappAddress,
        receiveLibAddress,
        remoteEid,
        ulnConfigType,
    );
    const receiveUlnConfigArray = ethers.utils.defaultAbiCoder.decode(
        ulnConfigStructType,
        receiveUlnConfigBytes,
    );
    console.log('Receive Library ULN Config:', receiveUlnConfigArray);
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['ReadLZConfig']

export default deployFn
