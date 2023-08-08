import BasicBeastsNFTStakingRewards from "../contracts/BasicBeastsNFTStakingRewards.cdc"

pub fun main(): {UInt64: {UInt32: BasicBeastsNFTStakingRewards.RewardItem}} {
    return BasicBeastsNFTStakingRewards.getAllRewards()
}