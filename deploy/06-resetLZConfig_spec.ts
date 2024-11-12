/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { getAdapterAddress, getEndpointV2 } from '../scripts/getParams';

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

    let remoteEid = 30290

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