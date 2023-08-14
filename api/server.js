const express = require('express');
const morgan = require('morgan');
const flowService = require('./services/flowService');

const app = express();
const PORT = 8000;

app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.send('Hello, Express with JavaScript!');
});

app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);

	const eligibleNFTs = await flowService.getRewardEligibleNFTs();
	console.log('Eligible NFTs: ', eligibleNFTs.length);

	const max = 50;
	const keysLimit = 51;

	await flowService.changeRewardPerSecond('86400.0');
	// await flowService.changeRewardPerSecond('60.0');

	await flowService.addKeys('150');
	const rewardPerSecond = await flowService.getRewardPerSecond();
	console.log('Reward Per Second', rewardPerSecond);

	// if (eligibleNFTs.length > 0) {
	// 	const chunks = splitIntoChunks(eligibleNFTs, max);
	// 	var i = 0;
	// 	while (i < keysLimit && i < chunks.length) {
	// 		flowService.giveRewards(chunks[i], i);
	// 		i = i + 1;
	// 	}
	// }
});

function splitIntoChunks(arr, chunkSize) {
	const chunks = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		chunks.push(arr.slice(i, i + chunkSize));
	}
	return chunks;
}
