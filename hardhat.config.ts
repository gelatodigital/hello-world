import { HardhatUserConfig, task } from "hardhat/config";

// PLUGINS
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";

import { HelloWorld } from "./typechain/HelloWorld";

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PK = process.env.PK;
const ALCHEMY_ID = process.env.ALCHEMY_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

task("setinterval", "Sets time interval in seconds")
  .addParam("interval", "time interval in seconds")
  .setAction(async ({ interval }, { deployments, ethers, network }) => {
    try {
      const helloWorld = (await ethers.getContractAt(
        "HelloWorld",
        (
          await deployments.get("HelloWorld")
        ).address
      )) as HelloWorld;

      const txResponse = await helloWorld.setInterval(interval, {
        gasPrice: ethers.utils.parseUnits("1", "gwei"),
      });
      console.log("\n waiting for mining\n");
      console.log(
        `${
          network.name === "mainnet" ? "" : network.name + "."
        }etherscan.io/tx/${txResponse.hash}`
      );
      await txResponse.wait();
      console.log("Mining Complete");
    } catch (error) {
      console.error(error, "\n");
      process.exit(1);
    }
  });

task("getinterval", "Gets time interval in seconds").setAction(
  async (taskParams, { deployments, ethers }) => {
    try {
      const helloWorld = (await ethers.getContractAt(
        "HelloWorld",
        (
          await deployments.get("HelloWorld")
        ).address
      )) as HelloWorld;

      const txResponse = await helloWorld.interval();
      console.log(txResponse.toNumber());
    } catch (error) {
      console.error(error, "\n");
      process.exit(1);
    }
  }
);

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },

  networks: {
    hardhat: {
      forking: {
        url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ID}`,
        blockNumber: 10911528,
      },
    },

    ropsten: {
      accounts: PK ? [PK] : [],
      chainId: 3,
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ID}`,
    },

    goerli: {
      accounts: PK ? [PK] : [],
      chainId: 5,
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_ID}`,
    },

    matic: {
      accounts: PK ? [PK] : [],
      chainId: 137,
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
    },

    fantom: {
      accounts: PK ? [PK] : [],
      chainId: 250,
      url: "https://rpcapi.fantom.network/",
    },
    bsc: {
      accounts: PK ? [PK] : [],
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts: PK ? [PK] : [],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: PK ? [PK] : [],
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : "",
  },

  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
