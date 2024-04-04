import { useEffect, useState } from "react";
import CreateContract from "./CreateContract";
import ExistingContracts from "./ExistingContracts";
import provider from "./ethereumAPI/provider";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [activeView, setActiveView] = useState("Create Contract");

  async function connectWallet() {
    if (window.ethereum) {
      await provider.send("eth_requestAccounts", []);
      setSigner(await provider.getSigner());
      setIsConnected(true);
    } else {
      console.error("wallet not detected");
    }
  }

  useEffect(() => {
    connectWallet();
  });

  function renderContent() {
    switch (activeView) {
      case "Create Contract":
        return <CreateContract signer={signer} />;
      case "Existing Contract":
        return <ExistingContracts signer={signer} />;
    }
  }

  return (
    <div>
      <div className="navbar">
        <h1>SecureLance</h1>
        {!isConnected && (
          <div
            className="button connect-btn"
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
      <div id="container">
        <div className="sidebar">
          <div
            className="sidebar-option"
            onClick={() => setActiveView("Create Contract")}
          >
            Create Contract
          </div>
          <div
            className="sidebar-option"
            onClick={() => setActiveView("Existing Contract")}
          >
            Existing Contract
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
