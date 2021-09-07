import { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getAddressBookByNetwork } from "../src/config";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../src/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name === "ropsten") {
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

  await deploy("HelloWorld", {
    from: deployer,
    proxy: {
      proxyContract: "EIP173ProxyWithReceive",
    },
    args: [gelato],
    gasPrice: hre.ethers.utils.parseUnits("100", "gwei"),
    log: hre.network.name !== "hardhat" ? true : false,
  });
};

export default func;

func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const shouldSkip = hre.network.name === "ropsten";
  return shouldSkip ? true : false;
};

func.tags = ["HelloWorld"];
