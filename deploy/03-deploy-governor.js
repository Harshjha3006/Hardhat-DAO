const { network, ethers } = require("hardhat");
const { devChains, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const timeLock = await ethers.getContract("TimeLock");
    const gToken = await ethers.getContract("GovernanceToken");
    const args = [gToken.address, timeLock.address, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY];
    const governor = await deploy("GovernorContract", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying ...");
        await verify(governor.address, args);
    }
}
module.exports.tags = ["all", "governor"]