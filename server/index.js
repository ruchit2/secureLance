import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const port = 3042;
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, {dbName: "db"});

const contractSchema = new mongoose.Schema({
  address: String,
});

const Contract = mongoose.model("Contract", contractSchema);

app.get("/contracts", async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.send({ contracts: contracts.map((contractObj) => contractObj.address) });
  } catch (error) {
    res.status(500).send({ message: "Error fetching contracts" });
  }
});

app.post("/new-contract", async (req, res) => {
  const { address } = req.body;
  if (!address)
    return res.status(400).send({ message: "Contract address not specified!" });
  try {
    const newContract = new Contract({ address });
    await newContract.save();
    res.send({ message: "Contract added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error adding contract" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}🟢`);
});
