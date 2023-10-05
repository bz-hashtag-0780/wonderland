import Questing from "../../contracts/Questing.cdc"

access(all) fun main(questManager: Address, questID: UInt64): [UInt64] {
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

    var IDs: [UInt64] = []
    var adjustedQuestingDates = questRef!.getAllAdjustedQuestingStartDates()
    var currentBlockTimestamp = getCurrentBlock().timestamp

    for id in adjustedQuestingDates.keys {
        let timeQuested = currentBlockTimestamp - adjustedQuestingDates[id]!

        if timeQuested >= questRef!.rewardPerSecond {
            IDs.append(id)
        }
    }
    
    return IDs
}