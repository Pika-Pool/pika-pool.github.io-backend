'use strict';

if (process.env.NODE_ENV !== 'production') require('dotenv-safe').config();

import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { URL } from 'url';
import sheets from './sheets';

const app = express();

const whitelist = process.env.CORS_WHITELIST.split(',').map(url => {
	try {
		return new URL(url);
	} catch (err) {
		return url;
	}
});
const corsOptions: cors.CorsOptions = {
	origin: (origin, cb) => {
		console.log(origin);
		if (
			whitelist.findIndex(
				url =>
					(typeof url === 'object' && origin === url.origin) || url === '*',
			) !== -1
		) {
			return cb(null, true);
		}

		cb(new Error('CORS not allowed'));
	},
	methods: ['POST', 'GET', 'OPTIONS'],
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/contact', async (req, res) => {
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
		try {
			await sheets.spreadsheets.values.append({
				spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
				range: 'Sheet1!A2:C',
				valueInputOption: 'USER_ENTERED',
				requestBody: {
					values: [[name, email, message, new Date().toISOString()]],
				},
			});

			res.sendStatus(201);
		} catch (err) {
			console.error(err);
			res.status(500).json({ err: 'Could not write to sheet' });
		}

		return;
	}

	res.status(400).json({
		err: 'Validation failed for request parameters. Use the official website to send requests',
	});
});

app.use('*', (_req, res) => res.sendStatus(404));

app.use(((err, _req, res, _next) => {
	console.error(err);
	res.sendStatus(500);
}) as ErrorRequestHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
