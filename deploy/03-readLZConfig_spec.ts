/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { getAdapterAddress, getEndpointV2 } from '../scripts/getParams';

const deployFn: DeployFunction = async (hre) => {

    const signer = (await ethers.getSigners())[0]
    const lzEndpointABI = [
        'function getConfig(address _oapp, address _lib, uint32 _eid, uint32 _configType) external view returns (bytes memory config)',
    ];

    const networkConfig = getEndpointV2(hre.network.name);
    const lzEndpointAddress = networkConfig.endpointV2;

    const lzEndpointContract = new ethers.Contract(lzEndpointAddress, lzEndpointABI, signer);
    const oappAddress = getAdapterAddress()
    
    const sendLibAddress = networkConfig.sendUln302;
    const receiveLibAddress = networkConfig.receiveUln302;

    let remoteEid = 30290
    const executorConfigType = 1; // 1 for executor
    const ulnConfigType = 2; // 2 for UlnConfig
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
