export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {

PORT: string;
NODE_ENV: "development" | "production" | "testing";

USER_AUTH_TOKEN: string;
USER_COOKIE: string;
TEST_URL: string;
BASE_SLACK_URL: string;
DEFAULT_CHANNEL: string;

DATABASE_URL: string;
DEV_DATABASE_URL: string;
TESTING_DATABASE_URL: string;

BCRYPT_ROUNDS: string;
JWT_SECRET: string;

SEED_PASSWORD: string;
    }
  }
}