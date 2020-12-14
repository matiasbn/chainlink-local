require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const test_mnemonic = process.env.TEST_MNEMONIC;

module.exports = {
  networks: {
    testing: {
      provider: function () {
        return new HDWalletProvider(test_mnemonic, "http://localhost:8545");
      },
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.6.6",
    },
  },
};
