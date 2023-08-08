export const GET_ALL_REWARDS = `
import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards

pub fun main(): {UInt64: {UInt32: BasicBeastsNFTStakingRewards.RewardItem}} {
    return BasicBeastsNFTStakingRewards.getAllRewards()
}
`;
