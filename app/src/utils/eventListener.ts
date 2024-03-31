import { getContract } from "../ethereumAPI/api";

export default async function eventListener(address, signer, fetchEscrow) {
  function listener() {
    fetchEscrow();
  }
  const escrowContract = await getContract(address, signer);
  escrowContract.on("Completed", listener);
  escrowContract.on("DisputeRaised", listener);
  escrowContract.on("Voted", listener);
  escrowContract.on("DisputeResolved", listener);
  escrowContract.on("Cancelled", listener);
  return () => {
    escrowContract.off("Completed", listener);
    escrowContract.off("DisputeRaised", listener);
    escrowContract.off("Voted", listener);
    escrowContract.off("DisputeResolved", listener);
    escrowContract.off("Cancelled", listener);
  };
}
