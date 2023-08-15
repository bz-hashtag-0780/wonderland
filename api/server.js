const express = require('express');
const morgan = require('morgan');
const flowService = require('./services/flowService');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.send('Hello, Express with JavaScript!');
});

async function processEligibleNFTs() {
	const eligibleNFTs = await flowService.getRewardEligibleNFTs();
	console.log('Eligible NFTs: ', eligibleNFTs.length);

	const max = 50;
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

function splitIntoChunks(arr, chunkSize) {
	const chunks = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		chunks.push(arr.slice(i, i + chunkSize));
	}
	return chunks;
}

app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	// Call the function once the server starts
	await processEligibleNFTs();
	// Then run the function every hour
	setInterval(processEligibleNFTs, 1 * 60 * 60 * 1000); // hour in milliseconds
});
