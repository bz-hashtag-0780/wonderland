import BasicBeasts from "../../contracts/utility/BasicBeasts.cdc"
import NonFungibleToken from "../../contracts/utility/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/utility/MetadataViews.cdc"

transaction() {
    prepare(signer: AuthAccount) {
        if signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath) == nil {
			signer.save(<-BasicBeasts.createEmptyCollection(), to: BasicBeasts.CollectionStoragePath)

			signer.capabilities.unpublish(BasicBeasts.CollectionPublicPath)

			let issuedCap = signer.capabilities.storage.issue<&BasicBeasts.Collection{BasicBeasts.BeastCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(BasicBeasts.CollectionStoragePath)

			signer.capabilities.publish(issuedCap, at: BasicBeasts.CollectionPublicPath)
		}

    }
}