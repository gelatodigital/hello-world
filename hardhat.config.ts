import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

// TASKS
// import * from "./tasks"

const PK = process.env.PK;
const ALCHEMY_ID = process.env.ALCHEMY_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// HardhatUserConfig bug
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  // // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0,
    },
    gelato: {
      default: "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6", // we fork ethereum
      ethereum: "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6",
      goerli: "0x683913B3A32ada4F8100458A3E1675425BdAa7DF",
    },
  },

  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
        blockNumber: 16620765,
      },
    },
    goerli: {
      accounts: PK ? [PK] : [],
      chainId: 5,
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_ID}`,
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },

  // hardhat-deploy
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : "",
    },
  },
};

export default config;
