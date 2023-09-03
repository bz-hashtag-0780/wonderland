access(all) contract Farming {

    access(all) resource Expedition {
        access(all) let MIN_DURATION: UFix64
        access(all) let baseDuration: UFix64
        access(all) let worldID: UInt64
        access(all) let territoryID: UInt32
        // needs capability to lock NFT from questing contract
        // access(self) var lockingNFTsCaps: 
        init(baseDuration: UFix64) {
            
        }
    }
    init() {}
}