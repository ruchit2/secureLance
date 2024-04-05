import { useEffect, useState } from "react";
import getEscrow from "./utils/getEscrow";
import eventListener from "./utils/eventListener";
import ActionButton from "./ActionButton";

function Escrow({ signer, address }) {
  const [escrow, setEscrow] = useState(null);

  async function fetchEscrow() {
    const escrowData = await getEscrow(address, signer);
    setEscrow(escrowData);
  }

  function getStateTag(state) {
    switch (state) {
      case 0:
        return <span className="stateTag initiated">Initiated</span>;
      case 1:
        return <span className="stateTag indispute">In Dispute</span>;
      case 2:
        return <span className="stateTag cancelled">Cancelled</span>;
      case 3:
        return <span className="stateTag completed">Completed</span>;
    }
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
          <h3>Amount - {escrow.amount} ETH</h3>
          <h3>Terms & Conditions - {escrow.terms}</h3>
          <h3>State - {getStateTag(escrow.state)}</h3>
          <div className="buttons-container">
            {escrow.state == 0 && escrow.client == signer.address && (
              <ActionButton handleClick={escrow.handlePayNow} text="Pay" />
            )}
            {escrow.state == 0 &&
              (escrow.client == signer.address ||
                escrow.freelancer == signer.address) && (
                <ActionButton
                  handleClick={escrow.raiseDispute}
                  text="Raise Dispute"
                />
              )}
            {escrow.state == 1 && escrow.isArbiter && !escrow.hasVoted && (
              <>
                <ActionButton
                  handleClick={escrow.voteForClient}
                  text="Vote For Client"
                />
                <ActionButton
                  handleClick={escrow.voteForFreelancer}
                  text="Vote For Freelancer"
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Escrow;
