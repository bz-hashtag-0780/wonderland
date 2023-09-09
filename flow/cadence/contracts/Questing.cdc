access(all) contract Questing {

    access(self) var quests: {String: Quest}
    access(self) var adminQuestIDs: {Address: [UInt32]}

    access(all) struct Quest {
        access(all) let id: UInt32
        access(all) let type: Type
        access(all) let admin: Address

        init(type: Type, admin: Address) {
            self.type = type
            self.admin = admin
            let id: [UInt32] = Questing.getAdminQuestIDs(admin: admin) == nil ? Questing.getAdminQuestIDs(admin: admin)! : []
            self.id = UInt32(id.length)
        }
    }

    access(all) fun getQuest(type: Type, admin: Address, id: UInt32): Quest? {
        let key = type.identifier.concat(admin.toString().concat(id.toString()))

        return self.quests[key]
    }

    access(all) fun addQuest(quest: Quest) {
        self.quests[Questing.getKey(quest: quest)] = quest
    }

    access(all) fun getKey(quest: Quest): String {
        return quest.type.identifier.concat(quest.admin.toString().concat(quest.id.toString()))
    }

    access(all) fun getAdminQuestIDs(admin: Address): [UInt32]? {
        return self.adminQuestIDs[admin]
    }

    init() {
        self.quests = {}
        self.adminQuestIDs = {}
    }
}