import Questing from "../../contracts/Questing.cdc"
import BasicBeasts from "../../contracts/utility/BasicBeasts.cdc"

transaction() {

    let questManagerRef: &Questing.QuestManager
    let type: Type

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

        // get resource type
        let nftCollectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath)??panic("Couldn't borrow staking collection")

        let beast <- nftCollectionRef.withdraw(withdrawID: 3)

        self.type = beast.getType()

        nftCollectionRef.deposit(token: <-beast)

    }

    execute {
        self.questManagerRef.createQuest(type: self.type)
    }
}