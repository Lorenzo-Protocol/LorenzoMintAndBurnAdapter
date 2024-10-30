/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'

const deployFn: DeployFunction = async (hre) => {

    const { getNamedAccounts, deployments } = hre
    
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`Deploying from ${deployer}`)

    const stBTCAddress = "0x2a45dE58552F2C5E0597d1FbB8eC83F7E2dDBa0D"
    const mintableContractAddress = "0xD871696c9EA3ca9FD5258E33d093d504b7cB2DAB" //"0xcF93cD03eD618A31688860e01F450f9989764e87"
    const endpointV2DeploymentAddress = "0x6EDCE65403992e310A62460808c4b910D972f10f"

    const { address } = await deploy("LorenzoMintBurnOFTAdapter", {
        from: deployer,
        args: [
            stBTCAddress, // token address
            mintableContractAddress, // mintable contract address
            endpointV2DeploymentAddress, // LayerZero's EndpointV2 address
            deployer, // owner
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: LorenzoMintBurnOFTAdapter, network: ${hre.network.name}, address: ${address}`)
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['DeployLorenzoMintBurnOFTAdapter']

export default deployFn
