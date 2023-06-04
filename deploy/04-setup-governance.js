const { network, ethers } = require("hardhat");
const { devChains, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY, ADDRESS_ZERO } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const timeLock = await ethers.getContract("TimeLock");
    const governor = await ethers.getContract("GovernorContract");
    log("Setting up Roles ...");
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposerTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
}
module.exports.tags = ["all", "setup"];