import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      <h1 className="title">SecureLance - Escrow for Freelancers</h1>
      <Link to={"create-contract"} className="button">
        Get Started
      </Link>
      <div className="features">
        <h2>Features</h2>
        <ul>
          <li>
            Easy Setup: Clients can create contracts using freelancer's address.
          </li>
          <li>
            Flexible Payment: Clients can choose to pay only when satisfied with
            the work.
          </li>
          <li>
            Dispute Resolution: Both clients and freelancers can raise disputes
            if needed.
          </li>
          <li>
            Majority Vote Arbitration: Disputes are resolved by the majority
            vote of the chosen arbiters, ensuring a fair outcome.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Landing;
