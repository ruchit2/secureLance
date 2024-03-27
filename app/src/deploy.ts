import { ethers } from "ethers";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow.json";

export default async function deploy(
  signer,
  freelancer,
  arbiters,
  amount,
  terms
) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );

  return factory.deploy(freelancer, arbiters, amount, terms, { value: amount });
}
