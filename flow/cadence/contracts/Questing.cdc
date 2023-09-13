
import QuestReward from "./QuestReward.cdc"

access(all) contract Questing {

    // -----------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------
    access(all) event QuestCreated(questID: UInt64, type: Type, questCreator: Address)

    // -----------------------------------------------------------------------
    // Paths
    // -----------------------------------------------------------------------
    access(all) let QuestManagerStoragePath: StoragePath
    access(all) let QuestManagerPublicPath: PublicPath
    access(all) let QuestManagerPrivatePath: PrivatePath

    // -----------------------------------------------------------------------
    // Contract Fields
    // -----------------------------------------------------------------------
    access(all) var totalSupply: UInt64
    access(all) var featuredQuestManagers: [Address] //maybe to promote certain quests permissionlessly on the clients. Must require a certain amount of coins staked to be featured and to avoid spam. Big maybe as the clients in the end have the power to decide what to show.
    
    // -----------------------------------------------------------------------
    // Future Contract Extensions
    // -----------------------------------------------------------------------
    access(self) var metadata: {String: AnyStruct}
    access(self) var resources: @{String: AnyResource}

    access(all) resource interface Public {

    }

    access(all) resource Quest: Public {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let questCreator: Address
        access(self) var questers: [Address]
        access(self) var questingStartDates: {UInt64: UFix64}
        access(self) var adjustedQuestingStartDates: {UInt64: UFix64}
        access(self) var rewards: @{UInt64: QuestReward.Collection} // nft.uuid: Rewards
        access(self) var metadata: {String: AnyStruct}
        access(self) var resources: @{String: AnyResource}

        init(type: Type, questCreator: Address) {
            self.id = self.uuid
            self.type = type
            self.questCreator = questCreator
            self.questers = []
            self.questingStartDates = {}
            self.adjustedQuestingStartDates = {}
            self.rewards <- {}
            self.metadata = {}
            self.resources <- {}

            Questing.totalSupply = Questing.totalSupply + 1
        }

        access(all) fun quest(questingResource: @AnyResource): @AnyResource {
            pre {
                questingResource.getType() == self.type: "questingResource type does not match type required by quest"
            }
            let type = questingResource.getType()

            return <- questingResource        
        }

        access(all) fun unquest() {}

        access(all) fun removeFromQuest() {}

        access(all) fun addReward() {

        }

        access(all) fun removeReward() {

        }

        access(all) fun moveReward() {

        }

        destroy() {
            destroy self.rewards
            destroy self.resources
        }
    
    }

    access(all) resource interface QuestManagerPublic {

    }

    //todo: update contract to store the quests on user accounts instead
    access(all) resource QuestManager: QuestManagerPublic {
        access(self) var quests: @{UInt64: Quest}

        init() {
            self.quests <- {}
        }

        access(all) fun getIDs(): [UInt64] {
            return self.quests.keys
        }

        access(all) fun createQuest(type: Type) {
            let quest <- create Quest(type: type, questCreator: self.owner!.address)
            let id = quest.id
            self.quests[id] <-! quest

            emit QuestCreated(questID: id, type: type, questCreator: self.owner!.address)
        }

        access(all) fun transferQuest() {

        }

        access(all) fun destroyQuest() {

        }

        access(all) fun borrowQuest() {

        }

        destroy() {
            destroy self.quests
        }

    }

    access(all) fun getQuest(questManager: Address, id: UInt64): &Quest? {
        let questManager = getAccount(questManager).getCapability<&QuestManager{QuestManagerPublic}>(QuestManagerPublicPath).borrow()
            ?? panic("Could not borrow QuestManagerPublic reference")

        let quest = questManager.borrowQuest(id: id)
        return quest
    }

    init() {
        self.QuestManagerStoragePath = /storage/QuestManager
        self.QuestManagerPublicPath = /public/QuestManager
        self.QuestManagerPrivatePath = /private/QuestManager

        self.totalSupply = 0
        self.featuredQuestManagers = []

        self.metadata = {}
        self.resources <- {}
    }
}