export const GET_REWARD_PER_SECOND = `
import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards

pub fun main(): UFix64 {
    return BasicBeastsNFTStakingRewards.rewardPerSecond
}
`;
