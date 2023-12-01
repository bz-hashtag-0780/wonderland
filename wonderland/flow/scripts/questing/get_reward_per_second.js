// uncomment for testnet

export const GET_REWARD_PER_SECOND = `
import Questing from 0xQuesting

access(all) fun main(questManager: Address, questID: UInt64): UFix64 {
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
    
    return questRef!.rewardPerSecond
}
`;
