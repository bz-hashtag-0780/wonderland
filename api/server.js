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
	console.log('Eligible NFTs: ', eligibleNFTs);
});
