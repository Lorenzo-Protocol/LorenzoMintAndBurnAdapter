/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers, getNamedAccounts } from 'hardhat'
//import { ethers } from 'ethers'

const deployFn: DeployFunction = async (hre) => {
    const signer = (await ethers.getSigners())[0]
    console.log(`Deploying from ${signer.address}`)
    
    const sepPeerId = 40161
    const sepLorenzoOFTaddress = "0x71d7EDFEBA63594E8eb61E1EFeE72510991a20Ed"

    const bscPeerId = 40102
    const bscLorenzoOFTAddress = "0xDe6c99850dc2253068d3e2B5815D4f346593aF93"

    const lzMBAdapterContract = await ethers.getContractAt('LorenzoMintBurnOFTAdapter', bscLorenzoOFTAddress, signer)
    const tx = await lzMBAdapterContract.connect(signer).setPeer(sepPeerId, ethers.utils.zeroPad(sepLorenzoOFTaddress, 32))
    await tx.wait()

    console.log(`Set peer ${sepPeerId} to ${sepLorenzoOFTaddress}`)
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['SetPeer']

export default deployFn
