import NonFungibleToken from "./utility/NonFungibleToken.cdc"

access(all) contract QuestReward: NonFungibleToken {

    // -----------------------------------------------------------------------
    // NonFungibleToken Standard Events
    // -----------------------------------------------------------------------
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)

    // -----------------------------------------------------------------------
    // Contract Events
    // -----------------------------------------------------------------------
    access(all) event Minted(id: UInt64, minterID: UInt64, rewardTemplateID: UInt32, rewardTemplate: RewardTemplate, minterAddress: Address?)
    access(all) event RewardTemplateAdded(id: UInt32, name: String, description: String, image: String)
    access(all) event RewardTemplateUpdated(id: UInt32, name: String, description: String, image: String)

    // -----------------------------------------------------------------------
    // Named Paths
    // -----------------------------------------------------------------------
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let CollectionPrivatePath: PrivatePath

    // -----------------------------------------------------------------------
    // Contract Fields
    // -----------------------------------------------------------------------
    access(all) var totalSupply: UInt64
    access(all) var rewardTemplateSupply: UInt32
    access(all) var minterSupply: UInt64

    // -----------------------------------------------------------------------
    // Future Contract Extensions
    // -----------------------------------------------------------------------
    access(self) var metadata: {String: AnyStruct}
    access(self) var resources: @{String: AnyResource}

    access(all) struct RewardTemplate {
        access(all) let id: UInt32
        access(all) let name: String
        access(all) let description: String
        access(all) let image: String

        init(id: UInt32, name: String, description: String, image: String) {
            self.id = id
            self.name = name
            self.description = description
            self.image = image
        }
    }

    access(all) resource NFT: NonFungibleToken.INFT {

        access(all) let id: UInt64
        access(all) let minterID: UInt64
        access(all) let rewardTemplateID: UInt32
        access(self) var metadata: {String: AnyStruct}
        access(self) var resources: @{String: AnyResource}

        init(minterID: UInt64, rewardTemplateID: UInt32, rewardTemplate: RewardTemplate, minterAddress: Address?) {
            self.id = self.uuid
            self.minterID = minterID
            self.rewardTemplateID = rewardTemplateID
            self.metadata = {}
            self.resources <- {}

            QuestReward.totalSupply = QuestReward.totalSupply + 1

            emit Minted(id: self.id, minterID: self.minterID, rewardTemplateID: self.rewardTemplateID, rewardTemplate: rewardTemplate, minterAddress: minterAddress)
        }

        destroy() {
            destroy self.resources
        }
    }

    access(all) resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        
        access(all) var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        access(all) fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: withdrawID, from: self.owner?.address)

            return <-token
        }

        access(all) fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @QuestReward.NFT

            let id: UInt64 = token.id

            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        access(all) fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    access(all) resource interface MinterPublic {
        access(all) let id: UInt64
        access(all) fun getRewardTemplate(id: UInt64): RewardTemplate?
        access(all) fun getRewardTemplates(): {UInt64: RewardTemplate}
    }

    access(all) resource Minter {
        access(all) let id: UInt64
        access(self) var rewardTemplates: {UInt32: RewardTemplate}
        access(self) var metadata: {String: AnyStruct}
        access(self) var resources: @{String: AnyResource}

        init() {
            self.id = QuestReward.minterSupply
            self.rewardTemplates = {}
            self.metadata = {}
            self.resources <- {}

            QuestReward.minterSupply = QuestReward.minterSupply + 1
        }

        access(all) fun mintReward(rewardTemplateID: UInt32): @NFT {
            pre {
                self.rewardTemplates[rewardTemplateID] != nil: "Reward Template does not exist"
            }

            return <- create NFT(minterID: self.id, rewardTemplateID: rewardTemplateID, rewardTemplate: self.getRewardTemplate(id: rewardTemplateID)!, minterAddress: self.owner?.address)
        }

        access(all) fun addRewardTemplate(name: String, description: String, image: String) {
            let id: UInt32 = QuestReward.rewardTemplateSupply

            self.rewardTemplates[id] = RewardTemplate(id: id, name: name, description: description, image: image)

            QuestReward.rewardTemplateSupply = QuestReward.rewardTemplateSupply + 1

        }

        access(all) fun updateRewardTemplate(id: UInt32, name: String, description: String, image: String) {
            pre {
                self.rewardTemplates[id] != nil: "Reward Template does not exist"
            }
            self.rewardTemplates[id] = RewardTemplate(id: id, name: name, description: description, image: image)
        }

        access(all) fun getRewardTemplate(id: UInt32): RewardTemplate? {
            return self.rewardTemplates[id]
        }

        access(all) fun getRewardTemplates(): {UInt32: RewardTemplate} {
            return self.rewardTemplates
        }
        
        destroy() {
            destroy self.resources
        }
    }

    access(all) fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    access(all) fun createMinter(): @Minter {
        return <- create Minter()
    }

    init() {
        self.CollectionStoragePath = /storage/QuestRewardCollection
        self.CollectionPublicPath = /public/QuestRewardCollection
        self.CollectionPrivatePath = /private/QuestRewardCollection

        self.totalSupply = 0
        self.rewardTemplateSupply = 0
        self.minterSupply = 0

        self.metadata = {}
        self.resources <- {}

        emit ContractInitialized()
    }
}