export const REVEAL_QUEST_REWARD = `
import NonFungibleToken from 0xNonFungibleToken
import Flovatar from 0x921ea449dffec68a
import Questing from 0xQuesting

transaction(questManager: Address, questID: UInt64, nftID: UInt64, questRewardID: UInt64) {
    
    let questerRef: &Questing.Quester
    let collectionRef: &Flovatar.Collection

    prepare(signer: AuthAccount) {
        self.questerRef = signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath)??panic("Could not borrow quester reference")

        self.collectionRef = signer.borrow<&Flovatar.Collection>(from: Flovatar.CollectionStoragePath)??panic("Could not borrow collection reference")

    }

    execute {
        let flovatar <- self.collectionRef.withdraw(withdrawID: nftID)

        let nftBack <- self.questerRef.revealReward(questManager: questManager, questID: questID, questingResource: <-flovatar, questRewardID: questRewardID) as! @NonFungibleToken.NFT

        self.collectionRef.deposit(token: <-nftBack)
    }
}
`;
