export const UNSTAKE = `
import BasicBeastsNFTStaking from 0xBasicBeastsNFTStaking
import BasicBeasts from 0xBasicBeasts

transaction(nftID: UInt64) {

	let stakingCollectionRef: &BasicBeastsNFTStaking.Collection
	let nftCollectionRef: &BasicBeasts.Collection

	prepare(signer: AuthAccount) {

		self.stakingCollectionRef = signer.borrow<&BasicBeastsNFTStaking.Collection>(from: BasicBeastsNFTStaking.CollectionStoragePath)??panic("Couldn't borrow staking collection")

		self.nftCollectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath)??panic("Couldn't borrow staking collection")

	}

	execute {

		let nft <-self.stakingCollectionRef.unstake(id: nftID)

		self.nftCollectionRef.deposit(token: <-nft)

	}
}
`;
