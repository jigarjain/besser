import knex from 'knex';

const isTestEnv = process.env.NODE_ENV === 'test';

export const DB_CONFIG = {
  client: process.env.DB_DIALECT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: isTestEnv ? process.env.TEST_DB_NAME : process.env.DB_NAME
  },
  pool: {
    min: 0,
    max: 5,
    idleTimeoutMillis: 500
  }
};

export default knex({
  ...DB_CONFIG
});
