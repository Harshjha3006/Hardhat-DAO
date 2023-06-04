const { ethers, network } = require("hardhat");
const { NEW_STORE_VALUE, FUNC, PROPOSAL_DESCRIPTION, devChains, MIN_DELAY } = require("../helper-hardhat-config");
const { moveTime } = require("../utils/move-time");
const { moveBlocks } = require("../utils/move-blocks");

async function main() {
    const box = await ethers.getContract("Box");
    const args = [NEW_STORE_VALUE];
    const functionToCall = FUNC;
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
    const governor = await ethers.getContract("GovernorContract");
    // const desc = ethers.utils.id(PROPOSAL_DESCRIPTION);
    const desc = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));
    console.log("Queueing ...");
    const tx = await governor.queue([box.address], [0], [encodedFunctionCall], desc);
    await tx.wait(1);
    console.log("Queued")
    if (devChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1);
        await moveBlocks(1);
    }
    console.log("Executing ...");
    const tx2 = await governor.execute([box.address], [0], [encodedFunctionCall], desc);
    await tx2.wait(1);

    console.log(`New Value : ${await box.getValue()}`);

}

main().then(() => {
    process.exit(0);
}).catch((e) => {
    console.log(e)
    process.exit(1);
})