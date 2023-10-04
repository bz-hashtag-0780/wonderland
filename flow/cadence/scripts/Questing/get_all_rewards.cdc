import Questing from "../../contracts/Questing.cdc"
import QuestReward from "../../contracts/QuestReward.cdc"

pub fun main(questManager: Address, questID: UInt64): [&QuestReward.Collection{QuestReward.CollectionPublic}] {
    // borrow quest manager reference
    var questManagerRef: &Questing.QuestManager{Questing.QuestManagerPublic}?  = nil
    if let cap = getAccount(questManager).capabilities.get<&Questing.QuestManager{Questing.QuestManagerPublic}>(Questing.QuestManagerPublicPath) {
        questManagerRef = cap.borrow()
    }

    // borrow quest reference
    var questRef: &Questing.Quest{Questing.Public}? = nil

    if(questManagerRef != nil) {
        questRef = questManagerRef!.borrowQuest(id: questID)
    }

    assert(questRef != nil, message: "Quest does not exist")

    let IDs = questRef!.getQuestingResourceIDs()

    let collections: [&QuestReward.Collection{QuestReward.CollectionPublic}] = []

    for id in IDs {
        collections.append(questRef!.borrowRewardCollection(questingResourceID: id)!)
    }

    return collections
}