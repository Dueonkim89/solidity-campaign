const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

//import from build/CampaignFactory.json
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "theme impulse then episode resemble work vocal dry own fiber loud toddler",
  "https://rinkeby.infura.io/v3/a0ab6d59647647dc9fda0824c7c9f107"
);

const w3 = new Web3(provider);

const deploy = async () => {
  const accounts = await w3.eth.getAccounts();

  const result = await new w3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("Contract deployed to ", result.options.address);
};

deploy();

// Contract deployed to  0x146A10fe7E878D3E935bd8211bB1A6C5CEdd1cC4
