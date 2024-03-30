import express from "express";
import cors from "cors";
import fs from "fs";

const port = 3042;
const app = express();

app.use(cors());
app.use(express.json());

function readDataFromFile() {
  const data = fs.readFileSync("db.json", "utf8");
  const jsonData = JSON.parse(data);
  return jsonData.contracts;
}

async function writeDataToFile(data) {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON format
  fs.writeFileSync("db.json", jsonData, "utf8");
}

app.get("/contracts",  (req, res) => {
  let contracts = readDataFromFile();
  res.send({ contracts });
});

app.post("/new-contract",  (req, res) => {
  const { contract } = req.body;
  if (!contract)
    return res.status(400).send({ message: "Not specified contract address!" });
  let contracts = readDataFromFile();
  contracts.push(contract);
  writeDataToFile({ contracts });
  return res.send({ amount: contracts.length });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}🟢`);
});
