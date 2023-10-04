const fcl = require('@onflow/fcl');
const CryptoJS = require('crypto-js');
require('dotenv').config();

fcl.config()
	.put('fcl.limit', 9999)
	.put('flow.network', process.env.FLOW_NETWORK)
	.put('accessNode.api', process.env.ACCESS_NODE_API)
	.put('0xBasicBeastsNFTStaking', process.env.ADMIN_ADDRESS)
	.put('0xBasicBeastsNFTStakingRewards', process.env.ADMIN_ADDRESS)
	.put('0xBasicBeastsRaids', process.env.ADMIN_ADDRESS)
	.put('0xDiscordHandles', process.env.ADMIN_ADDRESS)
	.put('0xQuesting', process.env.WONDERLAND_CONTRACT_ADDRESS)
	.put('0xQuestReward', process.env.WONDERLAND_CONTRACT_ADDRESS)
	.put('0xWonderlandRewardAlgorithm', process.env.WONDERLAND_CONTRACT_ADDRESS)
	.put('0xRewardAlgorithm', process.env.WONDERLAND_CONTRACT_ADDRESS)
	.put('0xBasicBeasts', process.env.BASIC_BEASTS_CONTRACT_ADDRESS)
	.put('0xMetadataViews', process.env.METADATA_VIEWS_CONTRACT_ADDRESS)
	.put('0xNonFungibleToken', process.env.NON_FUNGIBLE_TOKEN_CONTRACT_ADDRESS);

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

	// static AdminKeys = {
	// 	0: false,
	// 	1: false,
	// 	2: false,
	// 	3: false,
	// 	4: false,
	// 	5: false,
	// 	6: false,
	// 	7: false,
	// 	8: false,
	// 	9: false,
	// 	10: false,
	// 	11: false,
	// 	12: false,
	// 	13: false,
	// 	14: false,
	// 	15: false,
	// 	16: false,
	// 	17: false,
	// 	18: false,
	// 	19: false,
	// 	20: false,
	// 	21: false,
	// 	22: false,
	// 	23: false,
	// 	24: false,
	// 	25: false,
	// 	26: false,
	// 	27: false,
	// 	28: false,
	// 	29: false,
	// 	30: false,
	// 	31: false,
	// 	32: false,
	// 	33: false,
	// 	34: false,
	// 	35: false,
	// 	36: false,
	// 	37: false,
	// 	38: false,
	// 	39: false,
	// 	40: false,
	// 	41: false,
	// 	42: false,
	// 	43: false,
	// 	44: false,
	// 	45: false,
	// 	46: false,
	// 	47: false,
	// 	48: false,
	// 	49: false,
	// 	50: false,
	// 	51: false,
	// 	52: false,
	// 	53: false,
	// 	54: false,
	// 	55: false,
	// 	56: false,
	// 	57: false,
	// 	58: false,
	// 	59: false,
	// 	60: false,
	// 	61: false,
	// 	62: false,
	// 	63: false,
	// 	64: false,
	// 	65: false,
	// 	66: false,
	// 	67: false,
	// 	68: false,
	// 	69: false,
	// 	70: false,
	// 	71: false,
	// 	72: false,
	// 	73: false,
	// 	74: false,
	// 	75: false,
	// 	76: false,
	// 	77: false,
	// 	78: false,
	// 	79: false,
	// 	80: false,
	// 	81: false,
	// 	82: false,
	// 	83: false,
	// 	84: false,
	// 	85: false,
	// 	86: false,
	// 	87: false,
	// 	88: false,
	// 	89: false,
	// 	90: false,
	// 	91: false,
	// 	92: false,
	// 	93: false,
	// 	94: false,
	// 	95: false,
	// 	96: false,
	// 	97: false,
	// 	98: false,
	// 	99: false,
	// 	100: false,
	// };

	static AdminKeys = (() => {
		let keys = {};
		for (let i = 0; i < 500; i++) {
			keys[i] = false;
		}
		return keys;
	})();

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
		this.AdminKeys[keyIndex] = true;
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

		this.AdminKeys[keyIndex] = true;
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

	static async addKeys(numOfKeys) {
		let transaction = `
		transaction(publicKeyHex: String, numOfKeys: Int) {
			prepare(signer: AuthAccount) {
				let publicKey = publicKeyHex.decodeHex()
		
				let key = PublicKey(
					publicKey: publicKey,
					signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
				)
		
				var i = 0
				while i < numOfKeys {
					signer.keys.add(
						publicKey: key,
						hashAlgorithm: HashAlgorithm.SHA3_256,
						weight: 1000.0
					)
					i = i + 1
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

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(process.env.ADMIN_PUBLIC_KEY, t.String),
				arg(numOfKeys, t.Int),
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

	static async burnReward(nftID, rewardItemID) {
		let transaction = `
import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards

transaction(nftID: UInt64, rewardItemID: UInt32) {
    let adminRef: &BasicBeastsNFTStakingRewards.Admin

    prepare(signer: AuthAccount) {
        // get admin resource
        self.adminRef = signer.borrow<&BasicBeastsNFTStakingRewards.Admin>(from: BasicBeastsNFTStakingRewards.AdminStoragePath)
            ?? panic("No admin resource in storage")

    }

    execute {
        self.adminRef.burnReward(nftID: nftID, rewardItemID: rewardItemID)
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

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(nftID, t.UInt64),
				arg(rewardItemID, t.UInt32),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
				let event = tx.events.find(
					(e) =>
						e.type ==
						'A.4c74cb420f4eaa84.BasicBeastsNFTStakingRewards.RewardItemRemoved'
				);
				if (!event) {
					console.log('No reward burned');
					return;
				}
				console.log('Reward burned');
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static async transferReward(fromID, toID, rewardItemID) {
		let transaction = `
import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards

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

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(fromID, t.UInt64),
				arg(toID, t.UInt64),
				arg(rewardItemID, t.UInt32),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
				let event = tx.events.find(
					(e) =>
						e.type ==
						'A.4c74cb420f4eaa84.BasicBeastsNFTStakingRewards.RewardItemMoved'
				);
				if (!event) {
					console.log('No reward transferred');
					return;
				}
				console.log('Reward transferred');
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static async randomRaid(address) {
		let transaction = `
import BasicBeastsRaids from 0xBasicBeastsRaids

transaction(attacker: Address) {

	let gameMasterRef: &BasicBeastsRaids.GameMaster

	prepare(signer: AuthAccount) {
		self.gameMasterRef = signer.borrow<&BasicBeastsRaids.GameMaster>(from: BasicBeastsRaids.GameMasterStoragePath)!
	}

	execute {
		self.gameMasterRef.randomRaid(attacker: attacker)
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

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(address, t.Address),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
				let event = tx.events.find(
					(e) =>
						e.type ==
						'A.4c74cb420f4eaa84.BasicBeastsRaids.RaidEvent'
				);
				if (!event) {
					console.log('No raid');
					return;
				}
				console.log('Raid succeeded!', event.data.raidRecordID);
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static async getAddressToDiscord() {
		let script = `
import BasicBeastsRaids from 0xBasicBeastsRaids

pub fun main(): {Address: String} {
    return BasicBeastsRaids.getAddressToDiscords()
}
        `;

		const addressToDiscords = await fcl.query({
			cadence: script,
		});

		return addressToDiscords;
	}

	static async getIdsToDiscordHandles() {
		let script = `
import DiscordHandles from 0xDiscordHandles

pub fun main(): {String: String} {
    return DiscordHandles.getIdsToDiscordHandles()
}
        `;

		const idsToDiscordHandles = await fcl.query({
			cadence: script,
		});

		return idsToDiscordHandles;
	}

	static async updateIdsToDiscordHandles(idsToDiscordHandles) {
		console.log('hello');
		console.log(idsToDiscordHandles);
		let transaction = `
import DiscordHandles from 0xDiscordHandles

transaction(idsToDiscordHandles: {String: String}) {

	let adminRef: &DiscordHandles.Admin

	prepare(signer: AuthAccount) { 
		self.adminRef = signer.borrow<&DiscordHandles.Admin>(from: DiscordHandles.AdminStoragePath)
			?? panic("No admin resource in storage")

	}

	execute {
		let IDs = idsToDiscordHandles.keys
		var i = 0
		while i < IDs.length {
			let discordID = IDs[i]
			self.adminRef.updateHandle(discordID: discordID, discordHandle: idsToDiscordHandles[discordID]!)
			i = i + 1
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

		const transformedArray = Object.entries(idsToDiscordHandles).map(
			([key, value]) => ({
				key: key,
				value: value,
			})
		);

		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(
					transformedArray,
					t.Dictionary({ key: t.String, value: t.String })
				),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.AdminKeys[keyIndex] = false;
				let event = tx.events.find(
					(e) =>
						e.type ==
						'A.4c74cb420f4eaa84.DiscordHandles.UpdatedHandle'
				);
				if (!event) {
					console.log('No updated handles');
					return;
				}
				console.log('Updated idsToDiscordHandles', update);
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	/**
	 * Wonderland Live Product
	 *
	 */

	static async getQuestManagerAccountWithKeyIndex(keyIndex) {
		const FlowSigner = (await import('../utils/signer.mjs')).default;
		const key = this.decryptPrivateKey(
			process.env.QUEST_MANAGER_ENCRYPTED_PRIVATE_KEY
		);

		const signer = new FlowSigner(
			process.env.QUEST_MANAGER_ADDRESS,
			key,
			keyIndex,
			{}
		);
		return signer;
	}

	static QuestManagerKeys = {
		0: false,
	};

	static async setup_beastz_collection() {
		let transaction = `
		import BasicBeasts from 0xBasicBeasts
		import NonFungibleToken from 0xNonFungibleToken
		import MetadataViews from 0xMetadataViews
		
		transaction() {
			prepare(signer: AuthAccount) {
				if signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath) == nil {
					signer.save(<-BasicBeasts.createEmptyCollection(), to: BasicBeasts.CollectionStoragePath)
		
					signer.capabilities.unpublish(BasicBeasts.CollectionPublicPath)
		
					let issuedCap = signer.capabilities.storage.issue<&BasicBeasts.Collection{BasicBeasts.BeastCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(BasicBeasts.CollectionStoragePath)
		
					signer.capabilities.publish(issuedCap, at: BasicBeasts.CollectionPublicPath)
				}
		
			}
		}
        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.QuestManagerKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		this.QuestManagerKeys[keyIndex] = true;
		const signer = await this.getQuestManagerAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.QuestManagerKeys[keyIndex] = false;
				console.log('Beast Collection Created');
			}
		} catch (e) {
			this.QuestManagerKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static generateEvent(address, contractName, eventName) {
		if (address.startsWith('0x')) {
			address = address.substring(2); // Remove the '0x' prefix
		}
		return 'A.' + address + '.' + contractName + '.' + eventName;
	}

	static async createQuest() {
		let transaction = `
		import Questing from 0xQuesting
		import BasicBeasts from 0xBasicBeasts
		
		transaction() {
		
			let questManagerRef: &Questing.QuestManager
			let type: Type
		
			prepare(signer: AuthAccount) {
		
				// create Quest Manager
				if signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath) == nil {
					signer.save(<-Questing.createQuestManager(), to: Questing.QuestManagerStoragePath)
		
					signer.capabilities.unpublish(Questing.QuestManagerPublicPath)
		
					let issuedCap = signer.capabilities.storage.issue<&Questing.QuestManager{Questing.QuestManagerPublic}>(Questing.QuestManagerStoragePath)
		
					signer.capabilities.publish(issuedCap, at: Questing.QuestManagerPublicPath)
				}
		
				// borrow Quest Manager reference
				self.questManagerRef = signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath)??panic("Could not borrow Quest Manager reference")
		
				// Get resource type from a random beast
				let nftCollectionRef = signer.borrow<&BasicBeasts.Collection>(from: BasicBeasts.CollectionStoragePath)??panic("Couldn't borrow staking collection")
		
				let IDs = nftCollectionRef.getIDs()
		
				let beast <- nftCollectionRef.withdraw(withdrawID: IDs[0])
		
				self.type = beast.getType()
		
				nftCollectionRef.deposit(token: <-beast)
		
			}
		
			execute {
				self.questManagerRef.createQuest(type: self.type)
			}
		}

        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.QuestManagerKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		this.QuestManagerKeys[keyIndex] = true;
		const signer = await this.getQuestManagerAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.QuestManagerKeys[keyIndex] = false;

				let eventName = this.generateEvent(
					process.env.WONDERLAND_CONTRACT_ADDRESS,
					'Questing',
					'QuestCreated'
				);

				let event = tx.events.find((e) => e.type == eventName);
				if (!event) {
					console.log('no quest created');
					return;
				}
				console.log('Quest Created');
			}
		} catch (e) {
			this.QuestManagerKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}

	static async createMinter(minterName) {
		let transaction = `
		import Questing from 0xQuesting
		import QuestReward from 0xQuestReward
		
		transaction(minterName: String) {
		
			let questManagerRef: &Questing.QuestManager
		
			prepare(signer: AuthAccount) {
		
				// create Quest Manager
				if signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath) == nil {
					signer.save(<-Questing.createQuestManager(), to: Questing.QuestManagerStoragePath)
		
					signer.capabilities.unpublish(Questing.QuestManagerPublicPath)
		
					let issuedCap = signer.capabilities.storage.issue<&Questing.QuestManager{Questing.QuestManagerPublic}>(Questing.QuestManagerStoragePath)
		
					signer.capabilities.publish(issuedCap, at: Questing.QuestManagerPublicPath)
				}
		
				// borrow Quest Manager reference
				self.questManagerRef = signer.borrow<&Questing.QuestManager>(from: Questing.QuestManagerStoragePath)??panic("Could not borrow Quest Manager reference")
				
			}
		
			execute {
				// create and deposit minter
				self.questManagerRef.depositMinter(minter: <-QuestReward.createMinter(name: minterName))
			}
		
		}

        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.QuestManagerKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			return;
		}

		this.QuestManagerKeys[keyIndex] = true;
		const signer = await this.getQuestManagerAccountWithKeyIndex(keyIndex);
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(minterName, t.String),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceSealed();
				this.QuestManagerKeys[keyIndex] = false;

				let eventName = this.generateEvent(
					process.env.WONDERLAND_CONTRACT_ADDRESS,
					'Questing',
					'MinterDeposited'
				);

				let event = tx.events.find((e) => e.type == eventName);
				if (!event) {
					console.log('no minter created');
					return;
				}
				console.log('Minter Created');
			}
		} catch (e) {
			this.QuestManagerKeys[keyIndex] = false;
			console.log(e);
			return;
		}
	}
}

module.exports = flowService;
