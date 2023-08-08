import BasicBeastsNFTStakingRewards from "../contracts/BasicBeastsNFTStakingRewards.cdc"

transaction() {
    let adminRef: &BasicBeastsNFTStakingRewards.Admin

    prepare(signer: AuthAccount) {
        // get admin resource
        self.adminRef = signer.borrow<&BasicBeastsNFTStakingRewards.Admin>(from: BasicBeastsNFTStakingRewards.AdminStoragePath)
            ?? panic("No admin resource in storage")

    }

    execute {
        self.adminRef.changeRewardPerSecond(seconds: 86400.0)
    }
}