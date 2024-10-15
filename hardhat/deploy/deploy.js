const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');
const MainDeploy = require('../artifacts/contracts/Main.sol/Main.json');
async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
    
    const Main = await ethers.getContractFactory("Main");
    const main = await Main.deploy();
    await main.deployed();
    
    console.log(`Main contract deployed at address: ${main.address}`);
    
    const contractDetails = {
        contractAddress: main.address,
        deployerAddress: deployer.address,
        timestamp: new Date().toISOString(),
        abi:MainDeploy.abi
    };

    try {
        fs.writeFileSync(path.join(__dirname,'../../frontend/contractDetails.json'), JSON.stringify(contractDetails, null, 2));
    } catch (error) {
        console.error('Error writing contract details to file:', error);
    }
}

main()
.catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
