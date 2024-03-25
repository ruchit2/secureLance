import { ethers } from "hardhat";
import { expect } from "chai";

describe("Escrow", function () {
  let contract;
  let client;
  let freelancer;
  let arbiters;

  beforeEach(async () => {
    [client, freelancer, ...arbiters] = await ethers.getSigners();
    arbiters = arbiters.slice(0, 3);
    const Escrow = await ethers.getContractFactory("Escrow");
    contract = await Escrow.deploy(
      freelancer.address,
      arbiters.map((a) => a.address),
      100,
      "Freelance work",
      {
        value: 100,
      }
    );
  });

  it("Should deploy the contract with the correct initial state", async function () {
    expect(await contract.client()).to.equal(client.address);
    expect(await contract.freelancer()).to.equal(freelancer.address);
    expect(await contract.amount()).to.equal(100);
    expect(await contract.state()).to.equal(0);
    expect(await contract.terms()).to.equal("Freelance work");
  });

  it("Should allow client to approve payment directly", async function () {
    const resultPromise = contract.connect(client).clientApproval();
    expect(await resultPromise).to.not.be.reverted;
    expect(await resultPromise).to.emit(contract, "Completed");
    expect(await resultPromise).to.changeEtherBalance(freelancer, 100);
    expect(await contract.state()).to.equal(3);
  });

  it("Should process payment to freelancer if majority of arbiters approve", async function () {
    await contract.connect(client).raiseDispute(); // Simulate dispute
    const votePromises = arbiters.map(async (arbiter) => {
      await contract.connect(arbiter).vote(true); // Majority approves
    });
    await Promise.all(votePromises);
    expect(await contract.state()).to.equal(3);
    const resultPromise = contract.connect(freelancer);
    expect(await resultPromise).to.changeEtherBalance(freelancer, 100);
  });

  it("Should process refund to client if majority of arbiters don't approve", async function () {
    await contract.connect(freelancer).raiseDispute(); // Simulate dispute
    const votePromises = arbiters.map(async (arbiter) => {
      await contract.connect(arbiter).vote(false); // Majority approves
    });
    await Promise.all(votePromises);
    expect(await contract.state()).to.equal(2);
    const resultPromise = contract.connect(client);
    expect(await resultPromise).to.changeEtherBalance(client, 100);
  });

  it("Should transition to InDispute on dispute raised by client", async () => {
    const resultPromise = contract.connect(client).raiseDispute();
    expect(await resultPromise).to.emit(contract, "DisputeRaised");
    expect(await contract.state()).to.equal(1);
  });

  it("Should transition to InDispute on dispute raised by freelancer", async () => {
    const resultPromise = contract.connect(freelancer).raiseDispute();
    expect(await resultPromise).to.emit(contract, "DisputeRaised");
    expect(await contract.state()).to.equal(1);
  });

  it("Should revert when raising dispute in completed/cancelled state", async () => {
    await contract.connect(client).clientApproval();
    await expect(contract.connect(client).raiseDispute()).to.be.revertedWith(
      "Dispute can't be raised after completion or cancellation"
    );
  });
});
