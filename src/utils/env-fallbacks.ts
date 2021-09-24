require("dotenv").config();

export const PORT: string = process.env.PORT || "6000";
export const NODE_ENV: string = process.env.NODE_ENV || "development";

export const USER_AUTH_TOKEN: string = process.env.USER_AUTH_TOKEN;
export const USER_COOKIE: string = process.env.USER_COOKIE;
export const TEST_URL: string = process.env.TEST_URL;
export const BASE_SLACK_URL: string = process.env.BASE_SLACK_URL;
export const DEFAULT_CHANNEL: string = process.env.DEFAULT_CHANNEL;

export const DATABASE_URL: string = process.env.DATABASE_URL;
export const DEV_DATABASE_URL: string = process.env.DEV_DATABASE_URL;
export const TESTING_DATABASE_URL: string = process.env.TESTING_DATABASE_URL;

export const BCRYPT_ROUNDS: number = parseInt(process.env.BCRYPT_ROUNDS) || 8;
export const JWT_SECRET: string = process.env.JWT_SECRET || "SET your .env variables";

export const SEED_PASSWORD: string = process.env.SEED_PASSWORD;
