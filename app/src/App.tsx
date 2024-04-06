import CreateContract from "./CreateContract";
import ExistingContracts from "./ExistingContracts";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./Landing";
import NoWallet from "./NoWallet";
import { useEffect, useState } from "react";
import provider from "./ethereumAPI/provider";

function App() {
  const [signer, setSigner] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "create-contract",
      element: signer ? <CreateContract signer={signer} /> : <NoWallet />,
    },
    {
      path: "existing-contracts",
      element: signer ? <ExistingContracts signer={signer} /> : <NoWallet />,
    },
  ]);

  async function connectWallet() {
    await provider.send("eth_requestAccounts", []);
    setSigner(await provider.getSigner());
  }

  useEffect(() => {
    connectWallet();
  });

  return (
    <div>
      <div className="navbar">
        <h2>SecureLance</h2>
        {!signer && (
          <div
            className="button connect-btn"
            onClick={(e) => {
              e.preventDefault();
              connectWallet();
            }}
          >
            Connect Wallet
          </div>
        )}
      </div>
      <RouterProvider router={router} />;
    </div>
  );
}

export default App;
