import { getContract } from "../ethereumAPI/api";

export default async function getEscrow(address, signer) {
  const escrowContract = await getContract(address, signer);
  return escrowContract;
}
