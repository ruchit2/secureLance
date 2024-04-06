import { useEffect, useState } from "react";
import serverAPI from "./serverAPI/api";
import Escrow from "./Escrow";
import Sidebar from "./Sidebar";

function ExistingContracts({ signer }) {
  const [contractAddresses, setContractAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAddresses() {
      setLoading(true);
      const {
        data: { contracts: addresses },
      } = await serverAPI.getContractAddresses();
      setContractAddresses(addresses);
      setLoading(false);
    }
    fetchAddresses();
  }, []);

  return (
    <div id="container">
      <Sidebar />
      <div className="existing-contracts">
        <h2> Existing Contracts </h2>
        {loading && <div className="loader"></div>}
        {!loading &&
          (contractAddresses.length > 0 ? (
            <div className="list-container">
              {contractAddresses.map((address, index) => (
                <Escrow key={index} address={address} signer={signer} />
              ))}
            </div>
          ) : (
            <h1>No contracts found</h1>
          ))}
      </div>
    </div>
  );
}

export default ExistingContracts;
