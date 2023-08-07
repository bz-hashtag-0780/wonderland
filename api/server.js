const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 8000;

app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.send('Hello, Express with JavaScript!');
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
