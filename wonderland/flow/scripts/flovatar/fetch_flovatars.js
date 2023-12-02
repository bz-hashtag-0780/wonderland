export const FETCH_FLOVATARS = `
import Flovatar from 0x921ea449dffec68a

pub fun main(acct: Address): [AnyStruct] {
    var collection: [AnyStruct] = []

    let collectionRef = getAccount(acct).getCapability(Flovatar.CollectionPublicPath)
        .borrow<&{Flovatar.CollectionPublic}>()

    if(collectionRef != nil) {
        let IDs = collectionRef!.getIDs()

        for id in IDs {
            let borrowedNFT = collectionRef!.borrowFlovatar(id: id)!
            collection.append(borrowedNFT)
        }
    }
    return collection
}

`;
