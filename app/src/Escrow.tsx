import { useEffect, useState } from "react";
import getEscrow from "./utils/getEscrow";
import eventListener from "./utils/eventListener";

function Escrow({ signer, address }) {
  const [escrow, setEscrow] = useState(null);

  async function fetchEscrow() {
    const escrowData = await getEscrow(address, signer);
    setEscrow(escrowData);
  }

  useEffect(() => {
    fetchEscrow();
  }, [signer.address]);

  useEffect(() => {
    eventListener(address, signer, fetchEscrow);
  }, [address, signer.address]);

  return (
    <div>
      {escrow && (
        <>
          <div>Address - {escrow.address}</div>
          <div>Client - {escrow.client}</div>
          <div>Freelancer - {escrow.freelancer}</div>
          <div>Amount - {escrow.amount}</div>
          <div>Terms - {escrow.terms}</div>
          <div>State - {escrow.state}</div>
          {escrow.state == 0 && escrow.client == signer.address && (
            <ActionButton
              onClick={async () => {
                await escrow.handlePayNow();
              }}
              text="Pay"
            />
          )}
          {escrow.state == 0 &&
            (escrow.client == signer.address ||
              escrow.freelancer == signer.address) && (
              <ActionButton
                onClick={async () => {
                  await escrow.raiseDispute();
                }}
                text="Raise Dispute"
              />
            )}
          {escrow.state == 1 && escrow.isArbiter && !escrow.hasVoted && (
            <>
              <ActionButton
                onClick={async () => {
                  await escrow.voteForClient();
                }}
                text="Vote For Client"
              />
              <ActionButton
                onClick={async () => {
                  await escrow.voteForFreelancer();
                }}
                text="Vote For Freelancer"
              />
            </>
          )}
          {escrow.state == 2 && <div>Cancelled</div>}
          {escrow.state == 3 && <div>Completed</div>}
        </>
      )}
    </div>
  );
}

const ActionButton = ({ onClick, text }) => (
  <button className="button" onClick={onClick}>
    {text}
  </button>
);

export default Escrow;
