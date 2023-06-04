const { network, ethers } = require("hardhat");
const { devChains, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY, ADDRESS_ZERO } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const timeLock = await ethers.getContract("TimeLock");
    const box = await deploy("Box", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1
    })
    if (!devChains.includes(network.name)) {
        log("Verifying ...");
        await verify(box.address, []);
    }
    const boxContract = await ethers.getContractAt("Box", box.address);
    const transferTx = await boxContract.transferOwnership(timeLock.address)
    await transferTx.wait(1)
}
module.exports.tags = ["all", "box"];