export const GET_ALL_STAKING_START_DATES = `
import BasicBeastsNFTStaking from 0xBasicBeastsNFTStaking

pub fun main(): {UInt64: UFix64} {
    return BasicBeastsNFTStaking.getAllStakingStartDates()
}
`;
