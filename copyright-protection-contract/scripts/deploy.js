// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const path = require("path");
const fs = require("fs");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config({ path: ".env" });

const contract = ['Copyright'];

async function publishContract(contractName) {

    const ContractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = await ContractFactory.deploy();
    const address = contract.address;
    await contract.deployed();
    console.log(contractName + " contract address: " + address);

    await sleep(10000);
    await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
    });

    // copy the contract JSON file to front-end and add the address field in it
    fs.copyFileSync(
        path.join(__dirname, "../artifacts/contracts/" + contractName + ".sol/" + contractName + ".json"), //source
        path.join(__dirname, "../../copyright-protection-frontend/src/api/" + contractName + ".json") // destination
    );

}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');
    for (cont of contract) {
        await publishContract(cont);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
