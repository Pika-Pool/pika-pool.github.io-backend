declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			CORS_WHITELIST: string;
			GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
			GOOGLE_PRIVATE_KEY: string;
			GOOGLE_SPREADSHEET_ID: string;
			GOOGLE_CLIENT_ID: string
		}
	}
}

export {};
