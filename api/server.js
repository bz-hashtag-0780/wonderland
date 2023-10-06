const express = require('express');
const morgan = require('morgan');
const flowService = require('./services/flowService');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello, Express with JavaScript!');
});

async function processEligibleNFTs() {
	const eligibleNFTs = await flowService.getRewardEligibleNFTs();
	console.log('Eligible NFTs: ', eligibleNFTs.length);

	const max = 20;
	const keysLimit = 201;
	const rewardPerSecond = await flowService.getRewardPerSecond();
	console.log('Reward Per Second', rewardPerSecond);

	if (eligibleNFTs.length > 0) {
		const chunks = splitIntoChunks(eligibleNFTs, max);
		var i = 0;
		while (i < keysLimit && i < chunks.length) {
			flowService.giveRewards(chunks[i], i);
			i = i + 1;
		}
	}
}

async function processEligibleQuestingResources() {
	const eligibleResources =
		await flowService.getRewardEligibleQuestingResources();
	console.log('Eligible Questing Resources: ', eligibleResources.length);

	const max = 20;
	const keysLimit = 201;
	const rewardPerSecond = await flowService.getRewardPerSecond();
	console.log('Reward Per Second', rewardPerSecond);

	if (eligibleResources.length > 0) {
		const chunks = splitIntoChunks(eligibleResources, max);
		var i = 0;
		while (i < keysLimit && i < chunks.length) {
			flowService.addRewards(chunks[i], i);
			i = i + 1;
		}
	}
}

function splitIntoChunks(arr, chunkSize) {
	const chunks = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		chunks.push(arr.slice(i, i + chunkSize));
	}
	return chunks;
}

async function processDiscordHandles() {
	const addressToDiscordIds = await flowService.getAddressToDiscord();
	const IDs = Object.values(addressToDiscordIds);
	const latestIdsToDiscordHandles = {};

	try {
		for (const key in IDs) {
			const response = await getDiscordUserInfo(IDs[key]);
			const username = response.data.username;
			latestIdsToDiscordHandles[IDs[key]] = username;
		}
	} catch (error) {
		console.error('Error Discord API:', error.message);
	}

	const idsToDiscordHandles = await flowService.getIdsToDiscordHandles();

	// Compare latestIdsToDiscordHandles with idsToDiscordHandles
	let isDifferent = false;
	for (let id in latestIdsToDiscordHandles) {
		if (latestIdsToDiscordHandles[id] !== idsToDiscordHandles[id]) {
			isDifferent = true;
			break;
		}
	}

	// If there are differences, update idsToDiscordHandles
	if (isDifferent) {
		await flowService.updateIdsToDiscordHandles(latestIdsToDiscordHandles);
		const update = await flowService.getIdsToDiscordHandles();
	}
}

const getDiscordUserInfo = async (discordUserId) => {
	try {
		const response = await axios.get(
			`https://discord.com/api/v10/users/${discordUserId}`,
			{
				headers: {
					Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
				},
			}
		);
		return response;
	} catch (error) {
		console.error('Error with Discord API:', error.message);
		throw new Error('Error with Discord API');
	}
};

// app.listen(PORT, async () => {
// 	console.log(`Server is running on http://localhost:${PORT}`);
// Call the functions once the server starts
// await processEligibleNFTs();
// await processDiscordHandles();
// // Then run the functions every hour
// setInterval(processEligibleNFTs, 1 * 60 * 60 * 1000); // hour in milliseconds
// setInterval(processDiscordHandles, 1 * 60 * 60 * 1000); // hour in milliseconds

// // Create a new minter & make sure to add a minter name
// flowService.createMinter('Beastz Rewards');

// // Add reward templates & make sure to add the right minter id
// flowService.addRewardTemplate('0');

// await flowService.changeRewardPerSecond('1000.0');

// let rewardPerSecond = await flowService.getRewardPerSecond();
// console.log(rewardPerSecond);

// let NFTs = await flowService.getRewardEligibleQuestingNFTs();
// console.log(NFTs);

// await processEligibleQuestingResources();
// flowService.moveReward('120407210', '120683918', '173503011');

// });

app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	// Call the functions once the server starts

	// How to Setup Questing For An NFT Project
	// Uncomment one function and run one at a time

	/**
	 * 1. Setup The NFT Collection on Your Quest Manager Account
	 * Why: To receive the NFT & to get it's 'type'
	 */
	// flowService.setup_beastz_collection();

	/**
	 * 2. Make sure you have received the NFT from another account
	 */

	/**
	 * 3. Create a Quest that uses the 'NFT type' you want the Quest to support
	 * Why: To allow NFTs to quest and receive rewards
	 */
	// flowService.createQuest();

	/**
	 * 4. Create a Quest Reward Minter. Be sure to give it a descriptive name.
	 * Why: To create Reward Templates & mint Quest Rewards
	 * Result: You can check your results like this https://testnet.flowview.app/account/0xcecb7655469cad83/storage/WonderlandQuestManager_2
	 */
	// flowService.createMinter('Beastz Rewards');

	/**
	 * 5. Add Reward Templates to the Quest Reward Minter
	 * Why: To mint Quest Rewards with onchain metadata
	 * Tip: Find your Minter ID using flowview.app or read the transaction and look for the event MinterDeposited
	 */
	// flowService.addRewardTemplate('0');

	/**
	 * 6. Now anyone with the NFTs can quest and receive rewards
	 * if you set up a server where your quest manager account
	 * checks for NFTs who are eligible and add rewards to them
	 */
});
