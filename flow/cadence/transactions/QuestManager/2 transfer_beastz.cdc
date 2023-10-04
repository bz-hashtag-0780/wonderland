import BasicBeasts from "../../contracts/utility/BasicBeasts.cdc"

transaction(id: UInt64, receiver: Address) {
    var receiverRef: &BasicBeasts.Collection{BasicBeasts.BeastCollectionPublic}?

    prepare(signer: AuthAccount) {
        let collectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath) ?? panic("Could not borrow a reference to the NFT Collection")
        let nft <- collectionRef.withdraw(withdrawID: id)

        self.receiverRef = nil

        if let cap = getAccount(receiver).capabilities.get<&BasicBeasts.Collection{BasicBeasts.BeastCollectionPublic}>(BasicBeasts.CollectionPublicPath) {
                self.receiverRef = cap.borrow()
        }

        self.receiverRef!.deposit(token: <-nft)
    }
}