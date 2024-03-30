import { useEffect, useState } from "react";
import { getContract, payNow } from "./ethereumAPI/api";

function Escrow({ signer, address }) {
  const [escrow, setEscrow] = useState(null);
  const [escrowContract, setEscrowContract] = useState(null);

  useEffect(() => {
    async function fetchContract() {
      const contract = await getContract(address, signer);
      setEscrowContract(contract);
      const escrowData = {
        address: await contract.getAddress(),
        client: await contract.client(),
        freelancer: await contract.freelancer(),
        amount: await contract.amount(),
        terms: await contract.terms(),
      };
      setEscrow(escrowData);
    }
    fetchContract();
  });

  return (
    <div>
      {escrow && (
        <>
          <div>Address - {escrow.address}</div>
          <div>Client - {escrow.client}</div>
          <div>Freelancer - {escrow.freelancer}</div>
          <div>Amount - {escrow.amount}</div>
          <div>Terms - {escrow.terms}</div>
          {escrow.client == signer.address && (
            <button
              id="payBtn"
              className="button"
              onClick={async () => {
                await payNow(escrowContract);
              }}
            >
              Pay
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Escrow;
