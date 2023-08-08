 import BasicBeastsNFTStakingRewards from "../contracts/BasicBeastsNFTStakingRewards.cdc"

transaction(nftID: UInt64, rewardItemID: UInt32) {
    let revealerRef: &BasicBeastsNFTStakingRewards.Revealer

    prepare(signer: AuthAccount) {

        let checkRef = signer.borrow<&BasicBeastsNFTStakingRewards.Revealer>(from: BasicBeastsNFTStakingRewards.RevealerStoragePath)
        
        if(checkRef == nil) {
            signer.save(<-BasicBeastsNFTStakingRewards.createNewRevealer(), to: BasicBeastsNFTStakingRewards.RevealerStoragePath)
        }

        self.revealerRef = signer.borrow<&BasicBeastsNFTStakingRewards.Revealer>(from: BasicBeastsNFTStakingRewards.RevealerStoragePath)!

    }

    execute {
        self.revealerRef.revealRewardItem(nftID: nftID, rewardItemID: rewardItemID)
    }
}