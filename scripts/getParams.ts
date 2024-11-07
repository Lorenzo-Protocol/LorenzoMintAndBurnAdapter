import hre from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

export function getStBtcAddress(): string {
    const TESTNET_STBTC_ADDRESS = "0x2a45dE58552F2C5E0597d1FbB8eC83F7E2dDBa0D"
    const MAINNET_STBTC_ADDRESS = "0xf6718b2701d4a6498ef77d7c152b2137ab28b8a3"
    const chainId = hre.network.config.chainId || 31337;
  
    let stBTCAddress = " "
    if (chainId === 56 || // BSC Mainnet
        chainId === 1 || // Ethereum Mainnet
        chainId === 8329 || // Lorenzo Mainnet
        chainId === 200901 ||   // Bitlayer Mainnet
        chainId === 42161 ||    // Arbitrum One Mainnet
        chainId === 534352 ||   // Scroll Mainnet
        chainId === 169 ||  // Manta Mainnet
        chainId === 5000 || // Mantle Mainnet
        chainId === 196 ||  // Xlayer Mainnet
        chainId === 223 ||  // B2 Mainnet
        chainId === 4200 || // Merlin Mainnet
        chainId === 11501 ||  // BEVM Mainnet
        chainId === 167000 ||  // Taiko Mainnet
        chainId === 34443  // Mode Mainnet
    ) {
      stBTCAddress = MAINNET_STBTC_ADDRESS
    } else {
      stBTCAddress = TESTNET_STBTC_ADDRESS
    }
    return stBTCAddress
}

interface NetworkConfig {
    executor: string;
    endpointV2: string;
    sendUln301: string;
    sendUln302: string;
    receiveUln301: string;
    receiveUln302: string;
}

interface Configurations {
    [key: string]: NetworkConfig;
}

export function getEndpointV2(network: string): string {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, './lz-chain-deployments.json'), 'utf8');
        const configs: Configurations = JSON.parse(rawData);

        if (!(network in configs)) {
            throw new Error(`Network ${network} not found in configuration`);
        }

        return configs[network].endpointV2;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get endpointV2: ${error.message}`);
        }
        throw error;
    }
}