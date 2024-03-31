import { useEffect, useState } from "react";
import serverAPI from "./serverAPI/api";
import Escrow from "./Escrow";

function ExistingContracts({ signer }) {
  const [contractAddresses, setContractAddresses] = useState([]);

  useEffect(() => {
    async function fetchAddresses() {
      const {
        data: { contracts: addresses },
      } = await serverAPI.getContractAddresses();
      setContractAddresses(addresses);
    }
    fetchAddresses();
  }, []);

  return (
    <div className="existing-contracts">
      <h2> Existing Contracts </h2>
      <div className="list-container">
        {contractAddresses.map((address, index) => (
          <Escrow key={index} address={address} signer={signer} />
        ))}
      </div>
    </div>
  );
}

export default ExistingContracts;
