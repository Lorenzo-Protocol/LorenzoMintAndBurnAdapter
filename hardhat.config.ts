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
      url: process.env.BSC_TESTNET_RPC_URL || 'https://bsc-testnet.bnbchain.org',
      accounts: [deployer],
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL ||'https://ethereum-sepolia-rpc.publicnode.com',
      accounts: [deployer],
    },
    mainnet: {
      chainId: 1,
      url: process.env.ETH_MAINNET_RPC_URL || 'https://rpc.ankr.com/eth',
      accounts: [deployer],
    },
    bsc: {
      chainId: 56,
      url: process.env.BSC_MAINNET_RPC_URL || 'https://rpc.ankr.com/bsc',
      accounts: [deployer],
    },
    taiko: {
      chainId: 167000,
      url: process.env.TAIKO_MAINNET_RPC_URL || 'https://rpc.ankr.com/taiko',
      accounts: [deployer],
    },
    bitlayer_testnet: {
      chainId: 200810,
      url: process.env.BITLAYER_TESTNET_RPC_URL || '',
      accounts: [deployer],
    },
    bitlayer_mainnet: {
      chainId: 200901,
      url: process.env.BITLAYER_MAINNET_RPC_URL || 'https://rpc.bitlayer-rpc.com',
      accounts: [deployer],
    },
    lrz_testnet: {
      chainId: 83291,
      url: process.env.LORENZO_TESTNET_RPC_URL || '',
      accounts: [deployer],
    },
    lrz_mainnet: {
      chainId: 8329,
      url: process.env.LORENZO_MAINNET_RPC_URL || '',
      accounts: [deployer],
    },
    arbitrum_one: {
      chainId: 42161,
      url: process.env.ARB_MAINNET_RPC_URL || 'https://arb1.arbitrum.io/rpc',
      accounts: [deployer],
    },
    manta: {
      chainId: 169,
      url: process.env.MANTA_MAINNET_RPC_URL || 'https://r1.pacific.manta.systems/http',
      accounts: [deployer],
    },
    mantle: {
      chainId: 5000,
      url: process.env.MANTLE_MAINNET_RPC_URL || 'https://rpc.mantle.xyz',
      accounts: [deployer],
    },
    xlayer: {
      chainId: 196,
      url: process.env.XLAYER_MAINNET_RPC_URL || '',
      accounts: [deployer],
    },
    b2_mainnet: {
      chainId: 223,
      url: process.env.B2_MAINNET_RPC_URL || 'https://rpc.bsquared.network',
      accounts: [deployer],
    },
    merlin_mainnet: {
      chainId: 4200,
      url: process.env.MERLIN_MAINNET_RPC_URL || 'https://rpc.merlinchain.io',
      accounts: [deployer],
    },
    bevm_mainnet: {
      chainId: 11501,
      url: process.env.BEVM_MAINNET_RPC_URL || 'https://rpc-mainnet-1.bevm.io',
      accounts: [deployer],
    },
    core: {
      chainId: 1116,
      url: 'https://rpc.coredao.org/',
      accounts: [deployer],
    },
    corn: {
      chainId: 21000000,
      url: 'https://mainnet.corn-rpc.com',
      accounts: [deployer],
    },
    hemi: {
      chainId: 43111,
      url: 'https://7e57304f.rpc.hemi.network/rpc',
      accounts: [deployer],
    },
    plume: {
      chainId: 98865,
      url: 'https://phoenix-rpc.plumenetwork.xyz',
      accounts: [deployer],
    },
    sonic: {
      chainId: 146,
      url: 'https://rpc.ankr.com/sonic_mainnet',
      accounts: [deployer],
    }
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
