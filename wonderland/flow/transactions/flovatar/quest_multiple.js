export const QUEST_MULTIPLE = `
import NonFungibleToken from 0xNonFungibleToken
import Flovatar from 0x921ea449dffec68a
import Questing from 0xQuesting

transaction(questManager: Address, questID: UInt64, IDs: [UInt64], maxQuantity: Int) {
    
    let questerRef: &Questing.Quester
    let collectionRef: &Flovatar.Collection

    prepare(signer: AuthAccount) {
        // create Quester
        if signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath) == nil {
            signer.save(<-Questing.createQuester(), to: Questing.QuesterStoragePath)
        }

        self.questerRef = signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath)??panic("Could not borrow quester reference")

        self.collectionRef = signer.borrow<&Flovatar.Collection>(from: Flovatar.CollectionStoragePath)??panic("Could not borrow collection reference")

    }

    execute {
        
        let limit = (IDs.length < maxQuantity) ? IDs.length : maxQuantity
        var i = 0

        while i < limit {
            let nft <- self.collectionRef.withdraw(withdrawID: IDs[i])

            let resource <- self.questerRef.quest(questManager: questManager, questID: questID, questingResource: <-nft)

            let nft <- resource as! @NonFungibleToken.NFT

            self.collectionRef.deposit(token: <-nft)

            i = i + 1
        }

    }
}
`;
