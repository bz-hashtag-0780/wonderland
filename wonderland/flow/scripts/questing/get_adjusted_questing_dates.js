export const GET_ADJUSTED_QUESTING_DATES = `
import Questing from "../../contracts/Questing.cdc"

pub fun main(questManager: Address, questID: UInt64): {UInt64: UFix64} {
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

    return questRef!.getAllAdjustedQuestingStartDates()
}
`;
