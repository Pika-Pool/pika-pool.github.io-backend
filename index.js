if (process.env.NODE_ENV !== 'production') require('dotenv-safe').config();

const express = require('express');
const cors = require('cors');

const app = express();

const whitelist = process.env.CORS_WHITELIST.split(',').map(
	url => new URL(url)
);
const corsOptions = {
	origin: (origin, cb) => {
		if (
			whitelist[0] === '*' ||
			whitelist.findIndex(url => origin === url.origin) !== -1
		)
			cb(null, true);
		else cb(new Error('CORS not allowed'));
	},
	methods: ['POST'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const messages = [];

app.post('/contact', (req, res) => {
	const { name, email, message } = req.body;

	console.log({ name, email, message });
	if (
		name != null &&
		name.length >= 1 &&
		email != null &&
		/^\S+@\S+$/.test(email) &&
		message != null &&
		message.length >= 10 &&
		message.length <= 5000
	) {
		messages.push({ name, email, message });
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
	if (srispecial === process.env.SRI_SPECIAL) res.json(message);
	else res.status(404).send('<h1>404</h1>');
});

app.use('*', (req, res) => {
	res.status(404).send('<h1>404</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
