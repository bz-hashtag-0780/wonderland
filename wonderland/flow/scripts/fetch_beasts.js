export const FETCH_BEASTS = `
import BasicBeasts from 0xBasicBeasts

pub fun main(acct: Address): [AnyStruct] {
    var beastCollection: [AnyStruct] = []

    let collectionRef = getAccount(acct).getCapability(BasicBeasts.CollectionPublicPath)
        .borrow<&{BasicBeasts.BeastCollectionPublic}>()

    if(collectionRef != nil) {
        let beastIDs = collectionRef!.getIDs()

        for id in beastIDs {
            let borrowedBeast = collectionRef!.borrowBeast(id: id)!
            beastCollection.append(borrowedBeast)
        }
    }
    return beastCollection
}
`;
