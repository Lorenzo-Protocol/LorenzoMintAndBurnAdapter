/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import { getAdapterAddress } from '../scripts/getParams'

const deployFn: DeployFunction = async (hre) => {
    const signer = (await ethers.getSigners())[0]
    console.log(`Deploying from ${signer.address}`)

    const oappAddress = getAdapterAddress()
    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
    const tokensToSend = ethers.utils.parseEther('0.000002')
    const remoteEid = 30290
    const sendParam = [
        remoteEid,
        ethers.utils.zeroPad(signer.address, 32),
        tokensToSend,
        tokensToSend,
        options,
        '0x',
        '0x',
    ]
    const lzMBAdapterContract = await ethers.getContractAt('LorenzoMintBurnOFTAdapter', oappAddress, signer)
    //Fetching the native fee for the token send operation
    const [nativeFee] = await lzMBAdapterContract.connect(signer).quoteSend(sendParam, false)
    console.log(`Native fee: ${nativeFee}`)

    //send tokens
    const ctx = await lzMBAdapterContract.send(sendParam, [nativeFee, 0], signer.address, { value: nativeFee })
    await ctx.wait()
    console.log(`Tokens sent successfully`)
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['SendToken']

export default deployFn
