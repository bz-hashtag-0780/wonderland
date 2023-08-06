export const GET_ALL_ADJUSTED_STAKING_DATES = `
import BasicBeastsNFTStaking from 0xBasicBeastsNFTStaking

pub fun main(): {UInt64: UFix64} {
    return BasicBeastsNFTStaking.getAllAdjustedStakingDates()
}
`;
