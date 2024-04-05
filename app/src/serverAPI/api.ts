import server from "./server";

const serverAPI = {
  async addNewContractAddress(address) {
    return await server.post("new-contract", { address });
  },
  async getContractAddresses() {
    return await server.get("contracts");
  },
};

export default serverAPI;
