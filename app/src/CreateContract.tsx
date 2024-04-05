import ActionButton from "./ActionButton";
import { deploy } from "./ethereumAPI/api";
import serverAPI from "./serverAPI/api";

function CreateContract({ signer }) {
  async function newContract() {
    const freelancer = document.getElementById("freelancer").value;
    const arbiter1 = document.getElementById("arbiter1").value;
    const arbiter2 = document.getElementById("arbiter2").value;
    const arbiter3 = document.getElementById("arbiter3").value;
    const ether_amount = document.getElementById("ether_amount").value;
    const terms = document.getElementById("terms").value;

    const escrowContract = await deploy(
      signer,
      freelancer,
      [arbiter1, arbiter2, arbiter3],
      ether_amount,
      terms
    );
    await serverAPI.addNewContractAddress(escrowContract.target);
  }

  return (
    <div className="contract">
      <h2> New Contract </h2>
      <label>
        Freelancer Address
        <input type="text" id="freelancer" />
      </label>

      <label>
        Deposit Amount (in Eth)
        <input type="text" id="ether_amount" />
      </label>

      <label>
        Project terms & conditions
        <textarea id="terms"></textarea>
      </label>

      <label>
        Arbiter 1 Address
        <input type="text" id="arbiter1" />
      </label>

      <label>
        Arbiter 2 Address
        <input type="text" id="arbiter2" />
      </label>

      <label>
        Arbiter 3 Address
        <input type="text" id="arbiter3" />
      </label>

      <ActionButton handleClick={newContract} text="Deploy" />
    </div>
  );
}

export default CreateContract;
