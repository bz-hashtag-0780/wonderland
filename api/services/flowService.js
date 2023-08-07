const fcl = require('@onflow/fcl');

fcl.config()
	.put('flow.network', 'testnet')
	.put('accessNode.api', 'https://rest-testnet.onflow.org')
	.put('0xBasicBeastsNFTStaking', '0x4c74cb420f4eaa84')
	.put('0xBasicBeastsNFTStakingRewards', '0x4c74cb420f4eaa84');

const AdminAddress = '0x4c74cb420f4eaa84';

class flowService {
	static async getRewardEligibleNFTs() {
		let script = `
import BasicBeastsNFTStaking from 0xBasicBeastsNFTStaking
import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards

pub fun main(): [UInt64] {
    var IDs: [UInt64] = []
    var stakers = BasicBeastsNFTStaking.getStakers()
    var adjustedStakingDates = BasicBeastsNFTStaking.getAllAdjustedStakingDates()
    var currentBlockTimestamp = getCurrentBlock().timestamp

    for staker in stakers {
        let cap: Capability<&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}>? = getAccount(staker).capabilities.get<&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}>(BasicBeastsNFTStaking.CollectionPublicPath)
    
        var collectionRef:&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}?  = nil
        
        if(cap != nil) {
            collectionRef = cap!.borrow()
        }

        if(collectionRef != nil) {
            let beastIDs = collectionRef!.getIDs()

            for id in beastIDs {
                if let adjustedStakingDate = adjustedStakingDates[id] {
                    let timeStaked = currentBlockTimestamp - adjustedStakingDate

                    if timeStaked >= BasicBeastsNFTStakingRewards.rewardPerSecond {
                        IDs.append(id)
                    }
                }
            }
        }
    }

    return IDs
}
        `;

		const eligibleNFTs = await fcl.query({
			cadence: script,
		});

		return eligibleNFTs;
	}
}

module.exports = flowService;
