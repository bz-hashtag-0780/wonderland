access(all) contract Questing {

    access(all) let QuestManagerPrivatePath: PrivatePath

    access(all) var totalSupply: UInt64

    access(all) resource interface Public {

    }

    access(all) resource Quest: Public {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let questCreator: Address
        access(self) var rewards: @{UInt64: RewardCollection} // nft.uuid: Rewards
        access(self) var metadata: {String: AnyStruct}
        access(self) var resources: @{String: AnyResource}

        init(type: Type, questCreator: Address) {
            self.id = self.uuid
            self.type = type
            self.questCreator = questCreator
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

        access(all) fun moveReward() {}

        destroy() {
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

        access(all) fun getIDs(): [UInt64] {
            return self.quests.keys
        }

        destroy() {
            destroy self.quests
        }

    }

    access(all) fun getQuest(type: Type, admin: Address, id: UInt64): &Quest? {
        let key = type.identifier.concat(admin.toString().concat(id.toString()))

        return self.quests[key]
    }

    access(all) fun addQuest(quest: Quest) {
        self.quests[Questing.getKey(quest: quest)] = quest
    }

    access(all) fun getKey(quest: Quest): String {
        return quest.type.identifier.concat(quest.admin.toString().concat(quest.id.toString()))
    }

    access(all) fun getAdminQuestIDs(admin: Address): [UInt64]? {
        return self.adminQuestIDs[admin]
    }

    init() {
        self.totalSupply = 0
    }
}