import BasicBeastsRaids from "../contracts/BasicBeastsRaids.cdc"

pub fun main(address: Address): UInt64? {
    if let nftID = BasicBeastsRaids.getPlayerOptIn(address: address) {
        if BasicBeastsRaids.hasNFT(address: address, nftID: nftID) {
            return nftID
        }
    }
    return nil
}