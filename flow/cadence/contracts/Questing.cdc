access(all) contract Questing {

    access(all) var totalSupply: UInt64

    access(all) resource Quest {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let admin: Address
        access(self) var rewards: @{UInt64: RewardCollection} // nft.uuid: Rewards
        access(self) var metadata: {String: AnyStruct}
        access(self) var resources: @{String: AnyResource}

        init(type: Type, admin: Address) {
            self.type = type
            self.admin = admin
            let id: [UInt64] = Questing.getAdminQuestIDs(admin: admin) == nil ? Questing.getAdminQuestIDs(admin: admin)! : []
            self.id = UInt64(id.length)
            self.rewards <- {}
            self.metadata = {}
            self.resources <- {}
        }

        access(all) fun quest() {}

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

    //todo: update contract to store the quests on user accounts instead
    access(all) resource QuestManager {
        access(self) var quests: @{String: Quest}
        access(self) var questIDs: [UInt64]

        init() {
            self.quests <- {}
            self.questIDs = []
        }

        access(all) fun createQuest() {
        }

        access(all) fun transferQuest() {

        }

        access(all) fun destroyQuest() {

        }

        access(all) fun borrowQuest() {

        }

        access(all) fun getQuestKeys(): [String] {
            return self.quests.keys
        }

        access(all) fun getQuestIDs(): [UInt64] {
            return self.questIDs
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