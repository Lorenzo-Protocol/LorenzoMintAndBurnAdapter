/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat'
import { Options } from '@layerzerolabs/lz-v2-utilities'

const deployFn: DeployFunction = async (hre) => {
    const oappAddress = "0xbcE9988376C6b9c0c035bdbc9060568031d51130"
    const options = Options.newOptions().addExecutorLzReceiveOption(100000, 0).toHex().toString()

    //===========Update the values below with the actual values===========
    const tokensToSend = ethers.utils.parseEther('0') // please replace with the amount of tokens you want to send
    const remoteEid = 0 // please replace with the remoteEid of the token you want to send
    const dstAddress = "0x0" // please replace with the destination address
    //===========Update the values above with the actual values===========


    if (tokensToSend.isZero() || remoteEid < 30000 || dstAddress.toLowerCase() == '0x0') {
        throw new Error('Please replace the values in the script with the actual values')
    }
    const sendParam = [
        remoteEid,
        ethers.utils.zeroPad(dstAddress, 32),
        tokensToSend,
        tokensToSend,
        options,
        '0x',
        '0x',
    ]
    const lzMBAdapterContract = await ethers.getContractAt('LorenzoMintBurnOFTAdapter', oappAddress)

    const sendParamPrint = [
        remoteEid,
        ethers.utils.hexlify(ethers.utils.zeroPad(dstAddress, 32)),
        tokensToSend,
        tokensToSend,
        options,
        '0x',
        '0x',
    ]

    console.log(`SendParam: [${sendParamPrint}]`)
    //Fetching the native fee for the token send operation
    const [nativeFee] = await lzMBAdapterContract.quoteSend(sendParam, false)
    const messagingFee = [nativeFee, 0]
    console.log(`MessagingFee: [${messagingFee}]`)
    console.log(`_refundAddress: ${dstAddress}`)

    console.log(`Native Fee: ${ethers.utils.formatEther(nativeFee)}`)
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['GetSafeParams']

export default deployFn
