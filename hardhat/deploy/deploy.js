const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const Main = await ethers.getContractFactory("Main");
    const main = await Main.deploy();
    await main.deployed();
    console.log(`Main contract deployed at address: ${main.address}`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
