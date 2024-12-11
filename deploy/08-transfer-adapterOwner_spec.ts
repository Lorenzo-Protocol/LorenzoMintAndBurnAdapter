/* Imports: Internal */
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers } from 'hardhat';
import readline from 'readline';
import { getAdapterAddress } from '../scripts/getParams';

const deployFn: DeployFunction = async (hre) => {
    const signer = (await ethers.getSigners())[0]
    console.log('Deploying contracts with the account:', signer.address);
    
    const adapterAddress = getAdapterAddress()
    const newOwner = "";

    const askConfirmation = () => {
        return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(`Are you sure you want to proceed with transferring ownership to this address: ${newOwner}? (y/Y to confirm): `, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y');
        });
        });
    };
    const confirmed = await askConfirmation();
    if (confirmed) { 
        console.log('Proceeding with ownership transfer...');
        const lzMBAdapterContract = await ethers.getContractAt('LorenzoMintBurnOFTAdapter', adapterAddress, signer)
        const tx1 = await lzMBAdapterContract.connect(signer).transferOwnership(newOwner);
        await tx1.wait();
        console.log('transfer Adapter Ownership success');
    }
    else {
        console.log('Adapter Ownership transfer canceled.');
    }
}

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ['transferAdapterOwner']

export default deployFn
