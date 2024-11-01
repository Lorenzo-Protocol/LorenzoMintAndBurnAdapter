/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'

const deployFn: DeployFunction = async (hre) => {

    const signer = (await ethers.getSigners())[0]
    const lzEndpointAddress = '0x6EDCE65403992e310A62460808c4b910D972f10f';
    const lzEndpointABI = [
        'function setSendLibrary(address _oapp, uint32 _eid, address _newLib) external',
        'function setReceiveLibrary(address _oapp, uint32 _eid, address _newLib, uint256 _gracePeriod) external',
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

    const sendTx = await lzEndpointContract.setSendLibrary(
        oappAddress,
        remoteEid,
        sendLibAddress,
    );
    console.log('Send library transaction sent:', sendTx.hash);
    await sendTx.wait();
    console.log('Send library set successfully.');
  
    // Set the receive library
    const receiveTx = await lzEndpointContract.setReceiveLibrary(
        oappAddress,
        remoteEid,
        receiveLibAddress,
        0
    );
    console.log('Receive library transaction sent:', receiveTx.hash);
    await receiveTx.wait();
    console.log('Receive library set successfully.');
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['SetLzLib']

export default deployFn