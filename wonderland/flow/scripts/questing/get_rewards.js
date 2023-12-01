// uncomment for testnet

export const GET_REWARDS = `
import Questing from 0xQuesting
import QuestReward from 0xQuestReward

pub fun main(questManager: Address, questID: UInt64): {UInt64: &QuestReward.Collection{QuestReward.CollectionPublic}} {
    // borrow quest manager reference
    // var questManagerRef: &Questing.QuestManager{Questing.QuestManagerPublic}?  = nil
    // if let cap = getAccount(questManager).capabilities.get<&Questing.QuestManager{Questing.QuestManagerPublic}>(Questing.QuestManagerPublicPath) {
    //     questManagerRef = cap.borrow()
    // }

    // var questRef: &Questing.Quest{Questing.Public}? = nil

    // if(questManagerRef != nil) {
    //     questRef = questManagerRef!.borrowQuest(id: questID)
    // }

    // assert(questRef != nil, message: "Quest does not exist")


    var questRef: &Questing.Quest{Questing.Public}? = nil

    if let questManagerRef = getAccount(questManager).getCapability<&Questing.QuestManager{Questing.QuestManagerPublic}>(Questing.QuestManagerPublicPath).borrow() {
        questRef = questManagerRef.borrowQuest(id: questID)
    }

    assert(questRef != nil, message: "Quest does not exist")

    let IDs = questRef!.getQuestingResourceIDs()

    let collections: {UInt64: &QuestReward.Collection{QuestReward.CollectionPublic}} = {}

    for id in IDs {
        collections[id] = questRef!.borrowRewardCollection(questingResourceID: id)!
    }

    return collections
}
`;
