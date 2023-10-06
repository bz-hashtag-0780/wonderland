export const REVEAL_MULTIPLE_QUEST_REWARDS = `
import NonFungibleToken from 0xNonFungibleToken
import BasicBeasts from 0xBasicBeasts
import Questing from 0xQuesting

transaction(questManager: Address, questID: UInt64, IDs: [[UInt64]], maxQuantity: Int) {
    
    let questerRef: &Questing.Quester
    let collectionRef: &BasicBeasts.Collection

    prepare(signer: AuthAccount) {
        self.questerRef = signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath)??panic("Could not borrow quester reference")

        self.collectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath)??panic("Could not borrow collection reference")

    }

    execute {
        let limit = (IDs.length < maxQuantity) ? IDs.length : maxQuantity
        var i = 0

        while i < limit {
            let mappedReward = IDs[i]
            let beast <- self.collectionRef.withdraw(withdrawID: mappedReward[0])

            let beastBack <- self.questerRef.revealReward(questManager: questManager, questID: questID, questingResource: <-beast, questRewardID: mappedReward[1]) as! @NonFungibleToken.NFT

            self.collectionRef.deposit(token: <-beastBack)
            i = i + 1
        }
        
    }
}
`;
