const { network, ethers } = require("hardhat");
const { devChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1
    });
    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying ....");
        await verify(governanceToken.address, []);
    }

    log("Delegating to Deployer ....");
    await delegate(governanceToken.address, deployer);
}
async function delegate(tokenAddress, delegatee) {
    const token = await ethers.getContractAt("GovernanceToken", tokenAddress);
    const tx = await token.delegate(delegatee);
    await tx.wait(1);
    console.log(`CheckPoints : ${await token.numCheckpoints(delegatee)}`);
}

module.exports.tags = ["all", "token"];
