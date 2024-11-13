/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { getAdapterAddress, getEndpointV2, getLzDVNAddress, getLzEid } from '../scripts/getParams';

const deployFn: DeployFunction = async (hre) => {

    const signer = (await ethers.getSigners())[0]
    const lzEndpointABI = [
        'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
    ];

    const networkConfig = getEndpointV2(hre.network.name);
    const lzEndpointAddress = networkConfig.endpointV2;

    const lzEndpointContract = new ethers.Contract(lzEndpointAddress, lzEndpointABI, signer);
    const oappAddress = getAdapterAddress()
    const sendLibAddress = networkConfig.sendUln302;
    const receiveLibAddress = networkConfig.receiveUln302;

    const remoteChainId = 1
    let remoteEid = getLzEid(remoteChainId)
    if (remoteEid == 0) { 
        console.log('EID not found for chainId:', remoteChainId)
        return
    }

    const dvns = getLzDVNAddress(remoteChainId)
    if (dvns.length == 0) {
        console.log('DVNs not found')
        return
    }

    const ulnConfig = {
        confirmations: 0, // Example value, replace with actual
        requiredDVNCount: 2, // Example value, replace with actual
        optionalDVNCount: 0, // Example value, replace with actual
        optionalDVNThreshold: 0, // Example value, replace with actual
        requiredDVNs: dvns, // Replace with actual addresses
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
        requiredDVNs: dvns, // Replace with actual addresses
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