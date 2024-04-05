import { ethers } from "ethers";
import {
  getContract,
  payNow,
  raiseDispute,
  voteForClient,
  voteForFreelancer,
} from "../ethereumAPI/api";

export default async function getEscrow(address, signer) {
  const escrowContract = await getContract(address, signer);

  const escrowData = {
    address,
    client: await escrowContract.client(),
    freelancer: await escrowContract.freelancer(),
    amount: ethers.formatEther(await escrowContract.amount()),
    terms: await escrowContract.terms(),
    state: parseInt(await escrowContract.state()),
    isArbiter: await escrowContract.isArbiter(signer.address),
    hasVoted: await escrowContract.hasVoted(signer.address),
    handlePayNow: payNow(escrowContract),
    raiseDispute: raiseDispute(escrowContract),
    voteForClient: voteForClient(escrowContract),
    voteForFreelancer: voteForFreelancer(escrowContract),
  };
  return escrowData;
}
