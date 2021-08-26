import { deployments, getNamedAccounts, ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getAddressBookByNetwork } from "../src/config";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../src/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (
    hre.network.name === "fantom" ||
    hre.network.name === "mainnet" ||
    hre.network.name === "matic" ||
    hre.network.name == "mumbai" ||
    hre.network.name === "ropsten"
  ) {
    console.log(
      `Deploying HelloWorld to ${hre.network.name}. Hit ctrl + c to abort`
    );
    await sleep(10000);
  }

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { gelato } = getAddressBookByNetwork(hre.network.name);

  if (!hre.ethers.utils.isAddress(gelato)) {
    console.error("No gelato in network config addressBook");
    return;
  }
  let gelatoSigner = ethers.provider.getSigner(gelato);

  const helloWorld = await deploy("HelloWorld", {
    from: deployer,
    args: [gelato],
    log: hre.network.name !== "hardhat" ? true : false,
  });
};

export default func;

func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const shouldSkip =
    hre.network.name === "fantom" ||
    hre.network.name === "mainnet" ||
    hre.network.name === "matic" ||
    hre.network.name === "mumbai" ||
    hre.network.name === "ropsten";
  return shouldSkip ? true : false;
};

func.tags = [];
