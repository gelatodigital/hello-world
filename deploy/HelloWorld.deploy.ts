import hre, { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../src/utils";

const isHardhat = hre.network.name === "hardhat";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (!isHardhat) {
    console.log(
      `\nDeploying HelloWorld to ${hre.network.name}. Hit ctrl + c to abort`
    );
    await sleep(2000);
  }

  const { deploy } = deployments;
  const { deployer, gelato } = await getNamedAccounts();

  await deploy("HelloWorld", {
    from: deployer,
    proxy: {
      proxyContract: "EIP173ProxyWithReceive",
    },
    args: [gelato],
    log: !isHardhat,
  });
};

export default func;

// func.skip = async () => {
//   return !isHardhat;
// };

func.tags = ["HelloWorld"];
