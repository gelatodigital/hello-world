import { expect } from "chai";
import { Signer } from "@ethersproject/abstract-signer";
import hre = require("hardhat");
import { HelloWorld } from "../typechain";
import { getAddressBookByNetwork } from "../src/config";

const { gelato } = getAddressBookByNetwork(hre.network.name);
const { ethers, deployments } = hre;

const INTERVAL = 5 * 60 * 1000;

describe("Test HelloWorld Smart Contract", function () {
  this.timeout(0);

  let owner: Signer;
  let user: Signer;

  let helloWorld: HelloWorld;
  let gelatoSigner: Signer;

  const etherToPay = ethers.utils.parseEther("1");

  beforeEach("tests", async function () {
    if (hre.network.name !== "hardhat") {
      console.error("Test Suite is meant to be run on hardhat only");
      process.exit(1);
    }

    await deployments.fixture();
    [owner, , user] = await hre.ethers.getSigners();

    // Impersonating the account
    gelatoSigner = ethers.provider.getSigner(gelato);
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [await gelatoSigner.getAddress()],
    });

    // Instantiate HelloWorld and give it some ETH
    helloWorld = (await ethers.getContract(
      "HelloWorld",
      gelatoSigner
    )) as HelloWorld;

    await hre.network.provider.send("hardhat_setBalance", [
      helloWorld.address,
      "0x" + etherToPay.toString(),
    ]);
  });

  it("#0: When canExec is false and you try to call it reverts", async () => {
    // Let's get the intervals, lastCallTime and the last block timestamp see if we can execute the method
    await helloWorld.connect(owner).setInterval(INTERVAL); // 5 minutes

    // Call helloWorld to initialize lastCallTime on contract
    await expect(helloWorld.helloWorld(etherToPay)).to.emit(
      helloWorld,
      "LogHelloWorld"
    );

    expect(await helloWorld.canExec()).to.be.false;

    await expect(helloWorld.helloWorld(etherToPay)).to.be.revertedWith(
      "helloWorld: not canExec"
    );
  });

  it("#1: When canExec is true helloWorld should work and pay Gelato", async () => {
    // Let's get the intervals, lastCallTime and the last block timestamp see if we can execute the method
    await helloWorld.connect(owner).setInterval(INTERVAL); // 5 minutes

    // Call helloWorld to initialize lastCallTime on contract
    await expect(helloWorld.helloWorld(etherToPay)).to.emit(
      helloWorld,
      "LogHelloWorld"
    );

    const blockNumber = await ethers.provider.getBlockNumber();
    const { timestamp } = await ethers.provider.getBlock(blockNumber);

    expect(await helloWorld.canExec()).to.be.false;

    await hre.network.provider.send("evm_setNextBlockTimestamp", [
      timestamp + INTERVAL,
    ]);
    await hre.network.provider.send("evm_mine");

    expect(await helloWorld.canExec()).to.be.true;

    const balanceBefore = await ethers.provider.getBalance(gelato);

    await expect(helloWorld.helloWorld(etherToPay)).to.emit(
      helloWorld,
      "LogHelloWorld"
    );

    expect(await ethers.provider.getBalance(gelato)).to.be.gt(balanceBefore);
  });

  it("#2: It reverts when you try to call not via GELATO", async () => {
    await expect(
      helloWorld.connect(user).helloWorld(etherToPay)
    ).to.be.revertedWith("Gelatofied: Only gelato");
  });
});
