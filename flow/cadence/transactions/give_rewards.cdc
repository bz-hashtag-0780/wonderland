import BasicBeastsNFTStakingRewards from "../contracts/BasicBeastsNFTStakingRewards.cdc"

transaction(IDs: [UInt64]) {
    let adminRef: &BasicBeastsNFTStakingRewards.Admin

    prepare(signer: AuthAccount) {
        // get admin resource
        self.adminRef = signer.borrow<&BasicBeastsNFTStakingRewards.Admin>(from: BasicBeastsNFTStakingRewards.AdminStoragePath)
            ?? panic("No admin resource in storage")

    }

    execute {
        for id in IDs {
            self.adminRef.giveReward(toID: id)
        }
    }
}