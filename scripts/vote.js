const { ethers, network } = require("hardhat");
const fs = require("fs");
const { proposalsFile, devChains, VOTING_PERIOD } = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");
async function vote() {
    const governor = await ethers.getContract("GovernorContract");
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"));
    const proposalId = proposals[network.config.chainId].at(-1).toString();
    const voteWay = 1;
    const reason = "I want to store 777"
    console.log("Voting ...")
    const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
    await voteTx.wait(1);
    const state = await governor.state(proposalId);
    console.log(`Current Proposal State : ${state}`);
    if (devChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1);
    }
}
vote().then(() => {
    process.exit(0);
}).catch((e) => {
    console.log(e);
    process.exit(1);
})