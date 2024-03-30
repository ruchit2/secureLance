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
      value: ethers.parseEther(`${parseInt(amount) + 10}`),
    }
  );
}

export async function getContract(address, signer) {
  return new ethers.Contract(address, Escrow.abi, signer);
}

export async function payNow(escrowContract) {
  const txn = escrowContract.clientApproval();
  return txn;
}
