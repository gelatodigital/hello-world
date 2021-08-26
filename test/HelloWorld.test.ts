import { expect } from "chai";
import { Signer } from "@ethersproject/abstract-signer";
import hre = require("hardhat");
import { HelloWorld } from "../typechain";
import { getAddressBookByNetwork } from "../src/config";

const { gelato } = getAddressBookByNetwork(hre.network.name);
const { ethers, deployments } = hre;

describe("Test HelloWorld Smart Contract", function () {
  this.timeout(0);

  let owner: Signer;
  let ownerAddress: string;

  let user: Signer;
  let userAddress: string;

  let helloWorld: HelloWorld;
  let gelatoSigner: Signer;

  const etherToPay = ethers.utils.parseEther("0.01");

  beforeEach("tests", async function () {
    if (hre.network.name !== "hardhat") {
      console.error("Test Suite is meant to be run on hardhat only");
      process.exit(1);
    }

    await deployments.fixture();
    [owner, , user] = await hre.ethers.getSigners();
    ownerAddress = await owner.getAddress();
    userAddress = await user.getAddress();

    gelatoSigner = ethers.provider.getSigner(gelato);

    // Impersonating the account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [await gelatoSigner.getAddress()],
    });

    // Setting some balance to the account
    await hre.network.provider.send("hardhat_setBalance", [
      gelato,
      "0x" + etherToPay.toString(),
    ]);


    helloWorld = (await ethers.getContractAt(
      "HelloWorld",
      (
        await deployments.get("HelloWorld")
      ).address,
      gelatoSigner
    )) as HelloWorld;

    await hre.network.provider.send("hardhat_setBalance", [
      (
        await deployments.get("HelloWorld")
      ).address,
      "0x" + etherToPay.toString(),
    ]);

  });

  it("#0: LogHelloWorld is emitted", async () => {
    await expect(
      helloWorld.helloWorld(etherToPay, { value: etherToPay })
    ).to.emit(helloWorld, "LogHelloWorld");
  });

  it("#1: When canExec is false and you try to call it reverts", async () => {
    // Let's get the intervals, lastCallTime and the last block timestamp see if we can execute the method

    const interval = await helloWorld.interval();
    const lastCallTime = await helloWorld.lastCallTime();
    const blockNumber = await ethers.provider.getBlockNumber();
    const { timestamp } = await ethers.provider.getBlock(blockNumber);

    if (lastCallTime.add(interval).lte(timestamp)) {
      // Only the owner can call this method
      await helloWorld.connect(owner).setInterval(timestamp);
    }

    const canExec = await helloWorld.canExec();
    expect(canExec).to.be.false;
    await expect(
      helloWorld.helloWorld(etherToPay)
    ).to.be.revertedWith("helloWorld: not canExec");
  });

  it("#2: It reverts when you try to call not via GELATO", async () => {
    await expect(
      helloWorld.connect(user).helloWorld(etherToPay, { value: etherToPay })
    ).to.be.revertedWith("Gelatofied: Only gelato");
  });

  it("#3: GELATO gets paid paymentAmount after successful call", async () => {
    const gelatoBalanceBefore = await ethers.provider.getBalance(gelato);
    const tx = await helloWorld.helloWorld(etherToPay, { value: etherToPay });
    const txData = await tx.wait();
    const gelatoBalanceAfter = await ethers.provider.getBalance(gelato);

    console.log(txData);
    console.log(`Balance Before: ${gelatoBalanceBefore}`);
    console.log(`Balance After: ${gelatoBalanceAfter}`);
    console.log(etherToPay);
    console.log(
      "Substraction After:" + gelatoBalanceBefore.sub(gelatoBalanceAfter)
    );

    expect(gelatoBalanceBefore.sub(txData.gasUsed)).to.be.equal(
      gelatoBalanceAfter
    );
    0x1735cfe9ebf15a80;
    0x8eea;
    0x1734c5b72fac3a80;
  });
});
