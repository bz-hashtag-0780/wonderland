import NonFungibleToken from "./utility/NonFungibleToken.cdc"

access(all) contract QuestReward: NonFungibleToken {

    access(all) event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    access(all) var totalSupply: UInt64

    access(all) struct RewardTemplate {}

    access(all) resource NFT: NonFungibleToken.INFT {

        access(all) let id: UInt64

        init(rewardTemplateID: UInt64) {
            self.id = self.uuid
        }
    }

    access(all) resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        
        access(all) var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        access(all) fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            panic("TODO")
        }

        access(all) fun deposit(token: @NonFungibleToken.NFT) {
            panic("TODO")
        }

        access(all) fun getIDs(): [UInt64] {
            panic("TODO")
        }

        access(all) fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            panic("TODO")
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    access(all) resource Minter {
        access(self) var rewardTemplates: {UInt64: RewardTemplate}

        init() {
            self.rewardTemplates = {}
        }

        access(all) fun mintReward(rewardTemplateID: UInt64): @NFT {
            return <- create NFT(rewardTemplateID: rewardTemplateID)
        }

        
    }


    access(all) fun createEmptyCollection(): @NonFungibleToken.Collection {
        panic("TODO")
    }

    init() {
        self.totalSupply = 0
        emit ContractInitialized()
    }
}