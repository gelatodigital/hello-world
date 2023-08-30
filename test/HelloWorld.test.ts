import hre, { ethers, deployments, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { HelloWorld } from "../typechain";
import {
  time as blockTime,
  impersonateAccount,
  setBalance,
} from "@nomicfoundation/hardhat-network-helpers";

const INTERVAL = 5 * 60 * 1000;

describe("Test HelloWorld Smart Contract", function () {
  let owner: Signer;

  let gelato: string;

  let helloWorld: HelloWorld;
  let gelatoSigner: Signer;

  const etherToPay = ethers.parseEther("1");

  beforeEach("tests", async function () {
    if (hre.network.name !== "hardhat") {
      console.error("Test Suite is meant to be run on hardhat only");
      process.exit(1);
    }

    await deployments.fixture();

    [owner] = await hre.ethers.getSigners();

    const { gelato: gelatoAddress } = await getNamedAccounts();
    gelato = gelatoAddress;

    // Impersonating the Gelato smart contract account
    await impersonateAccount(gelato);
    gelatoSigner = await ethers.provider.getSigner(gelato);

    // Instantiate HelloWorld contract (upgradeable proxy)
    helloWorld = (await ethers.getContractAt(
      "HelloWorld",
      (
        await deployments.get("HelloWorld")
      ).address,
      gelatoSigner
    )) as HelloWorld;

    // HelloWorld contract needs Ether in its balance to pay Gelato
    await setBalance(await helloWorld.getAddress(), etherToPay);
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
    await expect(
      helloWorld.helloWorld(etherToPay),
      "first helloWorld"
    ).to.changeEtherBalances([helloWorld, gelato], [-etherToPay, etherToPay]);

    expect(await helloWorld.canExec(), "is canExec false?").to.be.false;

    // Using hardhat-network-helpers to manipulate local blockchain time
    await blockTime.increase(INTERVAL);

    expect(await helloWorld.canExec(), "is canExec true?").to.be.true;

    await expect(
      helloWorld.helloWorld(etherToPay),
      "second helloWorld: revert due to insufficientBalance"
    ).to.be.revertedWith("Address: insufficient balance");

    // We need to reset balance as the first helloWorld consumed it
    await setBalance(await helloWorld.getAddress(), etherToPay);

    await expect(
      helloWorld.helloWorld(etherToPay),
      "second helloWorld: ether balances not changed"
    ).to.changeEtherBalances([helloWorld, gelato], [-etherToPay, etherToPay]);
  });

  it("#2: It reverts when you try to call not via GELATO", async () => {
    await expect(
      helloWorld.connect(owner).helloWorld(etherToPay)
    ).to.be.revertedWith("HelloWorld::onlyGelato");
  });
});
