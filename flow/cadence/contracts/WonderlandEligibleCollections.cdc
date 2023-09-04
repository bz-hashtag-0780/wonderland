/*  
    The digital resources of these Wonderland Eligible Collections can be used for farming, crafting, battling and other in-game activities.
    The collection manager are required to stake a certain amount of Cleo Coin to make their collection eligible.
    The same collection can be made eligible multiple times, but each time requires a new stake of Cleo Coin.
    The Cleo Coin staked will be locked until the collection is removed from the Wonderland Eligibles.
    The Cleo Coin staked will be returned to the collection manager when the collection is removed from the Wonderland Eligibles.
*/

import CleoCoin from "./CleoCoin.cdc"

access(all) contract WonderlandEligibleCollections {
    access(all) var totalSupply: UInt64
    access(self) var eligibleCollections: @{UInt64: EligibleCollection}

    pub resource CollectionManager {
        access(all) fun makeCollectionEligible(type: Type, coins: @CleoCoin.Vault) {
            pre {
                coins.balance >= WonderlandEligibleCollections.stakingRequirement(id: WonderlandEligibleCollections.totalSupply): "Cannot make collection eligible, not enough coins staked"
            }
            let newID = WonderlandEligibleCollections.totalSupply
            let newEligibleCollection <- create EligibleCollection(type: type, collectionManagerAddress: self.owner!.address, coins: <- coins)
            WonderlandEligibleCollections.eligibleCollections[newID] <-! newEligibleCollection
        }

        access(all) fun removeCollection(id: UInt64): @CleoCoin.Vault {
            pre {
                WonderlandEligibleCollections.eligibleCollections[id] != nil: "Cannot remove collection, collection does not exist"
                
            }
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
        }
    }

    access(all) fun stakingRequirement(id: UInt64): UFix64 {
        return 0.0
    }

    init() {
        self.totalSupply = 0
        self.eligibleCollections <- {}
    }

}