export const REVEAL_QUEST_REWARD = `
import NonFungibleToken from 0xNonFungibleToken
import BasicBeasts from 0xBasicBeasts
import Questing from 0xQuesting

transaction(questManager: Address, questID: UInt64, nftID: UInt64, questRewardID: UInt64) {
    
    let questerRef: &Questing.Quester
    let collectionRef: &BasicBeasts.Collection

    prepare(signer: AuthAccount) {
        self.questerRef = signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath)??panic("Could not borrow quester reference")

        self.collectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath)??panic("Could not borrow collection reference")

    }

    execute {
        let beast <- self.collectionRef.withdraw(withdrawID: nftID)

        let beastBack <- self.questerRef.revealReward(questManager: questManager, questID: questID, questingResource: <-beast, questRewardID: questRewardID) as! @NonFungibleToken.NFT

        self.collectionRef.deposit(token: <-beastBack)
    }
}
`;
