export const REVEAL_MULTIPLE_QUEST_REWARDS = `
import NonFungibleToken from 0xNonFungibleToken
import Flovatar from 0x921ea449dffec68a
import Questing from 0xQuesting

transaction(questManager: Address, questID: UInt64, IDs: [[UInt64]], maxQuantity: Int) {
    
    let questerRef: &Questing.Quester
    let collectionRef: &Flovatar.Collection

    prepare(signer: AuthAccount) {
        self.questerRef = signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath)??panic("Could not borrow quester reference")

        self.collectionRef = signer.borrow<&Flovatar.Collection>(from: Flovatar.CollectionStoragePath)??panic("Could not borrow collection reference")

    }

    execute {
        let limit = (IDs.length < maxQuantity) ? IDs.length : maxQuantity
        var i = 0

        while i < limit {
            let mappedReward = IDs[i]
            let nft <- self.collectionRef.withdraw(withdrawID: mappedReward[0])

            let nftBack <- self.questerRef.revealReward(questManager: questManager, questID: questID, questingResource: <-nft, questRewardID: mappedReward[1]) as! @NonFungibleToken.NFT

            self.collectionRef.deposit(token: <-nftBack)
            i = i + 1
        }
        
    }
}
`;
