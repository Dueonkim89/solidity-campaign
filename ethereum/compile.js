const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
//recursively delete build folder along with everything in it.
fs.removeSync(buildPath);

//path to contract
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
//read the file
const source = fs.readFileSync(campaignPath, "utf8");

//compile the contract and pull the contracts property that gets returned
// an object with 2 compiled contracts is returned.
const output = solc.compile(source, 1).contracts;

//create the build folder
fs.ensureDirSync(buildPath);

console.log(Object.keys(output));

//loop thru returned object. For each key create a json file.
// and upload the value of the key into the file.
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
