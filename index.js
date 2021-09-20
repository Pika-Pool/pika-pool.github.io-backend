'use strict';

if (process.env.NODE_ENV !== 'production') require('dotenv-safe').config();

const express = require('express');
const cors = require('cors');

const app = express();

const whitelist = process.env.CORS_WHITELIST.split(',').map(url => {
	try {
		return new URL(url);
	} catch (err) {
		return url;
	}
});
const corsOptions = {
	origin: (origin, cb) => {
		if (whitelist.findIndex(url => url === '*' || origin === url.origin) !== -1)
			cb(null, true);
		else cb(new Error('CORS not allowed'));
	},
	preflightContinue: true,
	methods: ['POST', 'GET', 'OPTIONS'],
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const messageList = [];

app.post('/contact', (req, res) => {
	const { name, email, message } = req.body;

	console.log({ name, email, message });
	if (
		name != undefined &&
		name.length >= 1 &&
		email != undefined &&
		/^\S+@\S+$/.test(email) &&
		message != undefined &&
		message.length >= 10 &&
		message.length <= 5000
	) {
		messageList.push({ name, email, message });
		res.send();
		return;
	}

	res
		.status(400)
		.send(
			'Validation failed for request parameters. Use the official website to send requests'
		);
});

app.get('/contact', (req, res) => {
	const { srispecial } = req.query;
	if (srispecial === process.env.SRI_SPECIAL) res.json(messageList);
	else res.status(404).send('<h1>404</h1>');
});

app.use('*', (req, res) => {
	res.status(404).send('<h1>404</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
