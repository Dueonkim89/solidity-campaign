import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

//pass in ABI and deployed address of the contract
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x146A10fe7E878D3E935bd8211bB1A6C5CEdd1cC4"
);

export default instance;
