/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers, getNamedAccounts } from 'hardhat'
//import { ethers } from 'ethers'

const deployFn: DeployFunction = async (hre) => {
    const signer = (await ethers.getSigners())[0]
    console.log(`Deploying from ${signer.address}`)
    
    const sepPeerId = 40161
    const sepLorenzoOFTaddress = "0xF0b7c988f1d5F993C9AEa1Ee23F220791f23b645"

    const bscTestnetPeerId = 40102
    const bscTestnetLorenzoOFTAddress = "0xC50bfC71BF0bB90E316a3F21CC51826c8FaB192d"

    const lzMBAdapterContract = await ethers.getContractAt('LorenzoMintBurnOFTAdapter', sepLorenzoOFTaddress, signer)
    const tx = await lzMBAdapterContract.connect(signer).setPeer(bscTestnetPeerId, ethers.utils.zeroPad(bscTestnetLorenzoOFTAddress, 32))
    await tx.wait()

    console.log(`Set peer ${sepPeerId} to ${sepLorenzoOFTaddress}`)
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['SetPeer']

export default deployFn
