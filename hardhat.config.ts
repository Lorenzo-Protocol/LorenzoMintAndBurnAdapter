import { HardhatUserConfig } from "hardhat/config";
import 'hardhat-deploy'
import '@nomiclabs/hardhat-ethers'
import "@nomicfoundation/hardhat-verify";
import * as dotenv from 'dotenv'
dotenv.config()

const deployer = process.env.DEPLOY_PRIVATE_KEY || '0x' + '11'.repeat(32)

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      gas: 29000000,
    },
    bscTestnet: {
      chainId: 97,
      url: process.env.BSC_TESTNET_RPC_URL || '',
      accounts: [deployer],
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL || '',
      accounts: [deployer],
    },
    mainnet: {
      chainId: 1,
      url: process.env.ETH_MAINNET_RPC_URL || '',
      accounts: [deployer],
    },
    bsc: {
      chainId: 56,
      url: process.env.BSC_MAINNET_RPC_URL || '',
      accounts: [deployer],
    },
    taiko: {
      chainId: 167000,
      url: process.env.TAIKO_MAINNET_RPC_URL || '',
      accounts: [deployer],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETH_API_KEY!,
      mainnet: process.env.ETH_API_KEY!,
      bscTestnet: process.env.BSC_API_KEY!,
      bsc: process.env.BSC_API_KEY!,
    }
  }
};

export default config;
