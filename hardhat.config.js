require("@nomiclabs/hardhat-waffle")
require('dotenv').config();

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      chainId: 1337
    },

ropsten: {
  url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
  accounts : [`${process.env.PRIVATE_KEY}`],
  saveDeployments: true,
  chainId: 3,
  
  },
  },
  solidity: {
    version: "0.8.14",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}