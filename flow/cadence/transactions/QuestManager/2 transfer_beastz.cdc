import BasicBeasts from "../../contracts/utility/BasicBeasts.cdc"

transaction(id: UInt64, receiver: Address) {
    prepare(signer: AuthAccount) {
        let collectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath) ?? panic("Could not borrow a reference to the NFT Collection")
        let nft <- collectionRef.withdraw(withdrawID: id)

        let receiverRef = getAccount(receiver)
            .getCapability<&BasicBeasts.Collection{BasicBeasts.BeastCollectionPublic}>(BasicBeasts.CollectionPublicPath)
            .borrow()
            ?? panic("Could not borrow a receiver reference to the NFT Collection")
        
        receiverRef.deposit(token: <-nft)
    }
}