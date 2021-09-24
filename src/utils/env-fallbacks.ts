require("dotenv").config();

export const PORT = process.env.PORT || "6000";
export const NODE_ENV = process.env.NODE_ENV || "development";

export const USER_AUTH_TOKEN = process.env.USER_AUTH_TOKEN;
export const USER_COOKIE = process.env.USER_COOKIE;
export const TEST_URL = process.env.TEST_URL;
export const BASE_SLACK_URL = process.env.BASE_SLACK_URL;
export const DEFAULT_CHANNEL = process.env.DEFAULT_CHANNEL;

export const DATABASE_URL = process.env.DATABASE_URL;
export const DEV_DATABASE_URL = process.env.DEV_DATABASE_URL;
export const TESTING_DATABASE_URL = process.env.TESTING_DATABASE_URL;

export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS as string) || 8;
export const JWT_SECRET = process.env.JWT_SECRET || "SET your .env variables";

export const SEED_PASSWORD = process.env.SEED_PASSWORD;
