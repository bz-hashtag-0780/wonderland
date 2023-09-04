import CleoCoin from "./CleoCoin.cdc"

access(all) contract WonderlandEligibles {
    access(all) var totalSupply: UInt64
    access(self) var eligiblesNFTs: @{UInt64: EligibleCollection}

    pub resource CollectionManager {}

    pub resource EligibleCollection {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let collectionManagerAddress: Address
        access(self) var stakedCoins: @CleoCoin.Vault

        init(type: Type, collectionManagerAddress: Address, coins: @CleoCoin.Vault) {
            self.id = WonderlandEligibles.totalSupply
            self.type = type
            self.collectionManagerAddress = collectionManagerAddress
            self.stakedCoins <- coins

            WonderlandEligibles.totalSupply = WonderlandEligibles.totalSupply + 1
        }

        destroy() {
            destroy self.stakedCoins
        }
    }

    access(all) fun makeCollectionEligible() {

    }

    access(all) fun removeCollection() {

    }

    access(all) fun stakingRequirement(id: UInt64) {
        
    }

    init() {
        self.totalSupply = 0
        self.eligiblesNFTs <- {}
    }

}