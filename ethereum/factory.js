import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

//pass in ABI and deployed address of the contract
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xa0Cb9e53BD73eb3515E41e9CFa9Da222113C2715"
);

export default instance;
