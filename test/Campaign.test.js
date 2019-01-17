const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("Web3");

//pass ganache to web3
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  //pass in parsed ABI to web3.eth.contract
  //no need to pass in address because we want to deploy a new version of the contract.
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    //deploy and pass in bytecode
    .deploy({ data: compiledFactory.bytecode })
    //send from 1st account
    .send({ from: accounts[0], gas: "1000000" });

  //use factory to make a new instance of campaign
  //100 wei is set as minimum
  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000"
  });

  //ES6 syntax. destruct array and assign first index of array to variable campaignAddress
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  //use web3 to create a JS representation of the campaign contract.
  campaign = await new web3.eth.Contract(
    //pass in abi and address.
    //address is needed when deploying a contract already created
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
  //no need to deploy or send the campaign contract because it was already created by factory.
});

//test to make sure campaigns exist.
describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  //test to see if accounts[0] is the manager of the campaign
  it("accounts[0] is the manager", async () => {
    // .call since we are NOT creating a tx. just retrieving a variable
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  //see if contributor is added to approvers
  it("allows people to contribute money and lists them as approvers", async () => {
    //creating a tx, so use .send()
    //pass in value of wei and from account we are contributing.
    await campaign.methods
      .contribute()
      .send({ value: "200", from: accounts[1] });
    //cannot retrieve entire mapping. Must pass in argument to get back single value
    const validApprover = await campaign.methods.approvers(accounts[1]).call();
    assert.equal(validApprover, true);
  });

  //requires mimimum contribution, else we get error
  it("requires minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ value: "50", from: accounts[1] });
      //assert false makes the test automatically fail
      //assert(false);
    } catch (err) {
      assert(err);
    }
  });

  //manager can make a request
  it("manager can make a request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    //provide index of the solidity array we want returned
    const request = await campaign.methods.requests(0).call();

    assert.equal(request.description, "Buy batteries");
  });

  it("processes requests", async () => {
    //contribute from account[0]
    await campaign.methods
      .contribute()
      .send({ value: web3.utils.toWei("10", "ether"), from: accounts[0] });

    //balance of account[1] before receiving ether
    let balanceBefore = await web3.eth.getBalance(accounts[1]);
    balanceBefore = web3.utils.fromWei(balanceBefore, "ether");

    // create a request, set vendor as account [1]
    await campaign.methods
      .createRequest(
        "Buy batteries",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({ from: accounts[0], gas: "1000000" });

    // approve the request as account[0]
    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    //finalize the request
    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    //get balance of accounts[1] after receiving ether
    let balanceAfter = await web3.eth.getBalance(accounts[1]);
    // convert balance to ether
    balanceAfter = web3.utils.fromWei(balanceAfter, "ether");

    assert(parseFloat(balanceAfter) > parseFloat(balanceBefore));
  });
});
