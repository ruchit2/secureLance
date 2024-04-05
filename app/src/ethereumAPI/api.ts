import { ethers } from "ethers";
import Escrow from "../artifacts/contracts/Escrow.sol/Escrow.json";

export async function deploy(signer, freelancer, arbiters, amount, terms) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );

  return factory.deploy(
    freelancer,
    arbiters,
    ethers.parseEther(amount),
    terms,
    {
      value: ethers.parseEther(amount),
    }
  );
}

export async function getContract(address, signer) {
  return new ethers.Contract(address, Escrow.abi, signer);
}

export function payNow(escrowContract) {
  return async () => {
    await escrowContract.clientApproval();
  };
}

export function raiseDispute(escrowContract) {
  return async () => {
    await escrowContract.raiseDispute();
  };
}

export function voteForClient(escrowContract) {
  return async () => {
    await escrowContract.vote(false);
  };
}

export function voteForFreelancer(escrowContract) {
  return async () => {
    await escrowContract.vote(true);
  };
}
