 import BasicBeastsNFTStakingRewards from "../contracts/BasicBeastsNFTStakingRewards.cdc"
transaction(IDs: [{UInt64:UInt32}], maxQuantity: Int) {
    let revealerRef: &BasicBeastsNFTStakingRewards.Revealer

    prepare(signer: AuthAccount) {

        let checkRef = signer.borrow<&BasicBeastsNFTStakingRewards.Revealer>(from: BasicBeastsNFTStakingRewards.RevealerStoragePath)
        
        if(checkRef == nil) {
            signer.save(<-BasicBeastsNFTStakingRewards.createNewRevealer(), to: BasicBeastsNFTStakingRewards.RevealerStoragePath)
        }

        self.revealerRef = signer.borrow<&BasicBeastsNFTStakingRewards.Revealer>(from: BasicBeastsNFTStakingRewards.RevealerStoragePath)!

    }

    execute {
        let limit = (IDs.length < maxQuantity) ? IDs.length : maxQuantity
        var i = 0

        while i < limit {
            let mappedReward = IDs[i]
            let nftID = mappedReward.keys[0]
            let rewardItemID = mappedReward[nftID]!
            self.revealerRef.revealRewardItem(nftID: nftID, rewardItemID: rewardItemID)
            i = i + 1
        }
    }
}