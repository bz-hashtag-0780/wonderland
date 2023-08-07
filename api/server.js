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

	const decryptPrivateKey = await flowService.decryptPrivateKey(
		'U2FsdGVkX196AX6NFGA47rzzQEzRxKT92spvw6DidmaZKm6frxQVKo/iTlB+QqicRl6Kziwqr8GP3ZIgdwFNCfm5IrIW/3Hv2DdLl0jyCM1R6T594l43h99OmUa4jBn3'
	);
	console.log('key: ', decryptPrivateKey);
});
