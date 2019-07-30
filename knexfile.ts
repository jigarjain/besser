import dotenv from 'dotenv';
dotenv.config();
import { DB_CONFIG } from './src/dbConnection';

module.exports = {
  development: {
    ...DB_CONFIG
  },

  staging: {
    ...DB_CONFIG,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    ...DB_CONFIG,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
