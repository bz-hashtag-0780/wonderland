import BasicBeastsRaids from "../contracts/BasicBeastsRaids.cdc"

pub fun main(): {UInt32: BasicBeastsRaids.RaidRecord} {
    return BasicBeastsRaids.getRaidRecords()
}