access(all) contract Farming {

    access(all) resource Expedition {
        access(all) let MIN_DURATION: UFix64
        access(all) let baseDuration: UFix64
        access(all) let worldID: UInt64
        access(all) let territoryID: UInt32
        // needs capability to lock NFT from questing contract
        init(baseDuration: UFix64) {

        }
    }
    init() {}
}