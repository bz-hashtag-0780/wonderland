import Questing from "../../contracts/Questing.cdc"
import QuestReward from "../../contracts/QuestReward.cdc"

transaction(minterName: String) {

    let questManagerRef: &Questing.QuestManager

    prepare(signer: AuthAccount) {

        // create Quest Manager
        if signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath) == nil {
            signer.save(<-Questing.createQuestManager(), to: Questing.QuestManagerStoragePath)

            signer.capabilities.unpublish(Questing.QuestManagerPublicPath)

			let issuedCap = signer.capabilities.storage.issue<&Questing.QuestManager{Questing.QuestManagerPublic}>(Questing.QuestManagerStoragePath)

			signer.capabilities.publish(issuedCap, at: Questing.QuestManagerPublicPath)
        }

        // borrow Quest Manager reference
        self.questManagerRef = signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath)??panic("Could not borrow Quest Manager reference")
        
    }

    execute {
        // create and deposit minter
        self.questManagerRef.depositMinter(minter: <-QuestReward.createMinter(name: minterName))
    }

}