import { ethers } from "ethers";
import { useEffect, useState } from "react";
import CreateContract from "./CreateContract";

// 1. request wallet to connect, set first account as account

const provider = new ethers.BrowserProvider(window.ethereum);
function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(await provider.getSigner());
      setIsConnected(true);
    } else {
      console.error("wallet not detected");
    }
  }

  useEffect(() => {
    connectWallet();
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>SecureLance</h1>
        {!isConnected && (
          <div
            className="button"
            onClick={(e) => {
              e.preventDefault();
              if (!isConnected) {
                connectWallet();
              }
            }}
          >
            Connect Wallet
          </div>
        )}
      </div>
      <CreateContract signer={signer} />
    </div>
  );
}

export default App;
