/*  
    The digital resources of these Wonderland Eligible Collections can be used for farming, crafting, battling and other in-game activities.
    The collection manager are required to stake a certain amount of Cleo Coin to make their collection eligible.
    The same collection can be made eligible multiple times, but each time requires a new stake of Cleo Coin.
    The Cleo Coin staked will be locked until the collection is removed from the Wonderland Eligibles.
    The Cleo Coin staked will be returned to the collection manager when the collection is removed from the Wonderland Eligibles.
*/

import CleoCoin from "./CleoCoin.cdc"

access(all) contract WonderlandEligibleCollections {
    access(all) let BASE_STAKING_REQUIREMENT: UFix64
    access(all) var totalSupply: UInt64
    access(self) var eligibleCollections: @{UInt64: EligibleCollection}
    access(self) var collectionsIDs: [UInt64]

    pub resource CollectionManager {
        access(all) fun makeCollectionEligible(type: Type, coins: @CleoCoin.Vault) {
            pre {
                coins.balance >= WonderlandEligibleCollections.stakingRequirement(id: WonderlandEligibleCollections.totalSupply): "Cannot make collection eligible, not enough coins staked"
            }
            let newID = WonderlandEligibleCollections.totalSupply
            let newEligibleCollection <- create EligibleCollection(type: type, collectionManagerAddress: self.owner!.address, coins: <- coins)
            WonderlandEligibleCollections.collectionsIDs.append(newID)
            WonderlandEligibleCollections.eligibleCollections[newID] <-! newEligibleCollection
        }

        access(all) fun removeCollection(id: UInt64): @CleoCoin.Vault {
            pre {
                WonderlandEligibleCollections.eligibleCollections[id] != nil: "Cannot remove collection, collection does not exist"
                
            }
            // check if collection manager of the collection
            // update eligibleCollections
            // update collectionsIDs

            return <- CleoCoin.createEmptyVault()
        }

        access(all) fun withdrawStakedCoins(id: UInt64, amount: UFix64): @CleoCoin.Vault {
            pre {
                WonderlandEligibleCollections.eligibleCollections[id] != nil: "Cannot withdraw staked coins, collection does not exist"
            }
            // check if collection manager of the collection
            // update eligibleCollections
            // update collectionsIDs

            return <- CleoCoin.createEmptyVault()
        }
    }

    pub resource EligibleCollection {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let collectionManagerAddress: Address
        access(self) var stakedCoins: @CleoCoin.Vault

        init(type: Type, collectionManagerAddress: Address, coins: @CleoCoin.Vault) {
            self.id = WonderlandEligibleCollections.totalSupply
            self.type = type
            self.collectionManagerAddress = collectionManagerAddress
            self.stakedCoins <- coins

            WonderlandEligibleCollections.totalSupply = WonderlandEligibleCollections.totalSupply + 1
        }

        destroy() {
            destroy self.stakedCoins
            WonderlandEligibleCollections.totalSupply = WonderlandEligibleCollections.totalSupply - 1
        }
    }

    access(all) fun stakingRequirement(id: UInt64): UFix64 {
        var position = 0.0
        for collectionID in WonderlandEligibleCollections.collectionsIDs {
            if collectionID == id {
                break
            }
            position = position + 1.0
        }
        return position * WonderlandEligibleCollections.BASE_STAKING_REQUIREMENT
    }

    init() {
        self.BASE_STAKING_REQUIREMENT = 2023.0
        self.totalSupply = 0
        self.eligibleCollections <- {}
        self.collectionsIDs = []
    }

}