require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const { ALCHEMY_SEPHOLIA_URL, PRIVATE_KEY } = process.env
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {},
    // sepolia: {
    //   url: ALCHEMY_SEPHOLIA_URL,
    //   accounts: [`0x${PRIVATE_KEY}`]
    // }
  }
};
