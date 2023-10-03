import NonFungibleToken from "../../contracts/utility/NonFungibleToken.cdc"
import BasicBeasts from "../../contracts/utility/BasicBeasts.cdc"
import Questing from "../../contracts/Questing.cdc"

transaction(questManager: Address, questID: UInt64, nftID: UInt64) {
    
    let questerRef: &Questing.Quester
    let collectionRef: &BasicBeasts.Collection

    prepare(signer: AuthAccount) {
        self.questerRef = signer.borrow<&Questing.Quester>(from: Questing.QuesterStoragePath)??panic("Could not borrow quester reference")

        self.collectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath)??panic("Could not borrow collection reference")

    }

    execute {
        let beast <- self.collectionRef.withdraw(withdrawID: nftID)

        let beastBack <- self.questerRef.unquest(questManager: questManager, questID: questID, questingResource: <-beast) as! @NonFungibleToken.NFT

        self.collectionRef.deposit(token: <-beastBack)
    }
}