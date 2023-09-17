
import QuestReward from "./QuestReward.cdc"
import NonFungibleToken from "./utility/NonFungibleToken.cdc"

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
        access(contract) fun quest(questingResource: @AnyResource, address: Address): @AnyResource
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
        access(contract) fun quest(questingResource: @AnyResource, address: Address): @AnyResource {
            pre {
                questingResource.getType() == self.type: "Cannot quest: questingResource type does not match type required by quest"
            }
            var uuid: UInt64? = nil
            var container: @{UInt64: AnyResource} <- {}
            container[0] <-! questingResource

            if (container[0]?.isInstance(Type<@NonFungibleToken.NFT>()) == true) {
                let ref = &container[0] as auth &AnyResource?
                let resource = ref as! &NonFungibleToken.NFT
                uuid = resource.uuid
            }

            // ensure we always have a UUID by this point
            assert(uuid != nil, message: "UUID should not be nil")

            // add quester to the list of questers
            self.questers.append(address)

            // add timers
            self.questingStartDates[uuid!] = getCurrentBlock().timestamp
            self.adjustedQuestingStartDates[uuid!] = getCurrentBlock().timestamp

            emit QuestStarted(questID: self.id, resourceType: self.type, questingResourceID: uuid!, quester: address)

            let returnResource <- container.remove(key: 0)!
            destroy container

            return <- returnResource
        }

        access(all) fun unquest(questingResource: @AnyResource): @AnyResource {

            var uuid: UInt64? = nil
            var container: @{UInt64: AnyResource} <- {}
            container[0] <-! questingResource

            if (container[0]?.isInstance(Type<@NonFungibleToken.NFT>()) == true) {
                let ref = &container[0] as auth &AnyResource?
                let resource = ref as! &NonFungibleToken.NFT
                uuid = resource.uuid
            }

            assert(self.questingStartDates.keys.contains(uuid!), message: "Cannot unquest: questingResource is not currently questing")
            
            self.unquestResource(questingResourceID: uuid!)

            let returnResource <- container.remove(key: 0)!
            destroy container

            return <- returnResource
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
            // remove timers
            self.questingStartDates.remove(key: questingResourceID)
            self.adjustedQuestingStartDates.remove(key: questingResourceID)

            emit QuestEnded(questID: self.id, resourceType: self.type, questingResourceID: questingResourceID)
        }

        access(all) fun addReward() {

        }

        access(all) fun burnReward(questingResourceID: UInt64, rewardID: UInt64) {
            let collectionRef = &self.rewards[questingResourceID] as &QuestReward.Collection?
            assert(collectionRef != nil, message: "Cannot burn reward: questingResource does not have any rewards")
            let reward <- collectionRef!.withdraw(withdrawID: rewardID)
            destroy reward
            
        }

        access(all) fun moveReward() {

        }

        access(self) fun randomReward(): Int {
            // Generate a random number between 0 and 100_000_000
            let randomNum = Int(unsafeRandom() % 100_000_000)
            
            let threshold1 = 69_000_000 // for 69%
            let threshold2 = 87_000_000 // for 18%, cumulative 87%
            let threshold3 = 95_000_000 // for 8%, cumulative 95%
            let threshold4 = 99_000_000 // for 4%, cumulative 99%
            
            // Return reward based on generated random number
            if randomNum < threshold1 { return 1 }
            else if randomNum < threshold2 { return 2 }
            else if randomNum < threshold3 { return 3 }
            else if randomNum < threshold4 { return 4 }
            else { return 5 } // for remaining 1%
        }

        destroy() {
            destroy self.rewards
            destroy self.resources
        }
    
    }

    access(all) resource interface QuestManagerPublic {
        access(all) fun borrowQuest(id: UInt64): &Quest{Public}? { 
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Quest reference: The ID of the returned reference is incorrect"
            }
        }
    }

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

        access(all) fun transferQuest(id: UInt64): @Quest {
            let quest <- self.quests.remove(key: id) ?? panic("Quest does not exist")
            return <- quest
        }

        access(all) fun destroyQuest(id: UInt64) {
            let quest <- self.quests.remove(key: id) ?? panic("Quest does not exist")
            destroy quest
        }

        access(all) fun borrowQuest(id: UInt64): &Questing.Quest{Public}? {
            return &self.quests[id] as &Questing.Quest{Public}?
        }

        access(all) fun borrowEntireQuest(id: UInt64): &Questing.Quest? {
            return &self.quests[id] as &Questing.Quest?
        }

        destroy() {
            destroy self.quests
        }

    }

    access(all) resource Quester {

        access(all) fun quest(questManager: Address, questID: UInt64, questingResource: @AnyResource): @AnyResource {

            let questRef = Questing.getQuest(questManager: questManager, id: questID)

            assert(questRef != nil, message: "Quest reference should not be nil")

            return <- questRef!.quest(questingResource: <-questingResource, address: self.owner!.address)
        }

        access(all) fun unquest(questManager: Address, questID: UInt64, questingResource: @AnyResource): @AnyResource {

            let questRef = Questing.getQuest(questManager: questManager, id: questID)

            assert(questRef != nil, message: "Quest reference should not be nil")

            return <- questRef!.unquest(questingResource: <-questingResource)
        }

    }

    access(all) fun getQuest(questManager: Address, id: UInt64): &Quest{Public}? {
        var questManagerRef: &QuestManager{QuestManagerPublic}?  = nil

        if let cap = getAccount(questManager).capabilities.get<&Questing.QuestManager{Questing.QuestManagerPublic}>(Questing.QuestManagerPublicPath) {
            questManagerRef = cap.borrow()
        }

        var questRef: &Quest{Public}? = nil

        if(questManagerRef != nil) {
            questRef = questManagerRef!.borrowQuest(id: id)
        }

        return questRef
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