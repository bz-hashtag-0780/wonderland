export const FETCH_STAKED_BEASTS = `
import BasicBeastsNFTStaking from 0xBasicBeastsNFTStaking

pub fun main(acct: Address): [AnyStruct] {
    var stakingCollection: [AnyStruct] = []

    let cap: Capability<&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}>? = getAccount(acct).capabilities.get<&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}>(BasicBeastsNFTStaking.CollectionPublicPath)
    
    var collectionRef:&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}?  = nil
    
    if(cap != nil) {
        collectionRef = cap!.borrow()
    }

    if(collectionRef != nil) {
        let beastIDs = collectionRef!.getIDs()

        for id in beastIDs {
            let borrowedBeast = collectionRef!.borrowBeast(id: id)!
            stakingCollection.append(borrowedBeast)
        }
    }
    return stakingCollection
}
`;
