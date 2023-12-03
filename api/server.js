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

	const delay = 2000;

	if (eligibleResources.length > 0) {
		const chunks = splitIntoChunks(eligibleResources, max);
		for (let i = 0; i < Math.min(keysLimit, chunks.length); i++) {
			await new Promise((resolve) => setTimeout(resolve, delay));
			flowService.addRewards(chunks[i]);
		}
	}
}

async function processFlovatarEligible() {
	const eligibleResources = await flowService.getFlovatarRewardEligible();
	console.log('Eligible Flovatars: ', eligibleResources.length);

	const max = 20;
	const keysLimit = 201;
	const rewardPerSecond = await flowService.getFlovatarRewardPerSecond();
	console.log('Reward Per Second', rewardPerSecond);

	const delay = 2000;

	if (eligibleResources.length > 0) {
		const chunks = splitIntoChunks(eligibleResources, max);
		for (let i = 0; i < Math.min(keysLimit, chunks.length); i++) {
			await new Promise((resolve) => setTimeout(resolve, delay));
			flowService.addFlovatarRewards(chunks[i]);
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

app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	// Call the functions once the server starts
	await processEligibleQuestingResources();
	await processFlovatarEligible();
	// await processDiscordHandles();
	// // Then run the functions every hour
	setInterval(processEligibleQuestingResources, 1 * 60 * 60 * 1000); // hour in milliseconds
	setInterval(processFlovatarEligible, 1 * 60 * 60 * 1000); // hour in milliseconds
	// setInterval(processDiscordHandles, 1 * 60 * 60 * 1000); // hour in milliseconds

	// await flowService.changeRewardPerSecond('604800.0');
	// let rewardPerSecond = await flowService.getRewardPerSecond();
	// console.log(rewardPerSecond);

	// await processEligibleQuestingResources();

	// await flowService.changeFlovatarRewardPerSecond('604800.0');
	// let rewardPerSecond = await flowService.getRewardPerSecond();
	// console.log(rewardPerSecond);
	// await processFlovatarEligible();
});
