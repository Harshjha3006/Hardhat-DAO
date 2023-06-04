const { network } = require("hardhat");
const { MIN_DELAY, devChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        log: true,
        args: [MIN_DELAY, [], [], deployer],
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying ...");
        await verify(timeLock.address, [MIN_DELAY, [], [], deployer]);
    }
}
module.exports.tags = ["all", "timeLock"]