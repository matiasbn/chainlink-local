const Oracle = artifacts.require("Oracle");
const clUtils = require('./cl-utils');

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { CHAINLINK_ORACLE_ADDRESS } = process.env;

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * @dev checks if the address inside chainlink/tempkeys has been stored
 * @returns {string|boolean}
 */
const updatedAddress = () => {
  let tempKey = null;
  try {
    tempKey = fs
      .readdirSync(path.resolve(__dirname, "../chainlink/tempkeys/"))[0]
      .trim();
  } catch (error) {
    console.log("tempkeys not created yet, waiting for creation....");
    return false;
  }
  if (!tempKey) return false;
  const { address } = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../chainlink/tempkeys/" + tempKey))
  );
  return web3.utils.toChecksumAddress(address);
};

/*
 * @dev The scripts check if the address of the node was updated. Then, transfers
 * 1000 eth, to finally call setFulfillmentPermission
 */

module.exports = async (callback) => {
  try {
    let CHAINLINK_NODE_ADDRESS = updatedAddress();
    while (!CHAINLINK_NODE_ADDRESS) {
      console.log("Waiting 5 seconds for tempkeys to be updated ...");
      await wait(5000);
      CHAINLINK_NODE_ADDRESS = updatedAddress();
    }
    console.log("Chainlink Node Address: " + CHAINLINK_NODE_ADDRESS);
    const [defaultAccount] = await web3.eth.getAccounts();
    await web3.eth.sendTransaction({
      from: defaultAccount,
      to: CHAINLINK_NODE_ADDRESS,
      value: web3.utils.toWei("1000", "ether"),
    });
    const balance = await web3.eth.getBalance(CHAINLINK_NODE_ADDRESS);
    console.log(
      "Chainlink Node balance: " + web3.utils.fromWei(balance) + " ether"
    );
    const oracle = await Oracle.at(CHAINLINK_ORACLE_ADDRESS);
    await oracle.setFulfillmentPermission(CHAINLINK_NODE_ADDRESS, true);
    const permissions = await oracle.getAuthorizationStatus.call(
      CHAINLINK_NODE_ADDRESS
    );
    console.log("Chainlink Node Fullfillment permissions: " + permissions);
    // To automate Job creation
    // const httpRequestJob = clUtils.createJob('runlog');
    // httpRequestJob.initiators[0].params.address = CHAINLINK_ORACLE_ADDRESS;
    // httpRequestJob.tasks.push(clUtils.createTask('httpget'));
    // httpRequestJob.tasks.push(clUtils.createTask('jsonparse'));
    // httpRequestJob.tasks.push(clUtils.createTask('ethuint256'));
    // httpRequestJob.tasks.push(clUtils.createTask('ethtx'));
    // console.log('Creating timestamp job on Chainlink node...');
    // const httpRequestJobRes = await clUtils.postJob(httpRequestJob);
    // console.log(`Job created! Job ID: ${httpRequestJobRes.data.id}.`);
    callback();
  } catch (error) {
    callback(error);
  }
};
