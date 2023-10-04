import Questing from "../../contracts/Questing.cdc"

transaction(questID: UInt64, fromID: UInt64, toID: UInt64, rewardID: UInt64) {

    let questManagerRef: &Questing.QuestManager
    let questRef: &Questing.Quest

    prepare(signer: AuthAccount) {

        // borrow Quest Manager reference
        self.questManagerRef = signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath)??panic("Could not borrow Quest Manager reference")
        
        // borrow Quest reference
        self.questRef = self.questManagerRef.borrowEntireQuest(id: questID)??panic("Could not borrow quest reference")

    }

    execute {

        self.questRef.moveReward(fromID: fromID, toID: toID, rewardID: rewardID)

    }

}