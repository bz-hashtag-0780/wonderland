const fcl = require('@onflow/fcl');
const CryptoJS = require('crypto-js');
require('dotenv').config();

fcl.config()
	.put('flow.network', 'testnet')
	.put('accessNode.api', 'https://rest-testnet.onflow.org')
	.put('0xBasicBeastsNFTStaking', '0x4c74cb420f4eaa84')
	.put('0xBasicBeastsNFTStakingRewards', '0x4c74cb420f4eaa84');

class flowService {
	static encryptPrivateKey(key) {
		const secret = process.env.SECRET_PASSPHRASE;
		const encrypted = CryptoJS.AES.encrypt(key, secret).toString();
		return encrypted;
	}

	static decryptPrivateKey(encrypted) {
		const secret = process.env.SECRET_PASSPHRASE;
		const decrypted = CryptoJS.AES.decrypt(encrypted, secret).toString(
			CryptoJS.enc.Utf8
		);
		return decrypted;
	}

	static async getAdminAccountWithKeyIndex(keyIndex) {
		const FlowSigner = (await import('../utils/signer.mjs')).default;
		const key = this.decryptPrivateKey(
			process.env.ADMIN_ENCRYPTED_PRIVATE_KEY
		);

		const signer = new FlowSigner(
			process.env.ADMIN_ADDRESS,
			key,
			keyIndex,
			{}
		);
		return signer;
	}
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
