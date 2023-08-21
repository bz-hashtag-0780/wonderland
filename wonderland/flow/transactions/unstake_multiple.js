export const UNSTAKE_MULTIPLE = `
import BasicBeastsNFTStaking from 0xBasicBeastsNFTStaking
import BasicBeasts from 0xBasicBeasts

transaction(IDs: [UInt64]) {

	let stakingCollectionRef: &BasicBeastsNFTStaking.Collection
	let nftCollectionRef: &BasicBeasts.Collection

	prepare(signer: AuthAccount) {

		self.stakingCollectionRef = signer.borrow<&BasicBeastsNFTStaking.Collection>(from: BasicBeastsNFTStaking.CollectionStoragePath)??panic("Couldn't borrow staking collection")

		self.nftCollectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath)??panic("Couldn't borrow staking collection")

	}

	execute {
        var i = 0
        while(i<IDs.length) {
            let nft <-self.stakingCollectionRef.unstake(id: IDs[i])

            self.nftCollectionRef.deposit(token: <-nft)
            i = i + 1
        }

	}
}
`;
