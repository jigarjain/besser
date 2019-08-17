import * as Knex from 'knex';
import { DB_TABLE } from '../src/constants';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table(DB_TABLE.GOALS, t => {
    t.dropColumn('type');
  });
}

export async function down(): Promise<any> {}
