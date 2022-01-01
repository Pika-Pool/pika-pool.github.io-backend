import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
	credentials: {
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		client_id: process.env.GOOGLE_CLIENT_ID,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replaceAll(/\\n/g, '\n'),
	},
	scopes: [
		'https://www.googleapis.com/auth/drive',
		'https://www.googleapis.com/auth/drive.file',
		'https://www.googleapis.com/auth/spreadsheets',
	],
});

const sheets = google.sheets({ auth, version: 'v4' });

export default sheets;
