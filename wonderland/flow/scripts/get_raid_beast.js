export const GET_RAID_BEAST = `
import BasicBeastsRaids from 0xBasicBeastsRaids

pub fun main(address: Address): UInt64? {
    if let nftID = BasicBeastsRaids.getPlayerOptIn(address: address) {
        if BasicBeastsRaids.hasNFT(address: address, nftID: nftID) {
            return nftID
        }
    }
    return nil
}
`;
