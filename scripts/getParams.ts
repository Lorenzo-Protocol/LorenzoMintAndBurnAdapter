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

export function getAdapterAddress(): string {
    const TESTNET_ADAPTER_ADDRESS = ""
    const MAINNET_ADAPTER_ADDRESS = "0xbcE9988376C6b9c0c035bdbc9060568031d51130"
    const chainId = hre.network.config.chainId || 31337;
  
    let adapterAddress = " "
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
        adapterAddress = MAINNET_ADAPTER_ADDRESS
    } else {
        adapterAddress = TESTNET_ADAPTER_ADDRESS
    }
    return adapterAddress
}

export function getLzEid(chainId: number): number {
  
    let eid = 0;
    if (chainId === 56) {
        eid = 30102;
    } // BSC Mainnet
    else if (chainId === 1) {
        eid = 30101;
    } // Ethereum Mainnet
    else if (chainId === 167000) {
        eid = 30290;
    } else if (chainId === 97) {
        eid = 40102
    } else if (chainId === 11155111) {
        eid = 40161 
    } else if (chainId === 167009) {
        eid = 40274
    }
    return eid
}


export function getLzDVNAddress(remoteChainId: number): string[] {
    const chainId = hre.network.config.chainId || 31337;
    let dvns: string[] = []
    if (chainId === 56 && remoteChainId === 167000) {
        dvns = ['0x247624e2143504730aec22912ed41f092498bef2', '0xfd6865c841c2d64565562fcc7e05e619a30615f0']
    } else if (chainId === 167000){
        dvns = ['0xbd237ef21319e2200487bdf30c188c6c34b16d3b', '0xc097ab8cd7b053326dfe9fb3e3a31a0cce3b526f']
    } else if (chainId === 1 && remoteChainId === 167000){
        dvns = ['0x380275805876ff19055ea900cdb2b46a94ecf20d', '0x589dedbd617e0cbcb916a9223f4d1300c294236b']
    } else if (chainId === 1 && remoteChainId === 56) {
        dvns = ['0x589dedbd617e0cbcb916a9223f4d1300c294236b', '0x8ddf05f9a5c488b4973897e278b58895bf87cb24']
    } else if (chainId === 56 && remoteChainId === 1) {
        dvns = ['0x8ddf05f9a5c488b4973897e278b58895bf87cb24', '0xfd6865c841c2d64565562fcc7e05e619a30615f0']
    } 
    return dvns
}

export interface NetworkConfig {
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

export function getEndpointV2(network: string): NetworkConfig {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, './lz-chain-deployments.json'), 'utf8');
        const configs: Configurations = JSON.parse(rawData);

        if (!(network in configs)) {
            throw new Error(`Network ${network} not found in configuration`);
        }
        if (network === 'mainnet') {
            network = 'ethereum'
        }

        return configs[network];
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get endpointV2: ${error.message}`);
        }
        throw error;
    }
}