/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { getAdapterAddress, getEndpointV2 } from '../scripts/getParams';

const deployFn: DeployFunction = async (hre) => {

    const signer = (await ethers.getSigners())[0]
    const lzEndpointABI = [
        'function setSendLibrary(address _oapp, uint32 _eid, address _newLib) external',
        'function setReceiveLibrary(address _oapp, uint32 _eid, address _newLib, uint256 _gracePeriod) external',
    ];

    const networkConfig = getEndpointV2(hre.network.name);
    const lzEndpointAddress = networkConfig.endpointV2;

    const lzEndpointContract = new ethers.Contract(lzEndpointAddress, lzEndpointABI, signer);
    // Define the addresses and parameters
    const oappAddress = getAdapterAddress()
    const sendLibAddress = networkConfig.sendUln302;
    const receiveLibAddress = networkConfig.receiveUln302;

    let remoteEid = 30290
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