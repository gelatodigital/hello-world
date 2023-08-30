import { task } from "hardhat/config";
import { HelloWorld } from "../typechain";

export const setInterval = task("setinterval", "Sets time interval in seconds")
  .addPositionalParam("interval", "time interval in seconds")
  .setAction(async ({ interval }, { deployments, ethers }) => {
    try {
      const helloWorld = (await ethers.getContractAt(
        "HelloWorld",
        (
          await deployments.get("HelloWorld")
        ).address
      )) as HelloWorld;

      const txResponse = await helloWorld.setInterval(interval);

      console.log("\n waiting for mining\n");
      console.log(`txHash: ${txResponse.hash}`);

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
).setAction(async (_, { deployments, ethers }) => {
  try {
    const helloWorld = (await ethers.getContractAt(
      "HelloWorld",
      (
        await deployments.get("HelloWorld")
      ).address
    )) as HelloWorld;

    console.log(await helloWorld.interval());
  } catch (error) {
    console.error(error, "\n");
    process.exit(1);
  }
});
