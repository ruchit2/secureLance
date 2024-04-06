import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link className="sidebar-option" to={"/create-contract"}>
        Create Contract
      </Link>
      <Link className="sidebar-option" to={"/existing-contracts"}>
        Existing Contracts
      </Link>
    </div>
  );
}

export default Sidebar;
