/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { getAdapterAddress } from '../scripts/getParams'

const deployFn: DeployFunction = async (hre) => {
    const signer = (await ethers.getSigners())[0]
    
    const peerEids = [30102]
    const adapterAddress = getAdapterAddress()

    const lzMBAdapterContract = await ethers.getContractAt('LorenzoMintBurnOFTAdapter', adapterAddress, signer)

    for (var peerId of peerEids) {
        const tx = await lzMBAdapterContract.connect(signer).setPeer(peerId, ethers.utils.zeroPad(adapterAddress, 32))
        await tx.wait()
        console.log(`Set peer ${peerId} to ${adapterAddress}`)
    }
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['SetPeer']

export default deployFn
