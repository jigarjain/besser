import knex from 'knex';

export const DB_CONFIG = {
  client: process.env.DB_DIALECT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
};

export default knex({
  ...DB_CONFIG
});
