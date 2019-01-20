import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && window.web3) {
  //pass metamask provider into our web3
  web3 = new Web3(window.web3.currentProvider);
  window.web3.currentProvider.enable();
} else {
  // if no metamask or not on browser
  //create a web provider and pass in our infura node.
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/a0ab6d59647647dc9fda0824c7c9f107"
  );
  web3 = new Web3(provider);
}

export default web3;
