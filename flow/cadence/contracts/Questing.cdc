
import QuestReward from "./QuestReward.cdc"
import NonFungibleToken from "./utility/NonFungibleToken.cdc"
import RewardAlgorithm from "./RewardAlgorithm.cdc"

access(all) contract Questing {

    // -----------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------
    access(all) event ContractInitialized()
    access(all) event QuestStarted(questID: UInt64, resourceType: Type, questingResourceID: UInt64, quester: Address)
    access(all) event QuestEnded(questID: UInt64, resourceType: Type, questingResourceID: UInt64)
    access(all) event RewardAdded(questID: UInt64, resourceType: Type, questingResourceID: UInt64, rewardID: UInt64, rewardTemplateID: UInt32, rewardTemplate: QuestReward.RewardTemplate)
    access(all) event RewardBurned(questID: UInt64, resourceType: Type, questingResourceID: UInt64, rewardID: UInt64, rewardTemplateID: UInt32, minterID: UInt64)
    access(all) event RewardMoved(questID: UInt64, resourceType: Type, fromQuestingResourceID: UInt64, toQuestingResourceID: UInt64, rewardID: UInt64, rewardTemplateID: UInt32, minterID: UInt64)
    access(all) event RewardPerSecondChanged(questID: UInt64, resourceType: Type, rewardPerSecond: UFix64)
    access(all) event AdjustedQuestingStartDateUpdated(questID: UInt64, resourceType: Type, questingResourceID: UInt64, newAdjustedQuestingStartDate: UFix64)
    access(all) event QuestCreated(questID: UInt64, type: Type, questCreator: Address)
    //todo emit events
    access(all) event QuestDeposited(questID: UInt64, type: Type, questCreator: Address, questReceiver: Address?)
    access(all) event QuestWithdrawn(questID: UInt64, type: Type, questCreator: Address)
    access(all) event QuestDestroyed(questID: UInt64, type: Type, questCreator: Address)
    access(all) event MinterDeposited(minterID: UInt64, type: Type, receiverAddress: Address?)
    access(all) event MinterWithdrawn(minterID: UInt64, type: Type, providerAddress: Address?)

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
    
    // -----------------------------------------------------------------------
    // Future Contract Extensions
    // -----------------------------------------------------------------------
    access(self) var metadata: {String: AnyStruct}
    access(self) var resources: @{String: AnyResource}

    access(all) resource interface Public {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let questCreator: Address
        access(all) var rewardPerSecond: UFix64
        access(all) fun quest(questingResource: @AnyResource, address: Address): @AnyResource
        access(all) fun unquest(questingResource: @AnyResource): @AnyResource
        access(all) fun getQuesters(): [Address]
        access(all) fun getAllQuestingStartDates(): {UInt64: UFix64}
        access(all) fun getQuestingStartDate(questingResourceID: UInt64): UFix64?
        access(all) fun getAllAdjustedQuestingStartDates(): {UInt64: UFix64}
        access(all) fun getAdjustedQuestingStartDate(questingResourceID: UInt64): UFix64?
        access(all) fun getQuestingResourceIDs(): [UInt64]
        access(all) fun borrowRewardCollection(questingResourceID: UInt64): &QuestReward.Collection?
    }

    access(all) resource Quest: Public {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let questCreator: Address
        access(self) var questers: [Address]
        access(self) var questingStartDates: {UInt64: UFix64}
        access(self) var adjustedQuestingStartDates: {UInt64: UFix64}

        /*
            Questing Rewards
        */
        access(all) var rewardPerSecond: UFix64
        access(self) var rewards: @{UInt64: QuestReward.Collection}

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
            self.rewardPerSecond = 604800.0
            self.rewards <- {}
            self.metadata = {}
            self.resources <- {}

            Questing.totalSupply = Questing.totalSupply + 1

            emit QuestCreated(questID: self.id, type: type, questCreator: questCreator)
        }

        /*
            Public functions
        */
        access(all) fun quest(questingResource: @AnyResource, address: Address): @AnyResource {
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

            // ensure we always have a UUID by this point
            assert(uuid != nil, message: "UUID should not be nil")

            assert(self.questingStartDates.keys.contains(uuid!), message: "Cannot unquest: questingResource is not currently questing")
            
            self.unquestResource(questingResourceID: uuid!)

            let returnResource <- container.remove(key: 0)!

            destroy container

            emit QuestEnded(questID: self.id, resourceType: self.type, questingResourceID: uuid!)

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

        access(all) fun getAllAdjustedQuestingStartDates(): {UInt64: UFix64} {
            return self.adjustedQuestingStartDates
        }

        access(all) fun getAdjustedQuestingStartDate(questingResourceID: UInt64): UFix64? {
            return self.adjustedQuestingStartDates[questingResourceID]
        }

        access(all) fun getQuestingResourceIDs(): [UInt64] {
            return self.rewards.keys
        }

        access(all) fun borrowRewardCollection(questingResourceID: UInt64): &QuestReward.Collection? {
            return &self.rewards[questingResourceID] as &QuestReward.Collection?
        }

        /*
            QuestManager functions
        */
        access(all) fun unquestResource(questingResourceID: UInt64) {
            // remove timers
            self.questingStartDates.remove(key: questingResourceID)
            self.adjustedQuestingStartDates.remove(key: questingResourceID)

            emit QuestEnded(questID: self.id, resourceType: self.type, questingResourceID: questingResourceID)
        }

        access(all) fun addReward(questingResourceID: UInt64, minter: &QuestReward.Minter, rewardAlgo: &AnyResource{RewardAlgorithm.Algorithm}, RewardMapping: {Int: UInt32}) {
            //check if resource is questing
            if let adjustedQuestingStartDate = self.adjustedQuestingStartDates[questingResourceID] {
                let timeQuested = getCurrentBlock().timestamp - adjustedQuestingStartDate 

                //check if resource is eligible for reward
                if(timeQuested >= self.rewardPerSecond) {
                    let rewardTemplateID = RewardMapping[rewardAlgo.randomAlgorithm()] ?? panic("RewardMapping does not contain a reward for the random algorithm")
                    
                    var newReward <- minter.mintReward(rewardTemplateID: rewardTemplateID)

                    let rewardID = newReward.id

                    let toRef: &QuestReward.Collection? = &self.rewards[questingResourceID] as &QuestReward.Collection?

                    if(toRef == nil) {
                        let newCollection <- QuestReward.createEmptyCollection()
                        newCollection.deposit(token: <-newReward)
                        self.rewards[questingResourceID] <-! newCollection as! @QuestReward.Collection
                    } else {
                        toRef!.deposit(token: <-newReward)
                    }

                    self.updateAdjustedQuestingStartDate(questingResourceID: questingResourceID, rewardPerSecond: self.rewardPerSecond)

                    emit RewardAdded(questID: self.id, resourceType: self.type, questingResourceID: questingResourceID, rewardID: rewardID, rewardTemplateID: rewardTemplateID, rewardTemplate: minter.getRewardTemplate(id: rewardTemplateID)!)

                }
                
            }
            
        }

        access(all) fun burnReward(questingResourceID: UInt64, rewardID: UInt64) {
            let collectionRef = &self.rewards[questingResourceID] as &QuestReward.Collection?

            assert(collectionRef != nil, message: "Cannot burn reward: questingResource does not have any rewards")

            let reward <- collectionRef!.withdraw(withdrawID: rewardID) as! @QuestReward.NFT

            emit RewardBurned(questID: self.id, resourceType: self.type, questingResourceID: questingResourceID, rewardID: rewardID, rewardTemplateID: reward.rewardTemplateID, minterID: reward.minterID)

            destroy reward
            
        }

        access(all) fun moveReward(fromID: UInt64, toID: UInt64, rewardID: UInt64) {
            let fromRef = &self.rewards[fromID] as &QuestReward.Collection?
            assert(fromRef != nil, message: "Cannot move reward: fromID does not have any rewards")

            let toRef: &QuestReward.Collection? = &self.rewards[toID] as &QuestReward.Collection?
            assert(toRef != nil, message: "Cannot move reward: toID does not have any rewards")

            let reward <- fromRef!.withdraw(withdrawID: rewardID) as! @QuestReward.NFT

            emit RewardMoved(questID: self.id, resourceType: self.type, fromQuestingResourceID: fromID, toQuestingResourceID: toID, rewardID: rewardID, rewardTemplateID: reward.rewardTemplateID, minterID: reward.minterID)

            toRef!.deposit(token: <-reward)
        }

        access(all) fun changeRewardPerSecond(seconds: UFix64) {
            self.rewardPerSecond = seconds
            emit RewardPerSecondChanged(questID: self.id, resourceType: self.type, rewardPerSecond: seconds)
        }

        access(contract) fun updateAdjustedQuestingStartDate(questingResourceID: UInt64, rewardPerSecond: UFix64) {
            if(self.adjustedQuestingStartDates[questingResourceID] != nil) {
                self.adjustedQuestingStartDates[questingResourceID] = self.adjustedQuestingStartDates[questingResourceID]! + rewardPerSecond

                emit AdjustedQuestingStartDateUpdated(questID: self.id, resourceType: self.type, questingResourceID: questingResourceID, newAdjustedQuestingStartDate: self.adjustedQuestingStartDates[questingResourceID]!)
            }
        }

        destroy() {
            destroy self.rewards
            destroy self.resources
        }
    
    }

    access(all) resource interface MinterReceiver {
        access(all) fun depositMinter(minter: @QuestReward.Minter)
    }

    access(all) resource interface QuestManagerPublic {
        access(all) fun getIDs(): [UInt64]
        access(all) fun getMinterIDs(): [UInt64]
        access(all) fun borrowQuest(id: UInt64): &Quest{Public}? { 
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Quest reference: The ID of the returned reference is incorrect"
            }
        }
        access(all) fun borrowMinter(id: UInt64): &QuestReward.Minter{QuestReward.MinterPublic}? { 
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Minter reference: The ID of the returned reference is incorrect"
            }
        }
    }

    access(all) resource QuestManager: QuestManagerPublic, MinterReceiver {
        access(self) var quests: @{UInt64: Quest}
        access(self) var minters: @{UInt64: QuestReward.Minter}

        init() {
            self.quests <- {}
            self.minters <- {}
        }

        access(all) fun getIDs(): [UInt64] {
            return self.quests.keys
        }

        access(all) fun getMinterIDs(): [UInt64] {
            return self.minters.keys
        }

        access(all) fun createQuest(type: Type) {
            let quest <- create Quest(type: type, questCreator: self.owner!.address)
            let id = quest.id
            self.quests[id] <-! quest
        }

        access(all) fun depositQuest(quest: @Quest) {
            self.quests[quest.id] <-! quest
        }

        access(all) fun withdrawQuest(id: UInt64): @Quest {
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

        access(all) fun depositMinter(minter: @QuestReward.Minter) {
            self.minters[minter.id] <-! minter
        }

        access(all) fun withdrawMinter(id: UInt64): @QuestReward.Minter {
            let minter <- self.minters.remove(key: id) ?? panic("Minter does not exist")
            return <- minter
        }

        access(all) fun borrowMinter(id: UInt64): &QuestReward.Minter{QuestReward.MinterPublic}? {
            return &self.minters[id] as &QuestReward.Minter{QuestReward.MinterPublic}?
        }

        destroy() {
            destroy self.quests
            destroy self.minters
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

        self.metadata = {}
        self.resources <- {}

        emit ContractInitialized()
    }
}