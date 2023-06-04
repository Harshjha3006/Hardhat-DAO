const { ethers } = require("hardhat");

const networkConfig = {
    31337: {
        name: "localhost",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        callBackGasLimit: "500000",
        interval: "60"
    },
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2Address: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        subscriptionId: "2196",
        callBackGasLimit: "500000",
        interval: "60"
    }
}

const devChains = ["hardhat", "localhost"];
const proposalsFile = "./proposals.json"

// Gov
const QUORUM_PERCENTAGE = 4 // Need 4% of voters to pass
const MIN_DELAY = 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact
// export const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
const VOTING_PERIOD = 5 // blocks
const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

const NEW_STORE_VALUE = 77
const FUNC = "setValue"
const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!"
module.exports = {
    devChains, proposalsFile, QUORUM_PERCENTAGE, MIN_DELAY, VOTING_PERIOD, VOTING_DELAY, ADDRESS_ZERO, NEW_STORE_VALUE, FUNC
    , PROPOSAL_DESCRIPTION, networkConfig
}