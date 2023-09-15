
import QuestReward from "./QuestReward.cdc"

access(all) contract Questing {

    // -----------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------
    access(all) event QuestStarted(questID: UInt64, resourceType: Type, questingResourceID: UInt64, quester: Address)
    access(all) event QuestEnded(questID: UInt64, resourceType: Type, questingResourceID: UInt64)
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
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let questCreator: Address
        access(all) fun quest(questingResource: @AnyResource): @AnyResource
        access(all) fun unquest(questingResource: @AnyResource): @AnyResource
        access(all) fun getQuesters(): [Address]
        access(all) fun getAllQuestingStartDates(): {UInt64: UFix64}
        access(all) fun getQuestingStartDate(questingResourceID: UInt64): UFix64?
        access(all) fun getAdjustedQuestingStartDates(): {UInt64: UFix64}
        access(all) fun getAdjustedQuestingStartDate(questingResourceID: UInt64): UFix64?
    }

    access(all) resource Quest: Public {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let questCreator: Address
        access(self) var questers: [Address]
        access(self) var questingStartDates: {UInt64: UFix64}
        access(self) var adjustedQuestingStartDates: {UInt64: UFix64}
        access(self) var rewards: @{UInt64: QuestReward.Collection} // nft.uuid: Rewards

        /*
            Future extensions
        */
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

        /*
            Public functions
        */
        access(all) fun quest(questingResource: @AnyResource, address: Address): @AnyResource {
            pre {
                questingResource.getType() == self.type: "Cannot quest: questingResource type does not match type required by quest"
            }

            // add quester to the list of questers
            self.questers.append(address)

            // add timers
            self.questingStartDates[questingResource.uuid] = getCurrentBlock().timestamp
            self.adjustedQuestingStartDates[questingResource.uuid] = getCurrentBlock().timestamp

            emit QuestStarted(questID: self.id, resourceType: questingResource.getType(), questingResourceID: questingResource.uuid, quester: address)

            return <- questingResource
        }

        access(all) fun unquest(questingResource: @AnyResource): @AnyResource {
            pre {
                self.questingStartDates.keys.contains(questingResource.uuid): "Cannot unquest: questingResource is not currently questing"
            }
            
            // remove timers
            self.questingStartDates.remove(key: questingResource.uuid)
            self.adjustedQuestingStartDates.remove(key: questingResource.uuid)

            emit QuestEnded(questID: self.id, resourceType: questingResource.getType(), questingResourceID: questingResource.uuid)

            return <- questingResource
        }

        access(all) fun getQuesters(): [Address] {
            return self.questers
        }

        access(all) fun getAllQuestingStartDates(): {UInt64: UFix64} {
            return self.questingStartDates
        }

        access(all) fun getQuestingStartDate(questingResourceID: UInt64): UFix64? {
            return self.questingStartDates[questingResourceID]
        }

        access(all) fun getAdjustedQuestingStartDates(): {UInt64: UFix64} {
            return self.adjustedQuestingStartDates
        }

        access(all) fun getAdjustedQuestingStartDate(questingResourceID: UInt64): UFix64? {
            return self.adjustedQuestingStartDates[questingResourceID]
        }

        //todo: add rest of the getters

        /*
            QuestManager functions
        */
        access(all) fun unquestResource(questingResourceID: UInt64) {

        }

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
        access(all) fun borrowQuest(id: UInt64): &Quest{Public}
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

        access(all) fun borrowQuest(id: UInt64): &Questing.Quest{Public}? {
            
        }

        access(all) fun borrowEntireQuest(id: UInt64): &Questing.Quest? {
            return &self.quests[id] as &Questing.Quest?
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