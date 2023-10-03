import QuestReward from "../../contracts/QuestReward.cdc"
import Questing from "../../contracts/Questing.cdc"

pub fun main(questManager: Address, minterID: UInt64): {UInt32: QuestReward.RewardTemplate} {
    // borrow quest manager reference
    var questManagerRef: &Questing.QuestManager{Questing.QuestManagerPublic}?  = nil
    if let cap = getAccount(questManager).capabilities.get<&Questing.QuestManager{Questing.QuestManagerPublic}>(Questing.QuestManagerPublicPath) {
        questManagerRef = cap.borrow()
    }

    // borrow minter reference
    var minterRef: &QuestReward.Minter{QuestReward.MinterPublic}? = nil

    if(questManagerRef != nil) {
        minterRef = questManagerRef!.borrowMinter(id: minterID)
    }

    return minterRef!.getRewardTemplates()
}