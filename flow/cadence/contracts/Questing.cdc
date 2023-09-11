access(all) contract Questing {

    access(all) var totalSupply: UInt64
    access(self) var quests: {String: Quest}
    access(self) var adminQuestIDs: {Address: [UInt64]}

    access(all) struct Quest {
        access(all) let id: UInt64
        access(all) let type: Type
        access(all) let admin: Address

        init(type: Type, admin: Address) {
            self.type = type
            self.admin = admin
            let id: [UInt64] = Questing.getAdminQuestIDs(admin: admin) == nil ? Questing.getAdminQuestIDs(admin: admin)! : []
            self.id = UInt64(id.length)
        }
    }

    //todo: update contract to store the quests on user accounts instead
    access(all) resource QuestManager {
        access(self) var quests: {String: Quest}
        access(self) var questIDs: [UInt64]
        access(self) var questRewards: @{UInt64: Bins} //NFTid: Bin

        init() {
            self.quests = {}
            self.questIDs = []
            self.questRewards = {}
        }
    }


    access(all) resource QuestsContainer {
        access(all) let quest: Quest

        init(quest: Quest) {
            self.quest = quest
        }
    }

    access(all) fun getQuest(type: Type, admin: Address, id: UInt64): Quest? {
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
        self.quests = {}
        self.adminQuestIDs = {}
    }
}