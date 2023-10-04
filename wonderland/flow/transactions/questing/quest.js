export const QUEST = `
import NonFungibleToken from 0xNonFungibleToken
import BasicBeasts from 0xBasicBeasts
import Questing from 0xQuesting

transaction(questManager: Address, questID: UInt64, nftID: UInt64) {
    
    let questerRef: &Questing.Quester
    let collectionRef: &BasicBeasts.Collection

    prepare(signer: AuthAccount) {
        // create Quester
        if signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath) == nil {
            signer.save(<-Questing.createQuester(), to: Questing.QuesterStoragePath)
        }

        self.questerRef = signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath)??panic("Could not borrow quester reference")

        self.collectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath)??panic("Could not borrow collection reference")

    }

    execute {
        let beast <- self.collectionRef.withdraw(withdrawID: nftID)

        let resource <- self.questerRef.quest(questManager: questManager, questID: questID, questingResource: <-beast)

        let beastBack: @NonFungibleToken.NFT <- resource as! @NonFungibleToken.NFT

        self.collectionRef.deposit(token: <-beastBack)
    }
}
`;
