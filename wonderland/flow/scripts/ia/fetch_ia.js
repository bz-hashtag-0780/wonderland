export const FETCH_IA = `
import InceptionAvatar from 0x83ed64a1d4f3833f

pub fun main(acct: Address): [AnyStruct] {
    var collection: [AnyStruct] = []

    let collectionRef = getAccount(acct).getCapability(InceptionAvatar.CollectionPublicPath)
        .borrow<&{InceptionAvatar.InceptionAvatarCollectionPublic}>()

    if(collectionRef != nil) {
        let IDs = collectionRef!.getIDs()

        for id in IDs {
            let borrowedNFT = collectionRef!.borrowInceptionAvatar(id: id)!
            collection.append(borrowedNFT)
        }
    }
    return collection
}

`;
