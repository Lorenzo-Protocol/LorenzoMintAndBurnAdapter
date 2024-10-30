/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { Options } from '@layerzerolabs/lz-v2-utilities'

const deployFn: DeployFunction = async (hre) => {
    const signer = (await ethers.getSigners())[0]
    console.log(`Deploying from ${signer.address}`)

    const sepPeerId = 40161
    const sepLorenzoOFTaddress = "0xF0b7c988f1d5F993C9AEa1Ee23F220791f23b645"

    const bscTestnetPeerId = 40102
    const bscLorenzoOFTAddress = "0xC50bfC71BF0bB90E316a3F21CC51826c8FaB192d"

    // const stBTCAddress = "0x2a45dE58552F2C5E0597d1FbB8eC83F7E2dDBa0D"
    // const stBTCAbi = [
    //     'function approve(address spender, uint256 value) external returns (bool)'
    // ]
    // const stBTCContract = new ethers.Contract(stBTCAddress, stBTCAbi, signer)
    // const tx = await stBTCContract.connect(signer).approve(sepLorenzoOFTaddress, ethers.utils.parseEther('10000'))
    // await tx.wait()
    // console.log(`Approved ${sepLorenzoOFTaddress} to spend 10000 stBTC`)

    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
    const tokensToSend = ethers.utils.parseEther('0.023')
    const sendParam = [
        sepPeerId,
        ethers.utils.zeroPad(signer.address, 32),
        tokensToSend,
        tokensToSend,
        options,
        '0x',
        '0x',
    ]
    const lzMBAdapterContract = await ethers.getContractAt('LorenzoMintBurnOFTAdapter', bscLorenzoOFTAddress, signer)
    // Fetching the native fee for the token send operation
    const [nativeFee] = await lzMBAdapterContract.connect(signer).quoteSend(sendParam, false)
    console.log(`Native fee: ${nativeFee}`)

    //send tokens
    // const ctx = await lzMBAdapterContract.send(sendParam, [nativeFee, 0], signer.address, { value: nativeFee })
    // await ctx.wait()
    // console.log(`Tokens sent successfully`)
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['SendToken']

export default deployFn
