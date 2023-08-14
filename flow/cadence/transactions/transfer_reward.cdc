import BasicBeastsNFTStakingRewards from "../contracts/BasicBeastsNFTStakingRewards.cdc"

transaction(fromID: UInt64, toID: UInt64, rewardItemID: UInt32) {
    let adminRef: &BasicBeastsNFTStakingRewards.Admin

    prepare(signer: AuthAccount) {
        // get admin resource
        self.adminRef = signer.borrow<&BasicBeastsNFTStakingRewards.Admin>(from: BasicBeastsNFTStakingRewards.AdminStoragePath)
            ?? panic("No admin resource in storage")

    }

    execute {
        self.adminRef.transferReward(fromID: fromID, toID: toID, rewardItemID: rewardItemID)
    }
}