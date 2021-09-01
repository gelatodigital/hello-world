import { task } from "hardhat/config";
import { Ownable } from "../../typechain";

export const transferOwnership = task(
  "transferOwnership",
  "<contract>.transferOwnership"
)
  .addPositionalParam("contractName", "Name of the contract")
  .addPositionalParam("newOwner", "Name of the contract")
  .setAction(
    async (
      { contractName, newOwner }: { contractName: string; newOwner: string },
      { ethers }
    ) => {
      try {
        const contract = (await ethers.getContract(contractName)) as Ownable;

        const [signer] = await ethers.getSigners();

        if ((await signer.getAddress()) != (await contract.owner())) {
          console.error("Not the owner");
          process.exit(1);
        }

        console.log(
          `\n Transferring ownership of ${contractName} to: ${newOwner} \n`
        );

        const txResponse = await contract.transferOwnership(newOwner);

        console.log(`ropsten.etherscan.io/tx/${txResponse.hash}`);

        console.log("\n waiting for mining\n");

        await txResponse.wait();

        console.log("Mining Complete");
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }
  );
