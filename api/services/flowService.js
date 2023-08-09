const fcl = require('@onflow/fcl');
const CryptoJS = require('crypto-js');
require('dotenv').config();

fcl.config()
	.put('fcl.limit', 9999)
	.put('flow.network', process.env.FLOW_NETWORK)
	.put('accessNode.api', process.env.ACCESS_NODE_API)
	.put('0xBasicBeastsNFTStaking', process.env.ADMIN_ADDRESS)
	.put('0xBasicBeastsNFTStakingRewards', process.env.ADMIN_ADDRESS);

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

	static AdminKeys = {
		0: false,
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false,
		7: false,
		8: false,
		9: false,
		10: false,
	};

	static async giveRewards(IDs) {
		let transaction = `
import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards

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
        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.AdminKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(IDs, t.Array(t.UInt64)),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
				let event = tx.events.find(
					(e) =>
						e.type ==
						'A.4c74cb420f4eaa84.BasicBeastsNFTStakingRewards.RewardItemAdded'
				);
				if (!event) {
					console.log('No rewards given');
					return;
				}
				console.log('Rewards added');
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static async changeRewardPerSecond(rewardPerSecond) {
		let transaction = `
import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards

transaction(rewardPerSecond: UFix64) {
    let adminRef: &BasicBeastsNFTStakingRewards.Admin

    prepare(signer: AuthAccount) {
        // get admin resource
        self.adminRef = signer.borrow<&BasicBeastsNFTStakingRewards.Admin>(from: BasicBeastsNFTStakingRewards.AdminStoragePath)
            ?? panic("No admin resource in storage")

    }

    execute {
        self.adminRef.changeRewardPerSecond(seconds: rewardPerSecond)
    }
}
        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.AdminKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(rewardPerSecond, t.UFix64),
			]);

			if (txid) {
				await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static async getRewardPerSecond() {
		let script = `
import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards

pub fun main(): UFix64 {
    return BasicBeastsNFTStakingRewards.rewardPerSecond
}
        `;

		const rewardPerSecond = await fcl.query({
			cadence: script,
		});

		return rewardPerSecond;
	}
}

module.exports = flowService;
