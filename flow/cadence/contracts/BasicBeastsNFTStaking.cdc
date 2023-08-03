import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import BasicBeasts from "./BasicBeasts.cdc"

pub contract BasicBeastsNFTStaking {

    pub event ContractInitialized()
    pub event Stake(id: UInt64, to: Address?)
    pub event Unstake(id: UInt64, from: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    access(self) var stakers: [Address]
    access(self) var stakingStartDates: {UInt64: UFix64}
    access(self) var adjustedStakingDates: {UInt64: UFix64}

    pub resource interface NFTStakingCollectionPublic {
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowBeast(id: UInt64): &BasicBeasts.NFT{BasicBeasts.Public}? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Beast reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: NFTStakingCollectionPublic {

        pub var stakedNFTs: @{UInt64: BasicBeasts.NFT}

        init() {
            self.stakedNFTs <- {}
        }

        pub fun getIDs(): [UInt64] {
            return self.stakedNFTs.keys
        }

        pub fun stake(nft: @BasicBeasts.NFT) {
            let id: UInt64 = nft.id

            let oldToken <- self.stakedNFTs[id] <- nft

            destroy oldToken

            // add new staker to the list
            BasicBeastsNFTStaking.addStaker(address: self.owner?.address!)

            // add timer
            BasicBeastsNFTStaking.stakingStartDates[id] = getCurrentBlock().timestamp
            BasicBeastsNFTStaking.adjustedStakingDates[id] = getCurrentBlock().timestamp

            emit Stake(id: id, to: self.owner?.address)
        }

        pub fun unstake(id: UInt64): @BasicBeasts.NFT {
            let token <- self.stakedNFTs.remove(key: id) ?? panic("missing NFT")

            // remove timer
            BasicBeastsNFTStaking.stakingStartDates[id] = nil
            BasicBeastsNFTStaking.stakingStartDates.remove(key: id)
            BasicBeastsNFTStaking.adjustedStakingDates[id] = nil
            BasicBeastsNFTStaking.adjustedStakingDates.remove(key: id)

            emit Unstake(id: token.id, from: self.owner?.address)

            return <-token
        } 

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.stakedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowBeast(id: UInt64): &BasicBeasts.NFT{BasicBeasts.Public}? {
            if self.stakedNFTs[id] != nil {
                let ref = (&self.stakedNFTs[id] as &BasicBeasts.NFT?)!
                return ref as &BasicBeasts.NFT{BasicBeasts.Public}
            } else {
                return nil
            }
        }

        destroy() {
            destroy self.stakedNFTs
        }

    }

    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    access(contract) fun addStaker(address: Address) {
        if(!BasicBeastsNFTStaking.stakers.contains(address)) {
            BasicBeastsNFTStaking.stakers.append(address)
        }
    }

    access(account) fun updateAdjustedStakingDate(id: UInt64, rewardPerSecond: UFix64) {
        if(self.adjustedStakingDates[id] != nil) {
            self.adjustedStakingDates[id] = self.adjustedStakingDates[id]! + rewardPerSecond
        }
    }

    pub fun getStakingStartDate(id: UInt64): UFix64? {
        return self.stakingStartDates[id]
    }

    pub fun getAllStakingStartDates(): {UInt64: UFix64} {
        return self.stakingStartDates
    }

    pub fun getAdjustedStakingDate(id: UInt64): UFix64? {
        return self.adjustedStakingDates[id]
    }

    pub fun getAllAdjustedStakingDates(): {UInt64: UFix64} {
        return self.adjustedStakingDates
    }

    init() {
        self.stakers = []
        self.stakingStartDates = {}
        self.adjustedStakingDates = {}
        
        self.CollectionStoragePath = /storage/BasicBeastsNFTStakingCollection_1
        self.CollectionPublicPath = /public/BasicBeastsNFTStakingCollection_1

        emit ContractInitialized()
    }

}