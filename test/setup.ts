import dotenv from 'dotenv';
dotenv.config();
import db, { DB_CONFIG } from '../src/dbConnection';

async function setupTestDatabase() {
  // eslint-disable-next-line no-console
  console.log('\nCreating database:', DB_CONFIG.connection.database);
  await db.migrate.latest();
}

export default async function() {
  await setupTestDatabase();
  // eslint-disable-next-line no-console
  console.log('Setup completed!');
}
