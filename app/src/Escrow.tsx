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
    <>
      {escrow && (
        <div className="item-container">
          <h3>Address - {escrow.address}</h3>
          <h3>Client - {escrow.client}</h3>
          <h3>Freelancer - {escrow.freelancer}</h3>
          <h3>Amount - {escrow.amount}</h3>
          <h3>Terms - {escrow.terms}</h3>
          <h3>State - {escrow.state}</h3>
          <div className="buttons-container">
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
          </div>
          {escrow.state == 2 && <div>Cancelled</div>}
          {escrow.state == 3 && <div>Completed</div>}
        </div>
      )}
    </>
  );
}

const ActionButton = ({ onClick, text }) => (
  <div className="button" onClick={onClick}>
    {text}
  </div>
);

export default Escrow;
