/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { getEndpointV2, getStBtcAddress } from '../scripts/getParams'
import {getContractAddress} from '@ethersproject/address';

const deployFn: DeployFunction = async (hre) => {

    const { getNamedAccounts, deployments } = hre
    
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`Deploying from ${deployer}`)

    const stBTCAddress = getStBtcAddress();
    const endpointV2DeploymentAddress = getEndpointV2(hre.network.name);
    console.log(`stBTCAddress: ${stBTCAddress}, endpointV2DeploymentAddress: ${endpointV2DeploymentAddress}`)

    const deployerNonce = await hre.ethers.provider.getTransactionCount(deployer)
    const lorenzoMintBurnOFTAdapterAddress = getContractAddress({
      from: deployer,
      nonce: deployerNonce
    })
    console.log(`lorenzoMintBurnOFTAdapterAddress will be: ${lorenzoMintBurnOFTAdapterAddress}`)
    const expectLorenzoMintBurnOFTAdapterAddress = ''

    if (lorenzoMintBurnOFTAdapterAddress.toLowerCase() == expectLorenzoMintBurnOFTAdapterAddress.toLowerCase()) {
        const { address } = await deploy("LorenzoMintBurnOFTAdapter", {
            from: deployer,
            args: [
                stBTCAddress, // token address
                endpointV2DeploymentAddress, // LayerZero's EndpointV2 address
                deployer, // owner
            ],
            log: true,
            skipIfAlreadyDeployed: false,
        })

        console.log(`Deployed contract: LorenzoMintBurnOFTAdapter, network: ${hre.network.name}, address: ${address}`)
    }
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['DeployLorenzoMintBurnOFTAdapter']

export default deployFn
