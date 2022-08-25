import { task } from "hardhat/config";
import { HelloWorld } from "../typechain";

export const setInterval = task("setinterval", "Sets time interval in seconds")
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

export const getInterval = task(
  "getInterval",
  "Gets time interval in seconds"
).setAction(async (taskParams, { deployments, ethers }) => {
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
});
