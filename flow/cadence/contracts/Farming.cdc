import NonFungibleToken from "./utility/NonFungibleToken.cdc"

access(all) contract Farming {

    access(self) var expeditions: @{UInt64: Expedition}
    access(self) var mappedResources: {UInt64: UInt64}
    access(self) var farmedResources: @{UInt64: AnyResource}
    access(self) var nftTypes: {UInt64: Type}

    access(all) resource Explorer {
        access(self) var lockedNFTs: @{UInt64: NonFungibleToken.NFT}
        access(self) var lockedStartDate: {UInt64: UFix64}

        init() {
            self.lockedNFTs <- {}
            self.lockedStartDate = {}
        }
        //todo: problem with NFTs, how to get them stay in the questing contract?
        // or should they? They need to be locked somehow
        // access(all) fun exploreUsingNFT(nft: @NonFungibleToken.NFT) {
            /* 
            let token <- token as! @BasicBeasts.NFT
            let id = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            */
        // }

        access(all) fun exploreUsingHybrids(hybrids: UInt64) {
            //TODO & fix arguments
        }

        access(all) fun exploreUsingShadowNFTs(shadowNFTs: UInt64) {
            //TODO & fix arguments
        }

        destroy() {
            destroy self.lockedNFTs
        }
    }
    access(all) resource Expedition {
        // access(all) let MIN_DURATION: UFix64
        // access(all) let baseDuration: UFix64
        // access(all) let worldID: UInt64
        // access(all) let territoryID: UInt32
        // needs capability to lock NFT from questing contract
        // access(self) var lockingNFTsCaps: {UInt64: Capability From questing, will it be the same}
        init(baseDuration: UFix64) {

        }
    }
    init() {
        self.expeditions <- {}
        self.mappedResources = {}
        self.farmedResources <- {}
        self.nftTypes = {}
    }
}