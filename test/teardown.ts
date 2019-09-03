import dotenv from 'dotenv';
dotenv.config();
import db from '../src/dbConnection';

async function dropTestDatabase() {
  // eslint-disable-next-line no-console
  console.log('Destroying database connections');
  await db.destroy();
}

export default async function() {
  await dropTestDatabase();
  // eslint-disable-next-line no-console
  console.log('Teardown completed!');
}
