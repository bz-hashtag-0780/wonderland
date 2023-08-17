export const GET_ALL_RAID_RECORDS = `
import BasicBeastsRaids from 0xBasicBeastsRaids

pub fun main(): {UInt32: BasicBeastsRaids.RaidRecord} {
    return BasicBeastsRaids.getRaidRecords()
}
`;
