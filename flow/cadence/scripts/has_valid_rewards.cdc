import BasicBeastsNFTStakingRewards from "../contracts/BasicBeastsNFTStakingRewards.cdc"
import BasicBeastsRaids from "../contracts/BasicBeastsRaids.cdc"

pub fun main(address: Address): Bool {
    if let nftID = BasicBeastsRaids.getPlayerOptIn(address: address) {
        return BasicBeastsNFTStakingRewards.hasRewardItemOne(nftID: nftID) != nil || BasicBeastsNFTStakingRewards.hasRewardItemTwo(nftID: nftID) != nil 
    }
    return false
}