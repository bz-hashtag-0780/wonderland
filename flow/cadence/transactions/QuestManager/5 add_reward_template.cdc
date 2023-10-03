import Questing from "../../contracts/Questing.cdc"
import QuestReward from "../../contracts/QuestReward.cdc"

transaction(minterID: UInt64) {

    let questManagerRef: &Questing.QuestManager
    let minterRef: &QuestReward.Minter

    prepare(signer: AuthAccount) {
        // borrow Quest Manager reference
        self.questManagerRef = signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath)??panic("Could not borrow Quest Manager reference")

        // borrow Minter reference
        self.minterRef = self.questManagerRef.borrowEntireMinter(id: minterID)??panic("Could not borrow Minter reference")
    }

    execute {
        // add reward templates
        self.minterRef.addRewardTemplate(name: "Sushi", description: "sushi is a beastz favorite food", image: "")
        self.minterRef.addRewardTemplate(name: "Ice Cream", description: "gang gang ice cream so good", image: "")
        self.minterRef.addRewardTemplate(name: "Noodles", description: "itadakimasu!", image: "")
        self.minterRef.addRewardTemplate(name: "Empty Bottle", description: "sometimes you need it to be empty to fill it with something, sweet", image: "")
        self.minterRef.addRewardTemplate(name: "Poop", description: "it's eco-friendly due to proof of stake", image: "")
    }

}