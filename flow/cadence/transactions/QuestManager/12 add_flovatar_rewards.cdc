import Questing from "../../contracts/Questing.cdc"
import QuestReward from "../../contracts/QuestReward.cdc"
import WonderPartnerRewardAlgorithm from "../../contracts/WonderPartnerRewardAlgorithm.cdc"

transaction(questID: UInt64, minterID: UInt64, IDs: [UInt64]) {
		
    let questManagerRef: &Questing.QuestManager
    let questRef: &Questing.Quest
    let minterRef: &QuestReward.Minter

    prepare(signer: AuthAccount) {

        // borrow Quest Manager reference
        self.questManagerRef = signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath)??panic("Could not borrow Quest Manager reference")
        
        self.questRef = self.questManagerRef.borrowEntireQuest(id: questID)??panic("Could not borrow quest reference")

        self.minterRef = self.questManagerRef.borrowEntireMinter(id: minterID)??panic("Could not borrow minter reference")
    }

    execute {
        let rewardMapping: {Int: UInt32} = {
            1: 5,
            2: 6,
            3: 7,
            4: 8
        }

        for id in IDs {
            self.questRef.addReward(questingResourceID: id, 
                                    minter: self.minterRef, 
                                    rewardAlgo: WonderPartnerRewardAlgorithm.borrowAlgorithm(), 
                                    rewardMapping: rewardMapping)
        }
    }

}